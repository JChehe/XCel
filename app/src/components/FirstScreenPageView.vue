<template>
	<v-header class="is-overlay"></v-header>
	<main class="is-fullwidth">
		<div class="columns is-gapless is-mobile is-overlay">
			<side-bar class="column is-narrow"></side-bar>
			<right-display-area class="column right-display-area"></right-display-area>
			<div class="emit-enter-button" title="点击弹出侧边栏" @click="toggleSideBar" v-show="!getSideBarStatus" transition="horizontalMove">
				<span class="icon is-pulled-right toggle-button">
					<i class="fa fa-angle-right"></i>
				</span>
			</div>
		</div>
	</main>
</template>

<script>
	import SideBar from './common/SideBar'
	import vHeader from './common/Header'
	import RightDisplayArea from './FirstScreenPageView/RightDisplayArea'
	import { toggleSideBar } from '../vuex/actions'
	import { getSideBarStatus } from '../vuex/getters'
	
	export default {
		components: {
			vHeader,
			SideBar,
			RightDisplayArea
		},
		name: 'index',
		data(){
			return {
			}
		},
		vuex: {
			getters: {
				getSideBarStatus
			},
			actions: {
				toggleSideBar
			}
		}
	}
</script>

<style scoped>
	.is-narrow{
		width: 275px;
	}
	main{
		width: 100%;
		margin-top: 50px;
		position: relative;
		height: calc(100vh - 50px);
		overflow: hidden;
	}
	main>*{
		width: 100%;
	}
	.right-display-area{
		min-width: 660px;
		overflow-x: auto;

	}
	.columns>.column:last-child{
		width: calc(100% - 275px)
	}
	.column>*{
		width: 100%;
		height: 100%;
	}

	.emit-enter-button{
		width: 24px;
		height: 30px;
		background-color: rgba(255, 255, 255, .98);
		border: 1px solid #ccc;
		border-left-width: 0;
		position: fixed;
		z-index: 800;margin-top: 4px;
	}
	.emit-enter-button>span{
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	
	.horizontalMove-transition{
		-webkit-transition: all .6s;
		transition: all .6s;
	}

	.horizontalMove-enter{
		transform: translateX(-100%);
		width: 0;
		opacity: 0;
	}
	.horizontalMove-leave{
		transform: translateX(0);
		opacity: 0;
		width: 0;
	}
</style>