'use strict';
const {ipcRenderer} = require('electron');
const xlsx = require('xlsx')
const filterUtils = require('./filterUtils')
const SUFFIX_COLKEYS = "_headers"

var tempExcelData;
window.onload = function () {
  ipcRenderer.on("readFile-start", (event, arg) => {
    var tStart = window.performance.now();

    var result = new Excel().init(arg.data)
    tempExcelData = result
    var tEnd = window.performance.now()
    console.log(`初始化数据耗时${ tEnd - tStart }毫秒`)

    ipcRenderer.send("readFile-response", {result})
  })

  ipcRenderer.on("filter-start", (event, arg) => {
    var tStart = window.performance.now();

    var result = filterHandler(arg)
    
    var tEnd = window.performance.now()
    console.log(`过滤数据耗时${ tEnd - tStart }毫秒`)
    console.log("state.excelData.exportFileByWB", arg.excelData.exportFileByWB)

    ipcRenderer.send("filter-response", {result})
  })

  ipcRenderer.on("exportFile-start", (event, arg) => {
    var tStart = window.performance.now();

    tempExcelData.exportFileByWB(arg)

    var tEnd = window.performance.now()
    console.log(`导出文件耗时${ tEnd - tStart }毫秒`)

    ipcRenderer.send("exportFile-response", {info: "成功导出"})
  })
}

function filterHandler(arg){
  var {excelData, filterTagList, filterWay} = arg
  var tempFilteredData = Object.assign({}, excelData)
  for(var i = 0, len = excelData.sheetNameList.length; i < len; i++) {
    var curSheetName = excelData.sheetNameList[i]
    var curFilterTagList = filterTagList[curSheetName]
    var colKeys = excelData[curSheetName + SUFFIX_COLKEYS]

    if(curFilterTagList.length !== 0){
      tempFilteredData[curSheetName] = tempFilteredData[curSheetName].filter((row, index) => {
        var rowExpStr = ""
        for(var i = 0, len = curFilterTagList.length; i < len; i++) {
          var cTag = curFilterTagList[i]
          var cFilters = cTag.filters

          var groupId = cTag.groupId
          var tagLogicChar = cTag.logicOperator === "and" ? "&&" : "||"

          var oneTagResult
          var groupExpStr = ""

          // 遍历当前组的 filters
          cFilters.forEach((cF, index) => {
            var filterLogicChar = cF.logicOperator === "and" ? "&&" : "||"
            var filterType = cF.filterType
            var filterCol = cF.col
            var operator = cF.operator
            var colOperator = cF.colOperator
            var target = cF.value
            var needConformColIndex = cF.needConformColIndex

            var oneFilterResult

            if(filterType === 0){
              oneFilterResult = (filterUtils.filterByOneOperator({row, colKeys, filterCol, operator, target}))
            }else if(filterType === 1){
              oneFilterResult = (filterUtils.filterByMultiColCalc({row, colKeys, filterCol, operator, target, colOperator}))
            }else if(filterType === 2){
              oneFilterResult = (filterUtils.filterByDoubleColsRange({row, colKeys, filterCol, operator, target, needConformColIndex}))
            }
            groupExpStr = groupExpStr + filterLogicChar + oneFilterResult

            if(filterLogicChar === "||" && oneFilterResult === true) {
              console.log("某filter符合")
              return true // as break
            }
          })
          groupExpStr = groupExpStr.replace(/^[|&]*/ig, "")
          oneTagResult = eval(groupExpStr)

          
          rowExpStr = rowExpStr + tagLogicChar + oneTagResult 
          if(tagLogicChar === "||" && oneTagResult === true) {
            console.log("某组符合")
            break;
          }
        }
        rowExpStr = rowExpStr.replace(/^[|&]*/ig, "")
        console.log(rowExpStr)
        var rowResult = eval(rowExpStr)
        console.log("eval(rowExpStr)", rowResult)
        // return rowResult
        return filterWay == 0 ? rowResult : !rowResult
      })
      console.log(i + "tempFilteredData[curSheetName]", tempFilteredData[curSheetName])
    }
  }

  return tempFilteredData
}

function Excel() {
  this.workbook = null,
  this.sheetNameList = null
}

