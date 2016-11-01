'use strict';
const {ipcRenderer} = require('electron');
const xlsx = require('xlsx')
const filterUtils = require('./filterUtils')
const Excel = require('./excelUtils')
const generateHTMLString = require('./generateHTMLString')
const SUFFIX_COLKEYS = "_headers"
console.log("background进程pid：", process.pid)

var excelData
var filteredData
var colKeys = {}
var oriRow = {}
var filRow = {}


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

    oriRow = {}
    filRow = {}
    var filterTagList = {}
    var activeSheetIndex = arg.activeSheetIndex || 0,
        activeSheetName = excelData.sheetNameList[activeSheetIndex],
        curColKeys = excelData[activeSheetName + SUFFIX_COLKEYS],
        curSheetData = excelData[activeSheetName];

    excelData.sheetNameList.forEach(function(sheetName, index){
      oriRow[sheetName] = excelData[sheetName].length
      filRow[sheetName] = excelData[sheetName].length
      colKeys[sheetName] = excelData[sheetName + SUFFIX_COLKEYS]
      filterTagList[sheetName] = []
    })

    console.log("colKeys", colKeys)
    ipcRenderer.send("generate-htmlstring-response", {
      sheetHTML: generateHTMLString({
        sheetData: curSheetData,
        colKeys: curColKeys
      })
    })

    ipcRenderer.send("readFile-response", {
      oriRow,
      filRow,
      colKeys,
      filterTagList,
      sheetNameList: excelData.sheetNameList
    })
  })
  ipcRenderer.on("filter-start", (event, arg) => {
    filteredData = filterHandler(arg)
    var curActiveSheetName = arg.curActiveSheetName
    var curColKeys = colKeys[curActiveSheetName]
    var tempFilRow = {}
    
    excelData.sheetNameList.forEach((sheetName, index) => {
      tempFilRow[sheetName] = filteredData[sheetName].length
    })

    ipcRenderer.send("filter-response", {
      filRow: tempFilRow
    })

    ipcRenderer.send("generate-htmlstring-response", {
      sheetHTML: generateHTMLString({
        sheetData: filteredData[curActiveSheetName],
        colKeys: curColKeys
      })
    })
  })

  ipcRenderer.on("changeTab-start", (event, arg) => {
    console.log("changeTab")
    console.log("Arg", arg)
    filteredData = filterHandler(arg)
    var curActiveSheetName = arg.curActiveSheetName
    var curColKeys = colKeys[curActiveSheetName]
    var tempFilRow = {}

    ipcRenderer.send("generate-htmlstring-response", {
      sheetHTML: generateHTMLString({
        sheetData: filteredData[curActiveSheetName],
        colKeys: curColKeys
      })
    })
  })

  ipcRenderer.on("exportFile-start", (event, arg) => {
    console.log("arg", arg)
    excelData.exportFileByWB({
      filteredData,
      excelData
    })
    ipcRenderer.send("exportFile-response", {info: "成功导出"})
  })

  ipcRenderer.on("delAllFilterTag-start", (event, arg) => {
    var curActiveSheetName = arg.curActiveSheetName
    var curColKeys = colKeys[curActiveSheetName]
    var curSheetData = excelData[curActiveSheetName]

    ipcRenderer.send("generate-htmlstring-response", {
      sheetHTML: generateHTMLString({
        sheetData: curSheetData,
        colKeys: curColKeys
      })
    })

  })
}

function filterHandler(arg){
  var {filterTagList, filterWay} = arg
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
