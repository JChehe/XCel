<template>
	<div class="filter-list has-text-left">
		<filter-tag v-for="filterObj in filterTagList" 
			:filter-obj="filterObj" 
			:tag-index="$index">
		</filter-tag>
	</div>
</template>

<script>
	import FilterTag from './FilterTag'
	import { getFilterTagList, getActiveSheet, getExcelData } from '../../vuex/getters'

	export default {
		components: {
			FilterTag
		},
		data(){
			return {
				curFilterTagList: [],
				filterTagList: [{
					filterWords: 123123123
				},{
					filterWords: 123123123
				},{
					filterWords: 123123123
				},{
					filterWords: 123123123
				},{
					filterWords: 123123123
				},{
					filterWords: 123123123
				},{
					filterWords: 123123123
				},{
					filterWords: 123123123
				}]
			}
		},
		vuex: {
			getters: {
				// filterTagList: getFilterTagList,
				activeSheet: getActiveSheet,
				excelData: getExcelData
			}
		}
	}
</script>

<style scoped>
	.filter-list{
		display: flex;
		flex-wrap: wrap;
	}
	.filter-area>div{

	}
</style>