<template>
	<form @submit.prevent="addFilterHandler">
		<table class="table">
			<tbody>
				<tr>
					<td>多列运算逻辑</td>
					<td>
						<span class="select">
							<select v-model="logicOperator">
								<option value="and">且</option>
								<option v-show="!curSheetSize.tagList.length == 0" value="or" value="or">或</option>
							</select>
							<p class="val_mask">{{ getLogicOperatorWords(logicOperator) }}</p>
					</td>
					<td>
						<input type="text" placeholder="输入列（以，隔开）" v-model="operatorCol">
					</td>
					<td>
						<span class="select">
							<select v-model="colOperatorSelect">
								<option v-for="op in colOperator" 
									:value="op.char">
									{{ op.words }}
								</option>
							</select>
							<p class="val_mask">{{ getColArithmeticOperatorWords( colOperator, colOperatorSelect) }}</p>
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
							<p class="val_mask">{{ getOperatorWords( filterOptions, operator) }}</p>
						</span>
					</td>
					<td>
						<div>
							<input type="text" placeholder="请填写运算符的值" v-model="operatorVal">
						</div>
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
	import { colOperator, getNumCol, getCharCol, getOperatorWords, getColOperatorWords, getColArithmeticOperatorWords, getLogicOperatorWords, getFilterWordsPrimitive } from "../../utils/ExcelSet"
	import { getFilterOptions, getCurSheetSize } from '../../vuex/getters'
	import { addFilter, setFilterStatus } from '../../vuex/actions'
	import { ipcRenderer } from 'electron'

	export default{
		data(){
			return {
				operatorVal: "",
				operatorCol: "", // 最终会转为数组
				operator: ">",
				colOperatorSelect: "+",
				subFilters: [],
				logicOperator: "and",
				colOperator: colOperator
			}
		},
		vuex: {
			getters: {
				filterOptions: getFilterOptions,
				curSheetSize: getCurSheetSize
			},
			actions: {
				addFilter,
				setFilterStatus
			}
		},
		methods:{
			getNumCol,
			getOperatorWords,
			getColArithmeticOperatorWords,
			getLogicOperatorWords,
			getFilterWordsPrimitive,
			getColOperatorWords,
			addFilterHandler(){
				var filterObj = {}
				var filterWords = ""
				var curCols = this.operatorCol.trim()
				var operator = this.operator
				var operatorWords = this.getOperatorWords(this.filterOptions, operator)
				var opVal = this.operatorVal.trim()
				var colOperatorSelect = this.colOperatorSelect
				var colOperatorWords = this.getColOperatorWords(colOperator, colOperatorSelect)
				// 去除两边的逗号
				curCols = curCols.replace(/^[，*,*]*/ig, "").replace(/[，*,*]*$/ig, "")
				// 切割为数组
				curCols = curCols.split(/,?，?/)

				for(var i = 0, len = curCols.length; i < len; i++){
					var cCol = curCols[i]
					if(cCol.match(/[a-z]/ig)){
						curCols.splice(i, 1, getNumCol(cCol))
					}
				}

				if(!this.validateForm({curCols, opVal, colOperatorSelect})) {
					return
				}
			
				
				this.$nextTick(() => {
					this.setFilterStatus(1)
				})

				setTimeout( () => {
					var colText = ""; 
					curCols.forEach((col, index) => {
						colText += `, ${getCharCol(col)}`
					})
					// colText去掉逗号+空格）字符
					var preStr = `第${colText.slice(2)}列的值${colOperatorWords}`

					filterWords = preStr + this.getFilterWordsPrimitive({
						operator,
						colOperatorWords,
						operatorWords,
						val: opVal,
						colOperatorSelect
					})

					// 减一处理，以符合计算机的逻辑
					curCols.forEach((item, index) => {
						return curCols[index] = item - 1
					})

					filterObj = {
						col: curCols,
						operator: this.operator,
						value: opVal,
						filterWords: filterWords,
						subFilters: this.subFilters,
						colOperator: this.colOperatorSelect,
						logicOperator: this.logicOperator,
						filterType: 1
					}
					console.log("filterObj",filterObj)
					this.addFilter(filterObj)

					this.operatorCol = ""
					this.operatorVal = ""
				}, 0)
			},
			validateForm(args){
				var {curCols, opVal, colOperatorSelect} = args
				var isValidated = false
				var tipWords = "多列运算逻辑："

				if(curCols.length === 0) {
					tipWords += "请填写列"
				}else if(curCols.length < 2) {
					tipWords += "至少填写两列"
				}else if(opVal.length === 0) {
					tipWords += "请填写运算符"
				}else if(colOperatorSelect.includes("time") && curCols.length > 2) {
					tipWords += "中的时间相关操作只能选择两列"
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