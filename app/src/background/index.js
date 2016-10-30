'use strict';
const {ipcRenderer} = require('electron');
const xlsx = require('xlsx')
const filterUtils = require('./filterUtils')
const Excel = require('./excelUtils')
const generateHTMLString = require('./generateHTMLString')
const SUFFIX_COLKEYS = "_headers"
console.log("background进程pid：", process.pid)

var excelData;




window.onload = function () {
  ipcRenderer.on("readFile-start", (event, arg) => {
    /* excelData 的数据结构
    {
      sheetNameN: [] 所有行
      sheetNameN_headers: [] 所有列标题
      sheetNameList: []
      workbook: {} Excel 相关
    }
    */
    excelData = new Excel().init(arg.data)

    var oriRow = {}

    var activeSheetIndex = arg.activeSheetIndex || 0,
        activeSheetName = excelData.sheetNameList[activeSheetIndex],
        curColKeys = excelData[activeSheetName + SUFFIX_COLKEYS],
        curSheetData = excelData[activeSheetName];

    excelData.sheetNameList.forEach(function(sheetName, index){
      oriRow[sheetName] = 
    })

    ipcRenderer.send("readFile-response", {
      oriRow: curSheetData
    })
    ipcRenderer.send("generate-html-string", generateHTMLString({
      sheetData: curSheetData,
      colKeys: curColKeys
    })
  })

  ipcRenderer.on("filter-start", (event, arg) => {
    var result, tStart, tEnd
    tStart = window.performance.now();
    result = filterHandler(arg)
    tEnd = window.performance.now()
    console.log(`过滤数据耗时${ tEnd - tStart }毫秒`)
    console.log("state.excelData.exportFileByWB", arg.excelData.exportFileByWB)
    ipcRenderer.send("filter-response", {result})
  })

  ipcRenderer.on("exportFile-start", (event, arg) => {
    var tStart, tEnd
    tStart = window.performance.now()
    excelData.exportFileByWB(arg)
    tEnd = window.performance.now()
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
              return true // as break
            }
          })
          groupExpStr = groupExpStr.replace(/^[|&]*/ig, "")
          oneTagResult = eval(groupExpStr)
          
          rowExpStr = rowExpStr + tagLogicChar + oneTagResult 
          if(tagLogicChar === "||" && oneTagResult === true) {
            break;
          }
        }
        rowExpStr = rowExpStr.replace(/^[|&]*/ig, "")
        var rowResult = eval(rowExpStr)
        // return rowResult
        return filterWay == 0 ? rowResult : !rowResult
      })
      console.log(i + "tempFilteredData[curSheetName]", tempFilteredData[curSheetName])
    }
  }

  return tempFilteredData
}
