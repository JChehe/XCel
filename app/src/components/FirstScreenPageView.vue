<template>
	<div class="first_screen">

		<v-header></v-header>
		<main :class="{isShowSideBar: sideBarStatus}">
			<div class="columns is-gapless is-mobile is-overlay">
				
				<right-display-area class="column right-display-area"></right-display-area>
			</div>
		</main>
		<v-footer></v-footer>
		<side-bar class="sibebar"></side-bar>
	</div>
</template>

<script>
	import SideBar from './common/SideBar'
	import Footer from './common/Footer'
	import vHeader from './common/Header'
	import RightDisplayArea from './FirstScreenPageView/RightDisplayArea'
	import { toggleSideBar } from '../vuex/actions'
	import { getSideBarStatus } from '../vuex/getters'
	
	export default {
		components: {
			vHeader,
			SideBar,
			RightDisplayArea,
			vFooter: Footer
		},
		name: 'index',
		data(){
			return {
			}
		},
		vuex: {
			getters: {
				sideBarStatus: getSideBarStatus
			},
			actions: {
				toggleSideBar
			}
		}
	}
</script>

<style scoped>
	.first_screen {
		display: flex;
		flex-direction: column;
		height: 100vh;
		justify-content: space-between;
	}


	header, footer{
		flex-grow: 0;
		flex-grow: 0;
	}
	main{
		position: relative;
		overflow: hidden;
		flex-grow: 1;
		flex-shrink: 0;
	}
	main>*{
		width: 100%;
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