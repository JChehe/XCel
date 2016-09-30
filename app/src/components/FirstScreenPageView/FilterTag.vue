<template>
	<span class="tag is-warning">
		<span class="related_char">或</span>
		<p>{{ filterObj.filterWords }}</p>
		<button class="btn" @click="delHandler(tagIndex)">x
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
		display: flex;
		flex-wrap: nowrap;
		background-color: #9B9B9B;
		color: #D8D8D8;
		margin:0 5px 5px 0;
		font-size: 12px;
	}
	.tag>*{
		line-height: 24px;
		/*justify-content: */
		text-align: center;
	}
	p{
		min-width: 100px;
	}
	.related_char{
		width: 22px;
		background-color: #6B727D;
		color: #fff;
	}
	.btn{
		width: 22px;
		height: 24px;
		padding: 0;
		color: #fff;
		background-color: #FF4081;
		border: 0;
		outline: 0;
		cursor: pointer;
	}
	
</style>