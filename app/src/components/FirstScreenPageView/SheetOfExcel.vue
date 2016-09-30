<!-- Excel 中的 Sheet -->
<template>
	<div class="sheet_of_excel" 
		:class="{'isShowSideBar': !sideBarStatus}">
		<table class="table is_bordered">
			<thead>
				<tr>
					<th v-for="col in colNum">{{ getCharCol(col) }}</th>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</table>
	</div>
</template>

<script>
	import { getFilteredData, getSideBarStatus, getColKeys, getActiveSheet } from '../../vuex/getters'
	import { getCharCol, getNumCol } from '../../utils/ExcelSet'
	
	export default {
		vuex: {
			getters: {
				filteredData: getFilteredData,
				sideBarStatus: getSideBarStatus,
				colKeys: getColKeys,
				activeSheet: getActiveSheet
			}
		},
		props: {
			sheetData: {
				type: [Array],
				required: true,
				default() {
					return []
				}
			}
		},
		watch: {
			sheetData(){
				var tbody = this.$el.querySelector("tbody")
				tbody && (tbody.innerHTML = this.generateHTMLString)
			}
		},
		created() {
			setTimeout(() => {
				var tbody = this.$el.querySelector("tbody")
				tbody && (tbody.innerHTML = this.generateHTMLString)
			},1)
		},
		computed: {
			colNum (){
				return this.colKeys.length + 1
			},
			rawNum (){
				console.log(this.colKeys.length * this.sheetData.length)
				return this.sheetData.length
			},
			generateHTMLString(){
				var tStart = window.performance.now()

				var sheetData = this.sheetData

				var resultHeadStr = "<tr><td>1</td>"
				this.colKeys.forEach((row, index) => {
					resultHeadStr += `<td>${row}</td>`
				})
				resultHeadStr += "</tr>"

				var resultBodyStr = ""

				for(var i = 0, len = Math.min(this.rawNum, 50); i < len; i++){
					var resultTrStr = "<tr>"
					this.colKeys.forEach((key, index) => {
						if(index === 0){
							resultTrStr += `<td>${i + 2}</td>`
						}
					})

					this.colKeys.forEach((col, index) => {
						var val = sheetData[i][col]
						if(val == undefined) val = ""
						resultTrStr += `<td title="${i + 2}行${this.getCharCol(index + 1)}列">${val}</td>`
					})
					resultTrStr += "</tr>"
					resultBodyStr += resultTrStr
				}
				// console.log((resultHeadStr + resultBodyStr))
				var tEnd = window.performance.now()
				console.log(`字符串拼接耗时${tEnd - tStart}毫秒`)
				return (resultHeadStr + resultBodyStr)
			}
		},
		methods: {
			getCharCol,
			getNumCol
		}
	}

</script>

<style lang="scss" scoped>
	table {
		/* table不卡起决定性作用 */
		transform: translate3d(0,0,0);
		margin-bottom: 0;
	}
	.first-col{
		background-color: #eee
	}

	table thead tr th, table thead th:hover,table tbody tr td:first-child, table tbody tr td:first-child:hover{
		background-color: #eee;
	}

</style>
<style>
	/* 由于td是自己后续加的，没有添加vue属性，放在 scoped里面则不会匹配这些样式 */
	tbody tr:first-child td{
		white-space: nowrap;
	}
	.sheet_of_excel thead>tr:first-child>th{
		&:first-child {
			position: relative;
			background-image: linear-gradient(to top right, transparent, transparent calc(50% - 0.5px), #d3d6db calc(50% - 0.5px), #d3d6db calc(50% + 0.5px), transparent calc(50% + 0.5px));
			&::before {
				content: "行";
				width: 50%;
				text-align: center;
				position: absolute;
				right: 0;
				top: 3px;
			}
			&::after {
				content: "列";
				width: 50%;
				position: absolute;
				text-align: center;
				left: 0;
				bottom: 3px;
			}
		}
	}
</style>