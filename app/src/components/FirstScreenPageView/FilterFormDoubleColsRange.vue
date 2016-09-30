<template>
	<form @submit.prevent="addFilterHandler">
		<table class="table">
			<tbody>
				<tr>
					<td>双列范围逻辑</td>
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
					<td class="controls">
						<span class="select">
							<select name="">
								<option value="">同时满足</option>
								<option value="">满足一列</option>
							</select>
							<p class="val_mask">同时满足</p>
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
					<td>
						<input type="text">
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
	import { addFilter, setFilterStatus } from '../../vuex/actions'
	import { getActiveSheet, getFilterOptions, getExcelData } from '../../vuex/getters'
	import { getCharCol, getNumCol } from '../../utils/ExcelSet'

	export default {
		data(){
			return {
				operatorVal: "",
				operatorCol: "", // 最终会转为数组
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
				excelData: getExcelData
			},
			actions: {
				addFilter,
				setFilterStatus
			}
		},
		computed: {
			colNum(){
				var activeSheetName = this.activeSheet.name
				if(this.excelData[activeSheetName])
					return this.excelData[activeSheetName].length
				else
					return 0
			},
			isNotSingleLogicGroupOperator(){
				var operator = this.operator
				return operator !== "or" && operator !== "and"
			},
			singleLogicGroupOperators(){
				return this.filterOptions.filter((opt, index) => {
					if(opt.char === "or" || opt.char === "and")
						return false
					else
						return true
				})
			}
		},
		methods: {
			getNumCol,
			getCharCol,
			addSubFilter(index) {
				var subFilterOperator = this.subFilterOperator.trim()
				var subFilterVal = this.subFilterVal.trim()
				var subFilterWords = ""
				
				this.filterOptions.forEach((opt, index) => {
					if(opt.char === subFilterOperator){
						subFilterWords = opt.words
						return true
					}
				})
			
				if(subFilterOperator.length !== 0 && subFilterVal.length !== 0){
					this.subFilters.push({
						operator: subFilterOperator,
						val: subFilterVal,
						words: subFilterWords
					})

					this.subFilterOperator = ">" 
					this.subFilterVal = ""
				}else{
					alert("第3.2种表格 未填写完整")
				}
			},
			removeSubFilter(index) {
				this.subFilters.splice(index, 1)
			},
			addFilterHandler() {
				var filterObj = {}
				var filterWords = ""
				// var curCols = this.operatorCol
				var curCols = this.operatorCol.trim()
				var operator = this.operator
				var operatorWords = this.getOperatorWords(operator)
				var opVal = this.operatorVal.trim()
				var subFilters = this.subFilters

				// 去除两边的逗号
				curCols = curCols.replace(/^[，*,*]*/ig, "").replace(/[，*,*]*$/ig, "")
				// 切割为数组
				curCols = curCols.split(/,?，?/)

				for(var i = 0, len = curCols.length; i < len; i++){
					var cCol = curCols[i]
					console.log(cCol)
					if(cCol.match(/[a-z]/ig)){
						curCols.splice(i, 1, getNumCol(cCol))
					}
				}
				console.log(curCols)

				if(this.isNotSingleLogicGroupOperator && opVal.length === 0) {
					alert("3.1请填写完整")
					return
				}

				if(!this.isNotSingleLogicGroupOperator && this.subFilters.length === 0){
					alert("3.2请填写完整")
					return
				}
				if(curCols.length < 2){
					alert("至少填写两列")
					return
				}else if(curCols.length > 2){
					alert("多列运算逻辑只能填写两列，它会取指定两列范围内的所有列（包含自身）")
					this.operatorCol = ""
					return 
				}

				this.$nextTick(() => {
					this.setFilterStatus(1)
				})

				setTimeout(()=>{

					var preStr = `第${getCharCol(curCols[0])}至第${getCharCol(curCols[1])}列范围内的值中，存在至少一个`

					if(!this.isNotSingleLogicGroupOperator) {
						var tempStr = ""
						for(var i = 0, len = subFilters.length; i < len; i++){
							var curFilter = this.subFilters[i]
							var primitiveFilterWords = this.getFilterWordPrimitive(curFilter.operator, curFilter.words, curFilter.val)
							tempStr += i !== len - 1 ? `${primitiveFilterWords} ${operatorWords}` : `${primitiveFilterWords}`
						}
						filterWords = preStr + tempStr
					}else{
						filterWords = preStr + this.getFilterWordPrimitive(operator, operatorWords, opVal)
					}

					console.log(this.subFilters)
					var tempCols = []
					for(var i = +curCols[0], len = +curCols[1]; i <= len; i++){
						tempCols.push(i - 1)
					}
					curCols = tempCols
					console.log("根据首尾两元素获得它们之间的所有元素，并且所有元素进行减一处理", curCols)
					filterObj = {
						col: curCols,
						operator: this.operator,
						value: opVal,
						filterWords: filterWords,
						subFilters: this.subFilters,
						colOperator: ""
					}
					console.log(filterObj)
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

<style lang="scss" scoped>
	
</style>