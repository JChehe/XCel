import * as types from '../mutation-types'
import * as ExcelSet from '../../utils/ExcelSet'
import moment from "moment"
import lodash from "lodash"
import zh from "moment/locale/zh-cn"
import { ipcRenderer } from "electron"

moment.locale("zh") // 设置时间格式为中文

const SUFFIX_COLKEYS = "_headers"

var filterWay = window.localStorage.filterWay
                ? JSON.parse(window.localStorage.filterWay) : 0

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
  [types.SET_EXCEL_DATA] (state, arg) {
    state.excelData = arg.result
    initFilterState(state, state.excelData.sheetNameList)
  },

  [types.ADD_FILTER] (state, filter) {
    var curSheetName = state.activeSheet.name
    var filterTagList = state.filterTagList
  	if(state.excelData.sheetNameList && state.excelData.sheetNameList.length > 0){
  		var tempTagList = Object.assign({}, state.filterTagList)
      var curTagList = tempTagList[curSheetName]
      var isHasSameGroup = false
      
      // 判断当前filter是否存在组
      // 若存在，则判断是否存在同类组
      if( filter.groupId != "-1" ) {
        curTagList.forEach((item, index) => {
          // 若存在同类组
          if( filter.groupId === item.groupId ) {
            item.filters.push(filter)
            isHasSameGroup = true
            return true // as break
          }
        })
      }

      // 若不存在 或 找不到同类组
      if(!isHasSameGroup) {
        var filterObj = {
          groupId: filter.groupId,
          logicOperator: filter.logicOperator,
          filters: [filter]
        }
        curTagList.push(filterObj)
      }
      

	  	state.filterTagList = tempTagList
      
      tempTagList = null
      isChange = true
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
    ipcRenderer.send("exportFile-start", {
      filteredData: state.filteredData,
      excelData: state.excelData
    })
  },
  [types.SET_FILTERED_DATA] (state, data) {
    state.filteredData = data
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
