// 脚手架自带的 getter
export function mainCounter (state) {
  return state.counters.main
}

// 文件列表相关
export function getUploadFiles(state) {
	return state.fileList.fileList
}
export function getAllFileType(state) {
	return state.fileList.allFileType
}
export function getCurSearchVal(state) {
	return state.fileList.curSearchVal
}	


// 过滤 Excel 数据相关
export function getFilterOptions(state) {
	return state.filterList.filterOptions
}
export function getExcelData(state) {
	return state.filterList.excelData
}
export function getActiveSheet(state) {
	return state.filterList.activeSheet
}
export function getFilterTagList(state) {
	return state.filterList.filterTagList
}
export function getFilteredData(state) {
	return state.filterList.filteredData
}
export function getColKeys(state) {
	var curSheet = state.filterList.activeSheet
	return state.filterList.excelData[curSheet.name + '_headers']
}
export function getFilterStatus(state) {
	return state.filterList.filterStatus
}
// 其他
export function getSideBarStatus(state) {
	return state.fileList.isShowSideBar
}
