<template>
	<form @submit.prevent="addFilterHandler">
		<table class="table">
			<tbody>
				<tr>
					<td>多列运算逻辑</td>
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
								<option value=">">相加</option>
							</select>
							<p class="val_mask">相加</p>
						</span>
					</td>
					<td>
						<span class="select">
							<select >
								<option value="">大于</option>
							</select>
							<p class="val_mask">大于</p>
						</span>
					</td>
					<td>
						<div>
							<input type="text" class="input" 
								v-model="operatorVal">
						</div>
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
	import { getNumCol, getCharCol } from "../../utils/ExcelSet"
	import { getFilterOptions } from '../../vuex/getters'
	import { addFilter, setFilterStatus } from '../../vuex/actions'
	export default{
		data(){
			return {
				operatorVal: "",
				operatorCol: "", // 最终会转为数组
				operator: ">",
				colOperatorSelect: "+",
				subFilters: [],

				colOperator: [{
					char: "+",
					words: "相加"
				},{
					char: "-",
					words: "相减"
				},{
					char: "*",
					words: "相乘"
				},{
					char: "/",
					words: "相除"
				},{
					char: "%",
					words: "求余"
				}/*,{
					char: "+(time)",
					words: "时间相加"
				}*/,{
					char: "-(time)",
					words: "时间相减"
				}/*,{
					char: "+()",
					words: "字符串拼接"
				}*/]
			}
		},
		vuex: {
			getters: {
				filterOptions: getFilterOptions
			},
			actions: {
				addFilter,
				setFilterStatus
			}
		},
		computed: {
			singleGroupFilterOptions(){
				return this.filterOptions.filter((item, index) => {
					var curOp = item.char
					if(curOp !== "or" && curOp !== "and")
						return true
				})
			}
		},
		methods:{
			getNumCol,
			addFilterHandler(){
				
				var filterObj = {}
				var filterWords = ""
				var curCols = this.operatorCol.trim()
				var operator = this.operator
				var operatorWords = this.getOperatorWords(operator)
				var opVal = this.operatorVal.trim()
				var colOperatorSelect = this.colOperatorSelect
				var colOperatorWords = this.getColOperatorWords(colOperatorSelect)
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

				if(curCols.length === 0 || opVal.length === 0) {
					alert("第2种表格 请填写完整")
					return
				}
				console.log("curCols", curCols)
				if(curCols.length < 2){
					alert("至少填写两列")
					return
				}

				if(colOperatorSelect.includes("time") && curCols.length > 2){
					alert("时间相关的操作只能选择两列")
					this.operatorCol = ""
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
					var preStr = `第${colText.slice(2)}列的值`

					filterWords = preStr + this.getFilterWordPrimitive(operator, colOperatorWords, operatorWords, opVal)

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
						colOperator: this.colOperatorSelect
					}
					console.log("filterObj",filterObj)
					this.addFilter(filterObj)

					this.operatorCol = ""
					this.operatorVal = ""
				}, 0)
			},
			getColOperatorWords(colOperatorSelect){
				for(var i = 0, len = this.colOperator.length; i < len; i++){
					var obj = this.colOperator[i]
					if(obj.char === colOperatorSelect) return obj.words
				}
			},
			// 公用的方法
			getFilterWordPrimitive(operator, operatorCol, operatorWords, val){
				var primitiveFilterWords = ""
				// 判断是选择哪个操作符
				switch(operator){
					case 'startsWith': ;
					case 'ends': primitiveFilterWords = `的${operatorWords}为“${val}”`;break;
					case 'regexp': primitiveFilterWords = `应用了正则表达式"/${val}/ig"`;break;
					default: 
						primitiveFilterWords = `${operatorCol}${operatorWords}"${val}"`;
						if(this.colOperatorSelect.includes("time")) primitiveFilterWords += "分钟"
				}
				return primitiveFilterWords
			},
			// 公用的方法
			getOperatorWords(operator) {
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