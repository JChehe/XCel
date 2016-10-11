<template>
	<div class="loading" :class="{show : fileStatus !== -1}">
		<div class="loading_inner">
			<p><i class="fa fa-spinner" aria-hidden="true"></i></p>
			<p>{{ loadingText[fileStatus] }}</p>
		</div>
	</div>
</template>

<script>
	import { getFileStatus } from "../../vuex/getters"
	export default {
		data(){
			return {
				loadingText: [
					"文件正在导入中",
					"文件正在过滤中",
					"文件正在导出中"
				]
			}
		},
		vuex: {
			getters: {
				fileStatus: getFileStatus
			}
		}
	}
</script>

<style lang="scss" scoped>
	.loading {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		display:none;
		&_inner {
			text-align: center;
			background-color: rgba(0, 0, 0, .8);
			color: #fff;
			border-radius: 10px;
			display: flex;
			flex-direction: column;
			justify-content: center;
			width: 110px;
			height: 110px;
			padding: 5px;
		}
		&.show {
			display: block
		}
		p:first-child {
			margin-bottom: 8px;
			.fa{
				font-size: 26px;
				color: #fff;
				animation: rotate 1s infinite;
			}
		}
	}
	@keyframes rotate {
		0%{
			transform: rotate(0deg)
		}
		100% {
			transform: rotate(360deg)
		}

	}
</style>