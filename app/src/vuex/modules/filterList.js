import * as types from '../mutation-types'
import * as ExcelSet from '../../utils/ExcelSet'
import moment from "moment"
import lodash from "lodash"
import zh from "moment/locale/zh-cn"
import { ipcRenderer } from "electron"

moment.locale("zh") // 设置时间格式为中文

const SUFFIX_COLKEYS = "_headers"

var filterWay = window.localStorage.filterWay ? JSON.parse(window.localStorage.filterWay) : 0

// console.log(_.isEqual(.1+.2, .3))
const state = {
  filterTagList: {}, // 筛选条件列表
  excelData: {},
  filteredData: {},
  activeSheet: {
  	index: 0,
  	name: ""
  },
  filterStatus: 0,
  filterWay: filterWay, // 0 是保留, 1 是剔除
  isShowFillterPanel: true,
  filterOptions: [
    {
  		char: ">",
  		words: "大于"
  	},{
  		char: "<",
  		words: "小于"
  	},{
  		char: ">=",
  		words: "大于或等于"
  	},{
  		char: "<=",
  		words: "小于或等于"
  	},{
  		char: "=",
  		words: "等于"
  	},{
      char: "!=",
      words: "不等于"
    },{
  		char: "contain",
  		words: "包含"
  	},{
      char: "notContain",
      words: "不包含"
    },{
  		char: "startsWith",
  		words: "开头字符"
  	},{
  		char: "endsWith",
  		words: "结束字符"
  	},{
  		char: "regexp",
  		words: "正则表达式"
  	}
  ]
}

