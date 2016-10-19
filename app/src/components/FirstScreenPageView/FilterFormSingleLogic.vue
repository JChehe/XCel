<template>
	<form @submit.prevent="addFilterHandler">
		<table class="table">
			<tbody>
				<tr>
					<td>单列运算逻辑</td>
					<td>
						<span class="select">
							<select v-model="logicOperator">
								<option value="and">且</option>
								<option v-show="!curSheetSize.tagList.length == 0" value="or">或</option>
							</select>
							<p class="val_mask">{{ getLogicOperatorWords(logicOperator)}}</p>
						</span>
					</td>
					<td>
						<!-- <input type="text" placeholder=""> -->
						<span class="select">
							<select v-model="operatorCol">
								<option value="0">请选择列</option>
								<option v-else v-for="col in colNum" 
									:value="$index+1">
									{{ getCharCol(col + 1) }}
								</option>
							</select>
							<p class="val_mask">{{ operatorCol == 0 ? "请选择列" : getCharCol(operatorCol) }}</p>
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
					<td class="placeholder_td"></td>
					<td>
						<input type="text" placeholder="请填写运算符的值" 
							v-model="operatorVal">
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
	import { addFilter } from '../../vuex/actions'
	import { getActiveSheet, getColKeys, getFilterOptions, getExcelData, getCurSheetSize } from '../../vuex/getters'
	import { getCharCol, getLogicOperatorWords, getOperatorWords, getFilterWordsPrimitive } from '../../utils/ExcelSet'
	import GroupSelect from './GroupSelect'
	import { ipcRenderer } from 'electron'

	export default {
		components: {
			GroupSelect
		},
		data(){
			return {
				operatorVal: "",
				operatorCol: '0',
				operator: ">",
				subFilterOperator: "",
				logicOperator: "and",
				groupId: -1
			}
		},
		vuex: {
			getters: {
				activeSheet: getActiveSheet,
				filterOptions: getFilterOptions,
				excelData: getExcelData,
				colKeys: getColKeys,
				curSheetSize: getCurSheetSize
			},
			actions: {
				addFilter
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
			colChar(){
				if(this.colKeys) {
					return this.colKeys.forEach((item, index) => {
						return this.getCharCol(index)
					})
				}
			},
			colNum(){
				if(this.colKeys)
					return this.colKeys.length
				else
					return 0
			},
		},
		methods: {
			getCharCol,
			getLogicOperatorWords,
			getOperatorWords,
			getFilterWordsPrimitive,
			addFilterHandler() {
				var filterObj = {}
				var filterWords = ""
				var curCol = this.operatorCol
				var operator = this.operator
				var operatorWords = this.getOperatorWords(this.filterOptions, operator)
				var opVal = this.operatorVal.trim()

				if(!this.validateForm({curCol, opVal})) {
					return
				}

				var preStr = `第${this.getCharCol(curCol)}列的值`
				filterWords = preStr + this.getFilterWordsPrimitive({
					operator,
					operatorWords,
					val: opVal
				})

				filterObj = {
					filterType: 0,
					groupId: this.groupId,
					logicOperator: this.logicOperator,
					col: curCol - 1,
					operator: this.operator,
					value: opVal,
					filterWords: filterWords
				}
				this.addFilter(filterObj)
				this.operatorVal = ""
			},
			validateForm(args) {
				var { curCol, opVal } = args
				var isValidated = false
				var tipWords = "单列运算逻辑："
				if(curCol == "0") {
					tipWords += "请选择列"
				}else if(opVal.length === 0) {
					tipWords += "请填写运算符的值"
				}else {
					isValidated = true
				}

				if(!isValidated) {
					ipcRenderer.send("sync-alert-dialog", {
						content: tipWords
					})
					return false
				}else{
					return true
				}
			}
		}
	}

</script>

<style lang="scss" scoped>
	
</style>