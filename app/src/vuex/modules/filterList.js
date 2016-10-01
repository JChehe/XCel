import * as types from '../mutation-types'
import * as ExcelSet from '../../utils/ExcelSet'
import moment from "moment"
import lodash from "lodash"
import zh from "moment/locale/zh-cn"

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
      console.log("filter", filter)
      console.log("tempTagList", tempTagList)
      tempTagList = null
      // filteredDataCache[curSheetName+filter]
      // 筛选结果赋值
      // state.filteredData = addDelHandler()
  	}else{
      alert("您还没上传相应的Excel文件。")
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
  	if( len > 0){
      // 筛选结果赋值
      // state.filteredData = addDelHandler()
  	}else{
  		state.filteredData = Object.assign({}, state.excelData)
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

function addDelHandler(){
  var curSheetName = state.activeSheet.name
  var tempFilteredData = Object.assign({}, state.excelData)
  
  var tStart = window.performance.now();
  for(var i = 0, len = state.filterTagList[curSheetName].length; i < len; i++){
    var curFilter = state.filterTagList[curSheetName][i]
    var subFilters = curFilter.subFilters

    // 过滤操作
    tempFilteredData[curSheetName] = filterSet.filterDataHandler({
      sheetData: tempFilteredData[curSheetName],
      filterCol: curFilter.col,
      operator: curFilter.operator,
      target: curFilter.value,
      subFilters,
      colOperator: curFilter.colOperator
    })
  }
  var tEnd = window.performance.now();
  console.log(`过滤时间总耗时${ tEnd - tStart }毫秒`)
  state.filterStatus = 0
  return tempFilteredData
}

var filterSet = {
  mathOperaArr: [">", "<", ">=", "<="],
  conditionArr: ["=", "!=", "contain", "notContain", "startsWith", "endsWith", "regexp"],

  filterDataHandler(args) {
    var { sheetData, filterCol, operator, target, subFilters, colOperator} = args
    
    if(this.operatorIsAndOr(operator)) {
      if(_.isArray(filterCol)){
        console.log("第3.2种情况：双列范围逻辑的【or与and】")
        return this.filterByAndOrForDoubleColsRange({sheetData, filterCols: filterCol, operator, subFilters})
      }else{
        console.log("第1.2种情况：单列（组合）逻辑的【or与and】")
        return this.filterByAndOrForSingleCol({sheetData, filterCols: filterCol, operator, subFilters})
      }
    }else{
      // 单列组合逻辑（多列运算）
      if(_.isArray(filterCol)){
        if(colOperator.length === 0){
          console.log("第3.1种情况：双列范围逻辑的【非or与and】")
          return this.filterForDoubleColsRange({sheetData, filterCol, operator, target})
        }else{
          console.log("第2种情况：多列运算逻辑")
          return this.filterByMultiColCalc({sheetData, filterCol, colOperator, operator, target})
        }
      }else{
        console.log("第1.1种情况：单列（组合）逻辑的【非or与and】")
        return this.filterByOneOperator({sheetData, filterCol, operator, target})
      }
    }
  },
  filterByAndOrForDoubleColsRange(args) {
    var {sheetData, filterCols, operator, subFilters} = args
    operator = operator.toUpperCase()
    if(operator === "OR")
      return this.filterByOrForDoubleColsRange({sheetData, subFilters, filterCols})
    else if(operator === "AND")
      return this.filterByAndForDoubleColsRange({sheetData, subFilters, filterCols})
    else
      console.log("filterByAndOrForDoubleColsRange", "未匹配到operator")
  },
  filterByOrForDoubleColsRange(args) {
    var { sheetData, filterCols, subFilters } = args
    var colKeys = state.excelData[state.activeSheet.name + SUFFIX_COLKEYS]
    var result = sheetData.filter((rowData, index) => {
      var isRowPassed = false
      // 判断一行中的被选中的列是否符合【单列的或逻辑】，即3.2
      for(var i = 0, len = filterCols.length; i < len; i++) {
        var filterCol = filterCols[i]
        var isCurColPassed = this.filterByOrForRow({ 
          rowData,
          subFilters,
          filterCol
        })
        if(isCurColPassed) {
          isRowPassed = true
          break
        }
      }
      return isRowPassed
    })
    return result
  },
  filterByAndForDoubleColsRange(args) {
    var { sheetData, filterCols, subFilters } = args
    var colKeys = state.excelData[state.activeSheet.name + SUFFIX_COLKEYS]
    var result = sheetData.filter((rowData, index) => {
      var isRowPassed = false
      // 判断一行中被选中的列是否符合【单列的和逻辑】，即3.2
      for(var i = 0, len = filterCols.length; i < len; i++) {
        var filterCol = filterCols[i]
        var isCurColPassed = this.filterByAndForRow({
          rowData,
          subFilters,
          filterCol
        })
        // console.log("isCurColPassed", isCurColPassed)
        if(isCurColPassed) {
          isRowPassed = true
          break
        }
      }
      return isRowPassed
    })

    return result
  },
  
  filterByOneOperator(args){
    var {sheetData, filterCol, operator, target} = args
    var colKeys = state.excelData[state.activeSheet.name + SUFFIX_COLKEYS]
    var selectKey = colKeys[filterCol]

    var result = sheetData.filter((row, index) => {
      var curVal = row[selectKey]
      // 过滤掉空表格
      if(_.isUndefined(curVal))
        return false
      else
        return this.filterUnit({operator, curVal, target})
    })

    return result
  },
  // 双列范围逻辑的【非or、and】，即表单3.1
  filterForDoubleColsRange(args) {
    var { sheetData, filterCol, operator, target } = args
    var colKeys = state.excelData[state.activeSheet.name + SUFFIX_COLKEYS]
   
    var result = sheetData.filter( (rowData, index) => {
      var isRowPassed = false
      // 判断每列中是否有一列符合单一逻辑，即3.1
      for(var i = 0, len = filterCol.length; i < len; i++) {
        var selectKey = filterCol[i]
        var curKey = colKeys[selectKey]
        var isCurColPassed = this.filterUnit({
          operator,
          curVal: rowData[curKey],
          target: target
        })
        if(isCurColPassed) {
          isRowPassed = true
          break
        }
      }
      return isRowPassed
    })

    // console.log("Result", result)
    return result
  },
  // 第二个表单：多列运算逻辑
  filterByMultiColCalc(args){
    // 此处 filterCol 是数组
    var { sheetData, filterCol, colOperator, operator, target } = args
    var colKeys = state.excelData[state.activeSheet.name + SUFFIX_COLKEYS]
    var result = sheetData.filter((row, index) => {
      // 传递每行数据进来
      var rowCalcResult = this.calcMultiCol({
        row,
        colOperator,
        filterCol
      })

      return this.filterUnit({
        operator,
        curVal: rowCalcResult,
        target
      })
    })
    // console.log("filterByMultiColCalc", result)
    return result
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
    if(!isNaN(+curVal)){ // +"a" 是 NaN，另外：toFixed是为了避免浮点数的不精确表示，如 0.1+0.2 = 0.30000000000000004
      // 另外toFixed 返回的是字符串类型
      curVal = _.isNumber(+curVal) ? +(+curVal).toFixed(12) : (+curVal)
      target = _.isNumber(+target) ? +(+target).toFixed(12) : (+target)
    }
    
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
  },
  filterByAndOrForSingleCol( args ) {
    var { sheetData, filterCol, operator, subFilters } = args
    if(operator === "or") {
      return sheetData.filter((rowData, index) => {
        return this.filterByOrForRow({rowData, subFilters, filterCol})
      })
    }
    else if(operator === "and"){
      return sheetData.filter((rowData, index) => {
        return this.filterByAndForRow({rowData, subFilters, filterCol})
      })
    }
    else{
      console.log("filterByAndOrForSingleCol", "未匹配到operator")
    }
  },
  filterByOrForRow(args){
    var { rowData, subFilters, filterCol } = args
    var colKeys = state.excelData[state.activeSheet.name + SUFFIX_COLKEYS]
    var selectKey = colKeys[filterCol]

    var curVal = rowData[selectKey]
    var isPassed = false
    subFilters.forEach((curSubFilter, index) => {
      if(filterSet.filterUnit({
          operator: curSubFilter.operator, 
          curVal: curVal, 
          target: curSubFilter.val})){
        isPassed = true
        return true
      }
    })
    return isPassed
  },
  filterByAndForRow(args){
    var { rowData, subFilters, filterCol } = args
    var colKeys = state.excelData[state.activeSheet.name + SUFFIX_COLKEYS]
    var selectKey = colKeys[filterCol]
    var curVal = rowData[selectKey]
    var isPassed = true // 用于提前结束 forEach

    subFilters.forEach((curSubFilter, index) => {
      if(!filterSet.filterUnit({
          operator: curSubFilter.operator, 
          curVal: curVal, 
          target: curSubFilter.val})){
        isPassed = false
        return true // 用于提前结束 forEach
      }
    })
    return isPassed
  },
  operatorIsAndOr(operator){
    if(_.isString(operator)){
      operator = operator.toUpperCase()
      if(operator === "OR" || operator === "AND"){
        return true
      }
    }
    return false
  }
}

var calcSet = {
  plus(arr){
    var { row, filterCol } = args
    var result = +row[filterCol[0]]
    if(isNaN(result)) return undefined
    // var result = isNaN(+firstVal) ? "" : 0
    for(var i = 1, len = arr.length; i < len; i++){
      result += (+arr[i])
    }
    return isNaN(result) ? undefined : result
  },
  sub(arr){
    // 减法会将字符串转为 数字
    var result = arr[0];
    for(var i = 1, len = arr.length; i < len; i++){
      result -= arr[i]

    }
    // undefined 会被过滤掉
    return isNaN(result) ? undefined : result
  },
  multi(arr){
    var result = arr[0]
    for(var i = 1, len = arr.length; i < len; i++){
      result *= arr[i]
    }
    return isNaN(result) ? undefined : result
  },
  division(arr){
    var result = arr[0]
    for(var i = 1, len = arr.length; i < len; i++){
      result /= arr[i]
    }
    return isNaN(result) ? undefined : result
  },
  mod(arr) {
    var result = arr[0]
    for(var i = 1, len = arr.length; i < len; i++){
      result %= arr[i]
    }
    return isNaN(result) ? undefined : result
  }
}
