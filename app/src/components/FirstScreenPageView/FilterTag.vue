<template>
	<span class="tag is-warning">
		{{ filterObj.filterWords }}
		<button class="delete" 
			@click="delHandler(tagIndex)">
		</button>
	</span>
</template>

<script>
	import { delFilter, setFilterStatus } from '../../vuex/actions'

	export default {
		props: {
			filterObj: {
				type: Object,
				required: true
			},
			tagIndex: {
				type: Number,
				required: true
			}
		},
		vuex: {
			actions: {
				delFilter,
				setFilterStatus
			}
		},
		methods: {
			delHandler(index){
				this.setFilterStatus(1)
				setTimeout(() => {
					this.delFilter(index)
				}, 1)
			}
		}
	}
</script>


<style scoped>
	.tag{
		margin:0 5px 5px 0;
	}
</style>