Excel.prototype = {
  constructor: Excel,

  init(data) {
    var isParseSuccess = true
    try{
      if(typeof data === 'string'){
        this.readByData(data)
      }else if(typeof data === 'object'){
        this.workbook = data
      }
    }catch(e){
      isParseSuccess = false
      ipcRenderer.send("sync-alert-dialog", {
        content: "不支持该文件格式"
      })
    }
    if(isParseSuccess) {
      try{
        this.initData()
      }catch(e){
        console.log(e)
        ipcRenderer.send("sync-alert-dialog", {
          content: "Excel内容的格式不符合要求，故导致文件解析失败"
        })
      }
      return this
    } else{
       return {}
    }
    
  },
  readByData(data) {
    // 用于前端上传文件，如：上传按钮和拖拽上传
    this.workbook = xlsx.read(data, { type: 'binary' })
  },
  readByFileName(filename){
    // 用于 Node 直接通过路径读取文件
    this.workbook = xlsx.readFile(filename)
  },
  initData(){
    console.log("第一个阶段开始，sheetNameList")
    // 表名列表
    this.sheetNameList = this.workbook.SheetNames 
    console.log("第一个阶段结束，sheetNameList")

    console.log("第二个阶段开始，sheet_to_json")

    // 插入每个sheet的数据（json格式）
    this.sheetNameList.forEach((curSheetName, index) => {
      this[curSheetName] = xlsx.utils.sheet_to_json(this.workbook.Sheets[curSheetName])
    })
    console.log("第二个阶段结束，sheet_to_json")


    console.log("第三个阶段开始，表头初始化")
    // 获取表头
    this.sheetNameList.forEach((curSheetName, index) => {
      var curSheetData = this.workbook.Sheets[curSheetName]
      this[curSheetName + '_headers'] = []
      var scope = this.workbook.Sheets[curSheetName]["!ref"].split(":") // A1 F5
      var startIndex = getNumCol(extractLetters(scope[0])) // 从 1 开始
      var endIndex = getNumCol(extractLetters(scope[1]))

      var emptyIndex = 0    
      for(var i = startIndex; i <= endIndex; i++){
        var curColKey = curSheetData[getCharCol(i) + '1'] == undefined ? `表头空${emptyIndex++}` : curSheetData[getCharCol(i) + '1'].v
        this[curSheetName + '_headers'].push(curColKey)
      }
    })
    console.log("this", this)
    console.log("第三个阶段结束，表头初始化")

  },
  exportFileByWB(args) {
    var {filteredData, excelData, writeOpts} = args
    var finalWB = {
      SheetNames: [],
      Sheets: {}
    }
    var sheetNameList = this.sheetNameList
    sheetNameList.forEach((sheetName, i) => {
      var start = window.performance.now()
      var wbTem = this.jsonToWBForOneSheet(filteredData[sheetName], excelData[sheetName + SUFFIX_COLKEYS], sheetName)
      var end = window.performance.now()
      console.log("转化一个表需要", (end-start))
      finalWB.SheetNames.push(wbTem.SheetNames[0])
      Object.assign(finalWB.Sheets, {
        [sheetName]: wbTem["Sheets"][sheetName]
      })
    })
    console.log(finalWB)
    ipcRenderer.send("sync-saveFile-dialog", {
      filename: "过滤后的文件.xlsx",
      data: finalWB
    })
    // console.log(xlsx.writeFile(finalWB, fileName)) // Node导出
    // var wbout = XLSX.write(finalWB, {bookType:'xlsx', bookSST:false, type: 'binary'});
    // saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), fileName)
  },

  jsonToWBForOneSheet(json, colkeys, sheetName) {
    var _headers = colkeys // 获取表头

    var headerStart = window.performance.now()
    var headers = _headers
      .map((v, i) => Object.assign({}, { v: v, position: getCharCol(i+1) + 1 }))
      .reduce((prev, next) => Object.assign({}, prev, {
        [next.position]: { v: next.v }
      }), {})
    var headerEnd = window.performance.now()
    console.log("构建头部需要时间：", headerEnd - headerStart)

    var bodyStart = window.performance.now()
    var data = json
      .map((v, i) => _headers.map((k, j) => Object.assign({}, { v: v[k], position: getCharCol(j+1) + (i + 2) })))
      .reduce((prev, next) => prev.concat(next))
      .reduce((prev, next) => Object.assign({}, prev, {
        [next.position]: { v: next.v }
      }), {});
    var bodyEnd = window.performance.now()
    console.log("构建数据部分需要时间：", bodyEnd - bodyStart)

    var output = Object.assign({}, headers, data)
    var outputPos = Object.keys(output)

    var ref = outputPos[0] + ':' + outputPos[outputPos.length - 1]
    var wb = {
      SheetNames: [sheetName],
      Sheets: {
        [sheetName]: Object.assign({}, output, { '!ref': ref })
      }
    }
    return wb
  }
}

// 提取字母
function extractLetters(str) {
  return str.replace(/[^a-zA-Z]+/g, '')
}

// 导出文件时用到
function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}
function getCharCol(n) {
  var temCol = "",
    s = "",
    m = 0

  while (n > 0) {
    m = n % 26
    if (m === 0) m = 26
    s = String.fromCharCode(m + 64) + s
    n = (n - m) / 26
  }
  return s
}
function getNumCol(s) {
  if (!s) return 0
  var n = 0
  for (var i = s.length - 1, j = 1; i >= 0; i--, j *= 26) {
    var c = s[i].toUpperCase()
    if (c < 'A' || c > "Z") return 0
    n += (c.charCodeAt() - 64) * j
  }

  return n
}