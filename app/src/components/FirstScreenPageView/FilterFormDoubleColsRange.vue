<template>
	<form @submit.prevent="addFilterHandler">
		<table class="table">
			<tbody>
				<tr>
					<td>双列范围逻辑</td>
					<td>
						<span class="select">
							<select v-model="logicOperator">
								<option value="and">且</option>
								<option v-show="!curSheetSize.tagList.length == 0" value="or">或</option>
							</select>
							<p class="val_mask">{{ getLogicOperatorWords(logicOperator) }}</p>
						</span>
					</td>	
					<td>
						<input type="text" placeholder="输入列（以，隔开）" v-model="operatorCol" @change="generateNeedConformColNum" debounce="300">
					</td>
					<td class="controls">
						<span class="select">
							<select v-model="needConformColIndex">
								<option v-if="needConformColsNum===0" value="1">
									{{ generateNeedConformColWords(1) }} 
								</option>
								<option v-else track-by="$index" v-for="index in needConformColsNum" :value="index + 1">
									{{ generateNeedConformColWords(index+1) }}
								</option>
							</select>
							<p class="val_mask">{{ generateNeedConformColWords( needConformColIndex ) }}</p>
						</span>
					</td>
					<td>
						<span class="select">
							<select v-model="operator">
								<option v-for="op in filterOptions" 
									:value="op.char">
									{{ op.words }}
								</option>
							</select>
							<p class="val_mask">{{ getOperatorWords(filterOptions, operator) }}</p>
						</span>
					</td>
					<td>
							<input type="text" placeholder="请填写运算符的值" v-model="operatorVal">
					</td>
					<td>
						<group-select :group-id.sync="groupId"></group-select>
					</td>
					<td>
						<button type="submit">添加</button>
					</td>
				</tr>
			</tbody>
		</table>
	</form>
</template>

