<template>
	<div class="filter-list has-text-left">
		<filter-tag v-for="filterObj in filterTagList[activeSheet.name]" 
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

<style scoped>
	.filter-area>div{
		position: relative;
	}
</style>