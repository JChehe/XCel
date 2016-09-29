<template>
	<button type="submit" class="button" 
		:class="{'is-loading': filterStatus === 1}">
		确定
	</button>
</template>

<script>
	import { getFilterStatus } from '../../vuex/getters'

	export default {
		vuex: {
			getters: {
				filterStatus: getFilterStatus,
			}
		}
	}
</script>

<style scoped>
	
</style>