<script>
	import { addFilter, setFilterStatus } from '../../vuex/actions'
	import { getActiveSheet, getFilterOptions, getExcelData, getCurSheetSize } from '../../vuex/getters'
	import { getCharCol, getNumCol, getOperatorWords, getLogicOperatorWords, getFilterWordsPrimitive } from '../../utils/ExcelSet'
	import GroupSelect from './GroupSelect'
	import { ipcRenderer } from 'electron'

	export default {
		components: {
			GroupSelect
		},
		data(){
			return {
				operatorVal: "",
				operatorCol: "", // 最终会转为数组
				operatorColArr: [],
				operator: ">",
				logicOperator: "and",
				needConformColIndex: 1,
				isConformDoubleCols: true,
				groupId: -1
			}
		},
		vuex: {
			getters: {
				activeSheet: getActiveSheet,
				filterOptions: getFilterOptions,
				excelData: getExcelData,
				curSheetSize: getCurSheetSize
			},
			actions: {
				addFilter,
				setFilterStatus
			}
		},
		watch: {
			curSheetSize(){
				if(this.curSheetSize.tagList.length == 0) {
					this.logicOperator = "and"
				}
			}
		},
		computed: {
			// 只含有始末两个值
			needConformColsNum(){
				var operatorColArr = this.operatorColArr
				if(operatorColArr.length >= 2){
					// 取绝对值，让输入的列的顺序无关
					var startIndex = operatorColArr[0]
					var endIndex = operatorColArr[operatorColArr.length - 1]
					var distance = Math.abs( endIndex - startIndex )
					if(distance === 1) {
						distance = 2
					}else if(distance > 1) {
						distance += 1
					}
					this.needConformColIndex = 1
					return distance 
				}else{
					return 0
				}
			},
			filteredCols() {
				return this.curSheetSize && this.curSheetSize.filtered && this.curSheetSize.filtered.cols
			},
		},
		methods: {
			getNumCol,
			getCharCol,
			getLogicOperatorWords,
			getOperatorWords,
			getFilterWordsPrimitive,
			
			generateNeedConformColNum(){
				var curCols = this.operatorCol.trim()
				var tempColsArr = []
				// 去除两边的逗号和中间出现的空格
				curCols = curCols.replace(/^[，*,*]*/ig, "").replace(/[，*,*]*$/ig, "").replace(/\s/ig, "")

				// 切割为数组
				curCols = curCols.split(/[,，]+/)

				// 过滤掉中间的空元素
				curCols = curCols.filter((item, index) => {
					if(item === "" || item === null || item === undefined) {
						return false
					}else{
						return true
					}
				})
				// 数组中出现的字符转为数字
				for(var i = 0, len = curCols.length; i < len; i++){
					var cCol = curCols[i]
					if(cCol.match(/[a-z]/ig)){
						curCols.splice(i, 1, getNumCol(cCol))
					}
				}
				this.isConformDoubleCols = curCols.length === 2 ? true : false

				if(!this.isConformDoubleCols) {
					return this.operatorColArr = curCols
				}

				// 根据范围生成范围内所有的序列
				var startIndex = Math.min(Math.abs(+curCols[0]), Math.abs(curCols[1]))
				var endIndex = Math.max(Math.abs(+curCols[0]), Math.abs(curCols[1]))
				console.log("startIndex", startIndex, "endIndex", endIndex)
				for(var i = startIndex, len = endIndex; i <= len; i++){
					tempColsArr.push(i - 1)
				}
				this.operatorCol = `${tempColsArr[0] + 1},${tempColsArr[tempColsArr.length - 1] + 1}`
				console.log("tempColsArr", tempColsArr)

				this.operatorColArr = tempColsArr
			},
			generateNeedConformColWords(index){
				return index !== this.needConformColsNum ? `满足${index}列` : "满足全部列"
			},
			addFilterHandler() {
				var filterObj = {}
				var filterWords = ""
				var operatorColArr = this.operatorColArr
				var operator = this.operator
				var operatorWords = this.getOperatorWords(this.filterOptions, operator)
				var opVal = this.operatorVal.trim()

				if(!this.validateForm({operatorColArr, opVal})) {
					return
				}

				this.$nextTick(() => {
					this.setFilterStatus(1)
				})

				setTimeout(()=>{
					console.log("operatorColArr", operatorColArr)
					var preStr = `第${getCharCol(operatorColArr[0] + 1)}至第${getCharCol(operatorColArr[operatorColArr.length - 1] + 1)}列范围内的值中，至少有一个`
					
					filterWords = preStr + this.getFilterWordsPrimitive({
						operator,
						operatorWords,
						val: opVal
					})

					// 生成始末范围内的完成序列数组
					var tempCols = []
					
					console.log("根据首尾两元素获得它们之间的所有元素，并且所有元素进行减一处理", tempCols)
					filterObj = {
						filterType: 2,
						groupId: this.groupId,
						logicOperator: this.logicOperator,
						col: this.operatorColArr,
						operator: this.operator,
						value: opVal,
						filterWords: filterWords,
						needConformColIndex: this.needConformColIndex
					}
					console.log(filterObj)
					// 触发 action：目前只做了表述文字，还需要进行筛选的value值
					this.addFilter(filterObj)

					this.operatorVal = ""
				}, 0)
			},
			validateForm(args) {
				var { operatorColArr, opVal } = args
				var isValidated = false
				var tipWords = "双列范围逻辑："
					console.log("operatorColArr[0]", operatorColArr[0])
				if(operatorColArr.length === 0) {
					tipWords += "请填写列"
				}else if(!this.isConformDoubleCols) {
					tipWords += "只能填写两列，它会取指定两列范围内的所有列（包含自身）"
				}else if(operatorColArr[0] + 1 < 1) {
					tipWords += "列从1开始"
				}else if(this.filteredCols !== 0 && operatorColArr[operatorColArr.length - 1] + 1 > this.filteredCols){
					console.log("operatorColArr[operatorColArr.length - 1]", operatorColArr[operatorColArr.length - 1])
					tipWords += `超过最大列${this.filteredCols}`
				}else if(opVal.length === 0) {
					tipWords += "请填写运算符的值"
				}else {
					isValidated = true
				}

				if(!isValidated) {
					this.setFilterStatus(0)
					ipcRenderer.send("sync-alert-dialog", {
						content: tipWords
					})
					return false
				}else {
					 return true
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	
</style>