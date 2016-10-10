<template>
	<div class="filter-list has-text-left">
		<filter-tag v-for="filterTag in filterTagList[activeSheet.name]" 
			:filter-tag="filterTag" 
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
				curFilterTagList: []
			}
		},
		vuex: {
			getters: {
				filterTagList: getFilterTagList,
				activeSheet: getActiveSheet,
				excelData: getExcelData
			}
		}
	}
</script>

<style lang="scss" scoped>
	.filter-list{
		display: flex;
		flex-wrap: wrap;
	}
</style>