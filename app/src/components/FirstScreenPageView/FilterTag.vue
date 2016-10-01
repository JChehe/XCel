<template>
	<span class="tag is-warning">
		<span class="related_char">{{ getLogicOperator(filterObj.logicOperator) }}</span>
		<p>{{ filterObj.filterWords }}</p>
		<button class="btn" @click="delHandler(tagIndex)">
			<svg width="10px" height="10px" viewBox="6 7 10 10" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
			    <desc>Created with Sketch.</desc>
			    <defs></defs>
			    <g id="Material/Icons-black/close" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" transform="translate(6.000000, 7.000000)">
			        <polygon id="Shape" fill="#FFFFFF" points="10 1 9 0 5 4 1 0 0 1 4 5 0 9 1 10 5 6 9 10 10 9 6 5"></polygon>
			    </g>
			</svg>
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
			},
			getLogicOperator(char) {
				return char === "and" ? "且" : "或"
			}
		}
	}
</script>


<style lang="scss" scoped>
	.tag{
		display: flex;
		flex-wrap: nowrap;
		background-color: #9B9B9B;
		color: #D8D8D8;
		margin:0 5px 5px 0;
		font-size: 12px;
		&>*{
			line-height: 24px;
			text-align: center;
		}
	}
	p{
		min-width: 100px;
		padding: 0 5px;
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