var isChange = false
// 疑问：修改filterTagList 却不会触发DOM更新。而依赖于 activeSheet
const mutations = {
  [types.SET_EXCEL_DATA] (state, data) {
    var tStart = window.performance.now();
    state.excelData = new ExcelSet.Excel().init(data)

    initFilterState(state, state.excelData.sheetNameList)

    var tEnd = window.performance.now()
    console.log(`上传文件后，初始化数据耗时${ tEnd - tStart }毫秒`)
    console.log("第4阶段")
  },

  [types.ADD_FILTER] (state, filter) {
    var curSheetName = state.activeSheet.name
  	if(state.excelData.sheetNameList && state.excelData.sheetNameList.length > 0){
  		var tempTagList = Object.assign({}, state.filterTagList)
  		tempTagList[curSheetName].push(filter)
	  	state.filterTagList = tempTagList
      
      tempTagList = null
      isChange = true
      // filteredDataCache[curSheetName+filter]
      // 筛选结果赋值
      // state.filteredData = addDelHandler()
      // filterSet.structureExp()
  	}else{
      ipcRenderer.send("sync-alert-dialog", {
        content: "还没上传相应的Excel文件"
      })
    }
  },

  [types.DEL_FILTER] (state, index) {
    var curSheetName = state.activeSheet.name
		var tempTagList = Object.assign({}, state.filterTagList)

    // console.log("delete_index", index)
    tempTagList[curSheetName].splice(index, 1)
  	state.filterTagList = tempTagList

  	// 然后进行具体的过滤操作
  	var len = state.filterTagList[curSheetName].length
    isChange = true
  	if( len > 0){
      // 筛选结果赋值
      // state.filteredData = addDelHandler()
  	}else{
      var tempCurSheetData = Object.assign([], state.excelData[curSheetName])
  		state.filteredData[curSheetName] = tempCurSheetData
      state.filterStatus = 0
  	}
  },
  
  [types.SET_ACTIVE_SHEET] (state, index) {
  	state.activeSheet = {
  		index,
  		name: state.excelData.sheetNameList[index]
  	}
  },

  [types.EXPORT_FILE] (state, val) {
    state.excelData.exportFileByWB({
      filteredData: state.filteredData, 
      excelData: state.excelData, 
      fileName: "过滤后的Excel.xlsx"
    })
  },

  [types.SET_FILTER_STATUS] (state, val) {
    state.filterStatus = val
  },

  [types.SET_FILTER_WAY] (state, val) {
    state.filterWay = val
    window.localStorage.setItem("filterWay", JSON.stringify(val))
  },

  [types.TOGGLE_FILTER_PANEL_STATUS] (state, val) {
    if(_.isBoolean(val)) {
      state.isShowFillterPanel = val
    }else{
      state.isShowFillterPanel = !state.isShowFillterPanel
    }
  },
  [types.STRUCTURE_EXP] (state, val) {
    var tempFilteredData = Object.assign({}, state.excelData)
    if(!isChange){
      state.excelData.exportFileByWB({
        filteredData: state.filteredData, 
        excelData: state.excelData, 
        fileName: "过滤后的Excel.xlsx"
      })
      return
    }
    isChange = false
    for(var i = 0, len = state.excelData.sheetNameList.length; i < len; i++) {
      var curSheetName = state.excelData.sheetNameList[i]
      var curFilterTagList = state.filterTagList[curSheetName]
      var colKeys = state.excelData[curSheetName + SUFFIX_COLKEYS]

      if(curFilterTagList.length !== 0){
        tempFilteredData[curSheetName] = tempFilteredData[curSheetName].filter((row, index) => {
          var expStr = ""
          for(var i = 0, len = curFilterTagList.length; i < len; i++) {
            var cF = curFilterTagList[i]
            var logicChar = cF.logicOperator === "and" ? "&&" : "||"
            var filterType = cF.filterType
            var filterCol = cF.col
            var operator = cF.operator
            var colOperator = cF.colOperator
            var target = cF.value
            var needConformColIndex = cF.needConformColIndex
            // console.log(row, colKeys, filterCol, operator, target)
            var oneFilterResult;
            if(filterType === 0){
              oneFilterResult = (filterSet.filterByOneOperator({row, colKeys, filterCol, operator, target}))
            }else if(filterType === 1){
              oneFilterResult = (filterSet.filterByMultiColCalc({row, colKeys, filterCol, operator, target, colOperator}))
            }else if(filterType === 2){
              oneFilterResult = (filterSet.filterByDoubleColsRange({row, colKeys, filterCol, operator, target, needConformColIndex}))
            }
            expStr = expStr + logicChar + oneFilterResult 
            if(logicChar === "||" && oneFilterResult === true) {
              console.log("符合")
              break;
            }
          }
          expStr = expStr.replace(/^[|&]*/ig, "")
          console.log(expStr)
          var rowResult = eval(expStr)
          console.log("eval(expStr)", rowResult)
          return rowResult
        })
        console.log(i + "tempFilteredData[curSheetName]", tempFilteredData[curSheetName])
      }
    }
    
    // console.log("tempFilteredData", tempFilteredData)
    state.filteredData = tempFilteredData
    // console.log(state.excelData.exportFileByWB)
    // setTimeout(()=>{
    //   ipcRenderer.send("sync-export-file", {
    //     state
    //   })
    // }, 10)
    setTimeout(() => {
      state.excelData.exportFileByWB({
        filteredData: state.filteredData, 
        excelData: state.excelData, 
        fileName: "过滤后的Excel.xlsx"
      })
    }, 0)
    
  }
}

export default {
  state,
  mutations
}

function initFilterState(state, sheetNames) {
  for(var i = 0, len = sheetNames.length; i < len; i++) {
    state.filterTagList[sheetNames[i]] = []
    state.filteredData[sheetNames[i]] = Object.assign([], state.excelData[sheetNames[i]])
  }
}

