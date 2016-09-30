<template>
	<form @submit.prevent="addFilterHandler">
		<table class="table">
			<tbody>
				<tr>
					<td>单列运算逻辑</td>
					<td>
						<span class="select">
							<select name="">
								<option value="and">且</option>
								<option value="or">或</option>
							</select>
							<p class="val_mask">且</p>
						</span>
					</td>
					<td>
						<span class="select">
							<select name="">
								<option value=">">请选择列</option>
							</select>
							<p class="val_mask">请选择列</p>
						</span>
					</td>
					<td>
						<span class="select">
							<select name="">
								<option value=">">大于</option>
							</select>
							<p class="val_mask">大于</p>
						</span>
					</td>
					<td class="placeholder_td">
						
					</td>
					<td>
						<input type="text" placeholder="请填写运算符的值">
					</td>
					<td>
						<filter-button class="btn" :filter-status="filterStatus"></filter-button>
					</td>
				</tr>
			</tbody>
		</table>
	</form>
</template>

<script>
	import filterButton from './filterButton'
	import { addFilter, setFilterStatus } from '../../vuex/actions'
	import { getActiveSheet, getColKeys, getFilterOptions, getExcelData } from '../../vuex/getters'
	import { getCharCol } from '../../utils/ExcelSet'

	export default {
		components: {
			filterButton
		},
		data(){
			return {
				operatorVal: "",
				operatorCol: '1',
				operator: ">",
				subFilters: [],
				subFilterOperator: "",
				subFilterVal: ""
			}
		},
		vuex: {
			getters: {
				activeSheet: getActiveSheet,
				filterOptions: getFilterOptions,
				excelData: getExcelData,
				colKeys: getColKeys
			},
			actions: {
				addFilter,
				setFilterStatus
			}
		},
		computed: {
			colNum(){
				if(this.colKeys){
					return this.colKeys.length
				}
				else
					return 0
			},
			isNotSingleLogicGroupOperator(){
				return this.operator !== "or" && this.operator !== "and"
			},
			singleLogicGroupOperators(){
				return this.filterOptions.filter((opt, index) => {
					if(opt.char === "or" || opt.char === "and") {
						return false
					}else{
						return true
					}
				})
			}
		},
		methods: {
			getCharCol,
			addSubFilter(index) {
				var subFilterOperator = this.subFilterOperator
				var subFilterVal = this.subFilterVal
				var subFilterWords = ""
				
				this.filterOptions.forEach((opt, index) => {
					if(opt.char === subFilterOperator){
						subFilterWords = opt.words
						return true
					}
				})

				if(!this.isNotSingleLogicGroupOperator && subFilterVal.trim().length === 0){
					alert("第1.2种表格 未填写完整")
					return
				}

				if(!this.isNotSingleLogicGroupOperator){
					this.subFilters.push({
						operator: subFilterOperator,
						val: subFilterVal,
						words: subFilterWords
					})

					this.subFilterOperator = ">" 
					this.subFilterVal = ""
				}
			},
			removeSubFilter(index) {
				this.subFilters.splice(index, 1)
			},
			addFilterHandler() {
					
				var filterObj = {}
				var filterWords = ""
				var curCol = this.operatorCol
				var operator = this.operator
				var operatorWords = this.getOperatorWords(operator)
				var opVal = this.operatorVal.trim()
				var subFilters = this.subFilters

				if(this.isNotSingleLogicGroupOperator && opVal.length === 0 || 
					!this.isNotSingleLogicGroupOperator && this.subFilters.length === 0) {
					alert("请填写完整")
					this.setFilterStatus(0)
					return
				}

				this.$nextTick(() => {
					this.setFilterStatus(1)
				})

				// 延迟是为了让“filterForm的提交按钮能作出响应（不会因为卡死了不能加入loading动画，加入web Worker后可取消该延时器）”
				setTimeout(()=>{
					var preStr = `第${curCol}列的值`

					if(!this.isNotSingleLogicGroupOperator) {
						var tempStr = ""
						for(var i = 0, len = subFilters.length; i < len; i++){
							var curFilter = this.subFilters[i]
							var primitiveFilterWords = this.getFilterWordPrimitive(curFilter.operator, curFilter.words, curFilter.val)
							tempStr += i !== len - 1 ? `${primitiveFilterWords} ${operatorWords} ` : `${primitiveFilterWords}`
						}
						filterWords = preStr + tempStr
					}else{
						filterWords = preStr + this.getFilterWordPrimitive(operator, operatorWords, opVal)
					}

					filterObj = {
						col: curCol - 1,
						operator: this.operator,
						value: opVal,
						filterWords: filterWords,
						subFilters: this.subFilters
					}

					// 触发 action：目前只做了表述文字，还需要进行筛选的value值
					this.addFilter(filterObj)
					this.operatorVal = ""
					this.subFilters = []
				}, 0)
			},
			getFilterWordPrimitive(operator, operatorWords, val){
				var primitiveFilterWords = ""
				// 判断是选择哪个操作符
				switch(operator){
					case 'startsWith': ;
					case 'ends': primitiveFilterWords = `的${operatorWords}为“${val}”`;break;
					case 'regexp': 
						val = val.replace(/\//ig, "\\/")
						primitiveFilterWords = `应用了正则表达式"/${val}/ig"`;break;
					default: primitiveFilterWords = `${operatorWords}"${val}"`;
				}
				return primitiveFilterWords
			},
			getOperatorWords(operator){
			 	for(var i = 0, len = this.filterOptions.length; i < len; i++){
			 		var obj = this.filterOptions[i]
			 		if(obj.char === operator) return obj.words
			 	}
			}
		}
	}

</script>

<style scoped>
	table{
		margin-bottom: 0
	}
	caption{
		text-align: left;
	}
</style>