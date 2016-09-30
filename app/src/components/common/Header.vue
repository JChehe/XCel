<template>
	<header>
		<window-top style="-webkit-app-region: drag;"></window-top>
		<nav class="nav">
			<div class="toggle_sidebar_btn" @click="toggleSideBar">
		    <i class="fa fa-bars"></i>
			</div>
			<div class="filter_way_container">
				筛选方式：
				<label>
					<input type="radio" name="filter_way" value="0" v-model="vuexFilterWay">保留
				</label>
				<label>
					<input type="radio" name="filter_way" value="1" v-model="vuexFilterWay">剔除
				</label>
			</div>
		  <!-- <span class="nav-toggle" @click="toggleNav">
		    <span></span>
		    <span></span>
		    <span></span>
		  </span>

		  <div :class = "['nav-right','nav-menu',{'show': isShowNav}]">
		    <a class="nav-item" v-link="{ path: 'first-screen' }">
		      主页
		    </a>
		    <a class="nav-item" v-link="{ path: 'instructions' }">
		      使用介绍
		    </a>
		  </div> -->
		</nav>
	</header>
</template>

<script>
	import { toggleSideBar, setFilterWay } from '../../vuex/actions'
	import { getFilterWay } from '../../vuex/getters'
	import WindowTop from './WindowTop'

	export default {
		components :{
			WindowTop
		},
		vuex: {
			getters: {
				filterWay: getFilterWay
			},
			actions: {
				toggleSideBar,
				setFilterWay
			}
		},
		data() {
			return {
				isShowNav: false
			}
		},
		computed: {
			vuexFilterWay: {
				get() {
					return this.filterWay
				},
				set(val) {
					this.setFilterWay(val)
				}
			}
		},
		methods: {
			toggleNav() {
				console.log(this.isShowNav)
				this.isShowNav = !this.isShowNav
			}
		}
	}
</script>

<style scoped>
	header{
		color: #000;
	}
	.nav-menu.show{
		display: block;
	}
	.nav{
		box-shadow: 0 0 4px rgba(0, 0, 0, .12), 0 4px 4px rgba(0, 0, 0, .24);
		height: 64px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.fa-bars{
		font-size: 18px;
		color: rgba(0, 0, 0, .54);
	}
	.toggle_sidebar_btn{
		padding: 0 24px;
		cursor: pointer;
		line-height: 64px;
	}
	.filter_way_container{
		font-size: 14px;
		margin-right: 20px;
	}
	.filter_way_container label:not(:last-child){
		margin-right: 5px;
	}
	input[name="filter_way"] {
		display: inline-block;
		margin-right: 4px;
		vertical-align: 1px;
	}
</style>