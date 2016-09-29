<template>
	<div id="right-display-area">
		<filter-panel id="filter-panel"></filter-panel>
		<excel-display id="excel-display"></excel-display>
	</div>
</template>

<script>
	import FilterPanel from './FilterPanel'
	import ExcelDisplay from './ExcelDisplay'

	export default {
		components: {
			FilterPanel,
			ExcelDisplay
		}
	}
</script>


<style scoped>
	#right-display-area{
		display: flex;
		flex-direction: column;
	}
	#right-display-area>*{
		transform: translate3d(0,0,0);
	}
	#filter-panel{
		flex-grow: 0;
		flex-shrink: 0;
	}
	#excel-display{
		flex-grow: 1;
		flex-shrink: 1;
	}
</style>