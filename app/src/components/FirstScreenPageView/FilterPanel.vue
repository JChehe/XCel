<template>
	<div :class="['filter-area', {pL32: !sideBarStatus}]">
		<div>
			<div class="tabs is-boxed is-small filter-form-nav">
				<ul>
					<li v-for="item in filterFormNav"
						:class="{'is-active': $index === activeFilterFormIndex}"
						@click="changeTab($index)">
						<a href="javascript:;">
							<span>{{item}}</span>
						</a>
					</li>
				</ul>
			</div>
			<div class="filter-form-and-export">
				<div class="filter-form-set">
					<filter-form-single-logic v-show="activeFilterFormIndex === 0">
					</filter-form-single-logic>
					<filter-form-multi-calc v-show="activeFilterFormIndex === 1">
					</filter-form-multi-calc>
					<filter-form-double-cols-range v-show="activeFilterFormIndex === 2">
					</filter-form-double-cols-range>
				</div>

				<div class="export-btn">
					<button class="button" title="筛选完成，导出文件" 
						@click="exportFile">
						导出
					</button>
				</div>
			</div>
			<div class="filter-tag-container">
				<filter-tag-list></filter-tag-list>
			</div>
	</div>
</template>

<script>
	import FilterTagList from './FilterTagList'
	import FilterFormSingleLogic from './FilterFormSingleLogic'
	import FilterFormMultiCalc from './FilterFormMultiCalc'
	import FilterFormDoubleColsRange from './FilterFormDoubleColsRange'
	import { getFilterList, getSideBarStatus } from '../../vuex/getters'
	import { exportFile } from '../../vuex/actions'

	export default{
		components: {
			FilterTagList,
			FilterFormSingleLogic,
			FilterFormMultiCalc,
			FilterFormDoubleColsRange
		},
		data() {
			return {
				curCol: 1,
				filterVal: "",
				colOfSheet: 1,
				filterFormNav: ["单列（组合）逻辑", "多列运算逻辑", "双列范围逻辑"],
				activeFilterFormIndex: 0
			}
		},
		vuex: {
			getters: {
				sideBarStatus: getSideBarStatus
			},
			actions: {
				exportFile
			}
		},
		methods: {
			changeTab(index){
				this.activeFilterFormIndex = index
			},
			submit(){
				if(filterVal.tirm().length === 0) return false
			}
		}
	}
</script>

<style scoped>
	.filter-tag-container{
		margin-top: 10px;
		max-height: 58px;
		overflow: auto;
	}


	.filter-area>*{
		padding: 5px;
	}
	.filter-area{
		transition: all .6s
	}
	.filter-form-set{
		min-width: 575px;
	}
	
	.filter-form-and-export{
		display: flex;
		justify-content: space-between;
	}
	.filter-form-and-export>*{
		display: inline-block;
		vertical-align: top;
	}
	.export-btn{

	}
	.pL32{
		padding-left: 32px;
	}
	#filter-form{
		margin-bottom: 0
	}
	#filter-form input{
		border-radius: 3px 0 0 3px;
	}
	#filter-form .label{
		line-height: 32px;
	}
	.filter-area.isShowSideBar{
		padding-left: 28px;
	}
	.tabs{
		margin-bottom: 0;
	}
	.tabs li span{
		font-size: 12px;
	}
</style>
<style>
	.filter-form-set .table tr:hover{
		background-color: transparent;
	}
</style>