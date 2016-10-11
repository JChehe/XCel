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
export function getFileStatus(state) {
	return state.fileList.fileStatus
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
export function getFilterWay(state) {
	return state.filterList.filterWay
}
export function getFilterPanelStatus(state) {
	return state.filterList.isShowFillterPanel
}

export function getCurSheetSize(state) {
	var filterListState = state.filterList
	var excelData = filterListState.excelData
	var filteredData, curActiveSheetName, curActiveSheetIndex,
		curSheetData, curFilterTagList, curFilteredData,curColKeys
	if( excelData && excelData.sheetNameList && excelData.sheetNameList.length > 0){
		filteredData = state.filterList.filteredData
		curActiveSheetIndex = state.filterList.activeSheet.index
		curActiveSheetName = excelData.sheetNameList[curActiveSheetIndex]
		curSheetData = excelData[curActiveSheetName]
		curFilterTagList = filterListState.filterTagList && filterListState.filterTagList[curActiveSheetName]
		curFilteredData = filteredData[curActiveSheetName]
		curColKeys = excelData[curActiveSheetName + "_headers"]
	}
	return {
		origin: {
			rows: curSheetData && curSheetData.length || 0,
			cols: curColKeys && curColKeys.length || 0
		},
		filtered: {
			rows: curFilteredData && curFilteredData.length || 0,
			cols: curColKeys && curColKeys.length || 0
		},
		tagList: {
			length: curFilterTagList && curFilterTagList.length || 0
		}
	}
}


// 其他
export function getSideBarStatus(state) {
	return state.fileList.isShowSideBar
}
