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

const state = {
  filterTagList: {}, // 筛选条件列表
  oriRow: {},
  filRow: {},
  colKeys: {},
  activeSheet: {
  	index: 0,
  	name: ""
  },
  sheetNameList: [],
  filterWay: filterWay, // 0 是保留, 1 是剔除
  isShowFillterPanel: false,
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
const mutations = {

  [types.SET_EXCEL_BASE_INFO] (state, arg) {
    Object.keys(arg).forEach((key, index) => {
      state[key] = arg[key]
    })
  },

  [types.ADD_FILTER] (state, filter) {
    var curSheetName = state.activeSheet.name
    var filterTagList = state.filterTagList
  	if(state.sheetNameList && state.sheetNameList.length > 0){
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

    tempTagList[curSheetName].splice(index, 1)
  	state.filterTagList = tempTagList

  	// 然后进行具体的过滤操作
  	var len = state.filterTagList[curSheetName].length
    isChange = true
    console.log("len", len)
    if(len < 1) {
      ipcRenderer.send("delAllFilterTag-start", {
        curActiveSheetName: curSheetName
      })
      state.filRow[curSheetName] = state.oriRow[curSheetName]
    }
  },
  
  [types.SET_ACTIVE_SHEET] (state, index) {
  	state.activeSheet = {
  		index,
  		name: state.sheetNameList[index]
  	}
  },

  [types.SET_FILTERED_DATA] (state, data) {
    state.filRow = data
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

