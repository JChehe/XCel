<template>
	<div class="filter_panel" :class="{isShowSideBar: sideBarStatus}">
		<div class="filter_tag_container">
			<filter-tag-list class="filter_tag_list"></filter-tag-list>
			<button class="submit_btn btn" title="">
				<svg width="18px" height="15px" viewBox="23 25 18 15" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
				    <!-- Generator: Sketch 40.1 (33804) - http://www.bohemiancoding.com/sketch -->
				    <desc>Created with Sketch.</desc>
				    <defs></defs>
				    <g id="Material/Icons-black/check" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" transform="translate(23.000000, 25.000000)">
				        <polygon id="Shape" fill="#FFFFFF" points="5.9999939 11.2 1.7999939 7 0.399993896 8.4 5.9999939 14 17.9999939 2 16.5999939 0.6"></polygon>
				    </g>
				</svg>
			</button>
		</div>
		<div class="filter_form_group">
			<div class="filter_form_group_inside">
				<filter-form-single-logic is="my-component"></filter-form-single-logic>
				<filter-form-multi-calc is="my-component"></filter-form-multi-calc>
				<filter-form-double-cols-range is="my-component"></filter-form-double-cols-range>
			</div>
		</div>
	</div>
	<!-- <div :class="['filter-area', {pL32: !sideBarStatus}]">
		<div>
			<div class="tabs is-boxed is-small filter-form-nav">
				<ul>
					<li v-for="item in filterFormNav"
						:class="{'is-active': $index === activeFilterFormIndex}"
						@click="changeTab($index)">
						<a href="javascript:;">
							<span>{{item}}</span>
						</a>
					</li>
				</ul>
			</div>
			<div class="filter-form-and-export">
				<div class="filter-form-set">
					<filter-form-single-logic v-show="activeFilterFormIndex === 0">
					</filter-form-single-logic>
					<filter-form-multi-calc v-show="activeFilterFormIndex === 1">
					</filter-form-multi-calc>
					<filter-form-double-cols-range v-show="activeFilterFormIndex === 2">
					</filter-form-double-cols-range>
				</div>

				<div class="export-btn">
					<button class="button" title="筛选完成，导出文件" 
						@click="exportFile">
						导出
					</button>
				</div>
			</div>
			<div class="filter-tag-container">
				<filter-tag-list></filter-tag-list>
			</div>
	</div> -->
</template>

<script>
	import FilterTagList from './FilterTagList'
	import FilterFormSingleLogic from './FilterFormSingleLogic'
	import FilterFormMultiCalc from './FilterFormMultiCalc'
	import FilterFormDoubleColsRange from './FilterFormDoubleColsRange'
	import { getFilterList, getSideBarStatus } from '../../vuex/getters'
	import { exportFile } from '../../vuex/actions'

	export default{
		components: {
			FilterTagList,
			FilterFormSingleLogic,
			FilterFormMultiCalc,
			FilterFormDoubleColsRange
		},
		data() {
			return {
				curCol: 1,
				filterVal: "",
				colOfSheet: 1,
				filterFormNav: ["单列（组合）逻辑", "多列运算逻辑", "双列范围逻辑"],
				activeFilterFormIndex: 0
			}
		},
		vuex: {
			getters: {
				sideBarStatus: getSideBarStatus
			},
			actions: {
				exportFile
			}
		},
		methods: {
			changeTab(index){
				this.activeFilterFormIndex = index
			},
			submit(){
				if(filterVal.tirm().length === 0) return false
			}
		}
	}
</script>
<style lang="scss">
	.select{
		position: relative;
		display: inline-block;
		width: 62px;

		select {
			-webkit-appearance: none;
			appearance: none;
			border: 1px solid #D8D8D8;
			// height: 26px;
			width: 100%;
			height: 26px;
			line-height: 24px;
			outline: none;
			border-radius: 0;
			background-color: transparent;
			display: block;
			text-align: center;
			font-size: 0px;
		}
		&:after {
			content: "\20";
			position: absolute;
			border: 5px solid transparent;
			border-top-color: #000;
			right: 6px;
			top: 50%;
			transform: translateY(-2px)
		}
		p{
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			font-size:12px;
			line-height: 26px;
			text-align: center;
			pointer-events: none;
			-webkit-user-select: none;
			user-select: none;
		}
	}
	input[type="text"]{
		font-size: 12px;
		text-align: center;
		outline: 0;
		border:1px solid #D8D8D8;
		outline: none;
		padding: 0

	}
	.filter_form_group table td{
		color: #000;
		font-size: 12px;
		height: 54px;
		
		&:first-child{
			width: 130px;
			text-align: center;
		}
		&:nth-child(2) {
			width: 82px;
		}
		&:nth-child(3) {
			width: 127px;
			.select {
				width: 107px;
			}
		}
		&:nth-child(4) {
			width: 127px;
			.select {
				width: 107px;
			}
		}
		&:nth-child(5) {
			width: 127px;
			.select {
				width: 107px;
			}
		}
		&:nth-child(6) {
			width: 317px;
			input{
				width: 300px;
				line-height: 24px;

			}
		}
		&:last-child {
			.btn{
				background-color: #4285F4;
				font-size: 12px;
				text-align: center;
				line-height: 24px;
				border-radius: 13px;
				color: #fff;
				width: 66px;
				padding: 0;
				border: 0;
				outline: 0;
			}
		}
	}

</style>
<style scoped>
	.filter_panel{
		position: fixed;
		bottom: 56px;
		left: 0;
		right: 0;
		z-index: 10;
	}
	.filter_panel.isShowSideBar{
		/*left: 269px;*/
	}
	.filter_tag_container{
		min-height: 64px;
		background-color: #fff;
		box-shadow: 0 -2px 4px rgba(0, 0, 0, .1);
		padding: 20px 27px 15px;
		position: relative;
	}

	.filter_tag_list {
		margin-right: 64px;
	}
	.filter_tag_list+button{
		width: 64px;
		height: 64px;
		position: absolute;
		right: 0;
		bottom: 0;
		background-color: #4285F4;
		color: #fff;
		border: 0;
		outline: 0;
		cursor: pointer;
	}
	.filter_form_group{
		background-color: #2B3244;
		padding: 22px 20px;
	}
	.filter_form_group_inside{
		background-color: #fff;
	}
</style>
