<!-- Excel -->
<template>
	<div class="excel_area">
		<div class="tabs is_boxed is_small excel_cheet_nav" v-show="excelData.sheetNameList !== undefined">
			<ul>
				<li v-for = "sheetName in excelData.sheetNameList" 
					:class="{'is_active': $index == activeSheet.index}"
					@click = "changeTab($index)">
					<a href="javascript:;">
						<span>{{ sheetName }}</span>
					</a>
				</li>
			</ul>
		</div>
		<!-- 根据cheetTittle 动态切换数据 -->
		<div :class="['tabs_body', {isShowSideBar: !sideBarStatus}]">
			<div class="drop_area content" 
				v-show="!excelData.sheetNameList"
				@drop.prevent.stop="dropHandler" 
				@dragenter="dragenterHandler"
				@dragleave="dragleaveHandler"
				>
				<p>拖拽一个Excel文件到这里即可完成上传</p>
			</div>
			<sheet-of-excel v-for="sheetName in excelData.sheetNameList"
				:sheet-data="filteredData[activeSheet.name]"
				v-if="excelData.sheetNameList"
				v-show="activeSheet.index === $index"
				>
			</sheet-of-excel>
		</div>
	</div>
</template>


<script>
	import fs from 'fs-extra'
	import pathModule from 'path'
	import { getExcelData, getActiveSheet, getFilteredData, getSideBarStatus } from '../../vuex/getters'
	import { setActiveSheet, setExcelData, setUploadFiles } from '../../vuex/actions'
	import SheetOfExcel from './SheetOfExcel'
	

	export default {
		components: {
			SheetOfExcel
		},
		data(){
			return {
				isLoading: false
			}
		},
		vuex: {
			getters: {
				excelData: getExcelData,
				activeSheet: getActiveSheet,
				filteredData: getFilteredData,
				sideBarStatus: getSideBarStatus
			},
			actions: {
				setActiveSheet,
				setExcelData,
				setUploadFiles
			}
		},
		created(){
			setTimeout(() => {
				var dropArea = document.querySelector(".drop_area")
				if(dropArea) {
					dropArea.addEventListener("dragenter", dragoverHandler, false)
					dropArea.addEventListener("dragover", dragoverHandler, false)
				}
			}, 0)
			function dragoverHandler(e){
				e.stopPropagation()
				e.preventDefault()
				e.dataTransfer.dropEffect = 'copy'
			}
		},
		methods: {
			changeTab(index) {
				this.setActiveSheet(index)
			},
			dragenterHandler(e) {
				e.target.classList.add("active")
			},
			dragleaveHandler(e) {
				e.target.classList.remove("active")
			},
			dropHandler(e){
				var files = e.dataTransfer.files
				var i, f
				this.$nextTick(()=>{
					this.isLoading = true
				})
				try{
					for(var i = 0, f = files[i]; i != files.length; i++){
						var curFile = files[i]
						
						var reader = new FileReader()
						var name = f.name
						reader.onload = (e) => {
							var data = e.target.result
							
							this.setExcelData(data)
							// this.setActiveSheet(0)

							this.isLoading = false
							this.setUploadFiles({
					      path: curFile.path,
					      name: curFile.name,
					      extname: pathModule.extname(curFile.path)
					    })
						}
						reader.readAsBinaryString(f)
					}
				}catch(e){
					console.log(e)
					this.isLoading = false
				}
			}			
		}
	}

</script>

<style lang="scss" scoped>
	.excel_area{
		display: flex;
		flex-direction: column;
		max-width: 100%;
		width: 100%;
		margin-top: 5px;
		padding: 5px;

	}
	.tabs{
		flex-shrink: 0;
		flex-grow: 0;
	}

	.tabs_body{
		flex-grow: 1;
		flex-shrink: 1;
		overflow: auto;
		position: relative;
		display: block;
		overflow: auto;
		&>*{
			display: block;
			width: 100%;
			height: 100%;
		}
		&>p{
			display: inline-block;
			&.is_loading {
				padding-right: 24px;
			}
		}
	}

	.excel_cheet_nav {
		margin-bottom: 5px;
		ul {
			padding-left: 5px;
		}
	}

	.drop_area{
		// visibility: hidden;
		opacity: 0;
		border: 3px dashed #69707a;
		font-size: 18px;
		position: relative;
		vertical-align: middle;
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		transition: opacity .6s;
		&.active {
			// visibility: visible;
			opacity: 1;
		}
		p {
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
		}
	}




</style>