var filterSet = {
  mathOperaArr: [">", "<", ">=", "<="],
  conditionArr: ["=", "!=", "contain", "notContain", "startsWith", "endsWith", "regexp"],
  
  filterByOneOperator(args){
    var {row, colKeys, filterCol, operator, target} = args
    var selectKey = colKeys[filterCol]
    var curVal = row[selectKey]
    if(curVal === undefined) {
      return false
    }else{
      return this.filterUnit({operator, curVal, target})
    }
  },
  // 双列范围逻辑的【非or、and】，即表单3.1
  filterByDoubleColsRange(args) {
    var { row, colKeys, filterCol, operator, target, needConformColIndex } = args
    
    var passCounter = 0

    // 判断每列中是否有一列符合单一逻辑，即3.1
    for(var i = 0, len = filterCol.length; i < len; i++) {
      var selectKey = filterCol[i]
      var curKey = colKeys[selectKey]
      var isCurColPassed = this.filterUnit({
        operator,
        curVal: row[curKey],
        target: target
      })
      if(isCurColPassed) {
        passCounter++
      }
      if(passCounter >= needConformColIndex){
        return true
      }
    }
    return false
  },
  // 第二个表单：多列运算逻辑
  filterByMultiColCalc(args){
    // 此处 filterCol 是数组
    var { row, colKeys, filterCol, operator, target, colOperator } = args
    var rowCalcResult = this.calcMultiCol({
      row,
      colOperator,
      filterCol
    })
    console.log({row, colOperator, filterCol})
    console.log(rowCalcResult)
    return this.filterUnit({
      operator,
      curVal: rowCalcResult,
      target
    })
  },
  // 计算每行是否符合要求
  calcMultiCol(args){
    var { row, colOperator, filterCol } = args
    var calcResult
    var colKeys = state.excelData[ state.activeSheet.name + SUFFIX_COLKEYS]
    if(!colOperator.includes('time')){
      calcResult = this.calcNum({row, colOperator, filterCol, colKeys})
      // console.log("calcResult", calcResult)
    }else{
      var date0 = moment(row[colKeys[filterCol[0] - 1]], "m/d/y hh:mm")
      var date1 = moment(row[colKeys[filterCol[1] - 1]], "m/d/y hh:mm")
      var diff = date1.diff(date0, "seconds")
      // minutes
      calcResult = Math.floor(diff/60)
    }
    return calcResult
  },
  calcNum(args){
    var {colOperator, row, filterCol, colKeys} = args
    var result = row[colKeys[filterCol[0]]]
    result = result === undefined ? 0 : +result
    if(isNaN(result)) return undefined
    console.log(colOperator, row, filterCol, colKeys)
    // console.log(filterCol)
    for(var i = 1, len = filterCol.length; i < len; i++){
      var cKey = colKeys[filterCol[i]]
      var curVal = row[cKey] === undefined ? 0 : +row[cKey]
      if(isNaN(curVal)) return undefined

      switch (colOperator){
        case "+": result += curVal; break;
        case "-": result -= curVal; break;
        case "*": result *= curVal; break;
        case "/": result /= curVal; break;
        case "%": result %= curVal; break;
        default: console.log("calcNumSet未匹配操作符")
      }
    }
    return isNaN(result) ? undefined : result
  },
  filterUnit(args){
    var { operator, curVal, target } = args
    if(operator == undefined || target == undefined || curVal == undefined){
      return false
    }
    if(!isNaN(+curVal) || !isNaN(+target)){ // +"a" 是 NaN，另外：toFixed是为了避免浮点数的不精确表示，如 0.1+0.2 = 0.30000000000000004
      // 另外toFixed 返回的是字符串类型
      curVal = _.isNumber(+curVal) ? +(+curVal).toFixed(12) : (+curVal)
      target = _.isNumber(+target) ? +(+target).toFixed(12) : (+target)
    }
    // console.log(typeof curVal, typeof operator, typeof target)
    // console.log(curVal,operator,target)
    switch (operator) {
      case ">": return (curVal > target); break;
      case "<": return (curVal < target); break;
      case "<=": return (curVal <= target); break;
      case ">=": return (curVal >= target); break;
      // 上面是逻辑操作符
      // 下面是字符串操作符
      // 因为= !=可用于字符串的对比，因此不放在逻辑操作符内
      // 下面的字符串方法对参数是Number也适用
      case "=": return (curVal == target); break;
      case "!=": return (curVal != target); break; 
      case "contain": return curVal.includes(target); break;
      case "notContain": return !curVal.includes(target); break;
      case "startsWith": return curVal.startsWith(target); break;
      case "endsWith": return curVal.endsWith(target); break;
      case "regexp":
        var regexp = new RegExp(target, "ig")
        return curVal.match(regexp); break;
      default: 
        console.log("未匹配操作符")
        return true
    }
  }
}
