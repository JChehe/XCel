<template>
	<header class="is-overlay">
		<nav class="nav">
		  <div class="nav-left">
		    <a class="nav-item is-brand" v-link="{path: '/'}">
		      <img src="./assets/o2logo.png" alt="Aotu logo}">
		    </a>
		  </div>

		  <span class="nav-toggle" @click="toggleNav">
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
		    <!-- <a class="nav-item" href="javascript:;">
		      Blog
		    </a> -->
		  </div>
		</nav>
	</header>
</template>

<script>
	export default {
		data() {
			return {
				isShowNav: false
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
		height: 52px;
	}
	.nav-menu.show{
		display: block;
	}
</style>