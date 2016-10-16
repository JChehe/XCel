import * as types from './mutation-types'
import {ipcRenderer} from "electron"
// 脚手架自带 actions
export const decrementMain = ({ dispatch }) => {
  dispatch(types.DECREMENT_MAIN_COUNTER)
}

export const incrementMain = ({ dispatch }) => {
  dispatch(types.INCREMENT_MAIN_COUNTER)
}


// 文件列表相关
export const changeFileType = ({ dispatch }, val) => {
	dispatch(types.SELECT_SEARCH_TYPE, val)
}

export const changeSearchVal = ({ dispatch }, val) => {
	dispatch(types.CHANGE_SEARCH_VALUE, val)
}
export const setUploadFiles = ({ dispatch }, val) => {
	dispatch(types.SET_UPLOAD_FILES, val)
}
export const delUploadFiles = ({ dispatch }, val) => {
	dispatch(types.DEL_UPLOAD_FILES, val)
}
export const setFileStatus = ({ dispatch }, val) => {
	dispatch(types.SET_UPLOAD_STATUS, val)
}
// 过滤Excel数据相关
export const setExcelData = ({ dispatch }, data) => {
	dispatch(types.SET_UPLOAD_STATUS, 0)
	ipcRenderer.send("readFile-start", {
    data: data
  })
  ipcRenderer.once("readFile-response", (event, arg) => {
  	dispatch(types.SET_UPLOAD_STATUS, -1)
  	dispatch(types.SET_EXCEL_DATA, arg)
  	dispatch(types.SET_ACTIVE_SHEET, 0)
  	dispatch(types.TOGGLE_FILTER_PANEL_STATUS, true)
  	dispatch(types.TOGGLE_SIDEBAR, true)
  })
}
export const setActiveSheet = ({ dispatch }, val) => {
	dispatch(types.SET_ACTIVE_SHEET, val)
}
export const addFilter = ({ dispatch }, val) => {
	dispatch(types.ADD_FILTER, val)
}
export const delFilter = ({ dispatch }, val) => {
	dispatch(types.DEL_FILTER, val)
}
export const setFilteredData = ({ dispatch }, val) => {
	dispatch(types.SET_FILTERED_DATA, val)
	dispatch(types.EXPORT_FILE, val)
}
export const setFilterStatus = ({ dispatch }, val) => {
	dispatch(types.SET_FILTER_STATUS, val)
}
export const setFilterWay = ({ dispatch }, val) => {
	dispatch(types.SET_FILTER_WAY, val)
}
export const toggleFilterPanelStatus = ({ dispatch },val) => {
	dispatch(types.TOGGLE_FILTER_PANEL_STATUS, val)
}

// 其他
export const toggleSideBar = ({ dispatch }, val) => {
	dispatch(types.TOGGLE_SIDEBAR, val)
}
export const exportFile = ({ dispatch }, val) => {
	dispatch(types.EXPORT_FILE, val)
}

// 窗口 window
export const toggleWindowMax = ({ dispatch }) => {
	dispatch(types.TOGGLE_WINDOW_MAX)
}
export const toggleWindowMini = ({ dispatch }) => {
	dispatch(types.TOGGLE_WINDOW_MINI)
}