<template>
	<form @submit.prevent="searchHandler">
		<div class="control has-addons file-search">
		  <input class="input is-expanded" type="text" placeholder=" 搜索为空时，则显示全部" 
		  	v-model="queryStr">
		  <button type="submit" class="button is-success">
		    <i class="fa fa-search is-small"></i>
		  </button>
		</div>
	</form>
</template>

<script>
	import { changeSearchVal } from '../../vuex/actions'
	export default {
		data(){
			return {
				queryStr: "",
			}
		},
		vuex: {
			actions: {
				changeSearchVal
			}
		},
		methods: {
			searchHandler(){
				var queryStr = this.queryStr.trim()
				this.changeSearchVal(queryStr)
				this.queryStr = ""
			}
		}
	}
</script>


<style scoped>
	.file-search{
		padding: 5px 3px;
		margin-bottom: 0px;
	}
</style>