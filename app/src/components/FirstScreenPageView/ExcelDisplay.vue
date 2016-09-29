<!-- Excel -->
<template>
	<div class="excel-area">
		<div class="tabs is-boxed is-small excel-cheet-nav">
			<ul>
				<li v-for = "sheetName in excelData.sheetNameList" 
					:class="{'is-active': $index == activeSheet.index}"
					@click = "changeTab($index)">
					<a href="javascript:;">
						<span>{{ sheetName }}</span>
					</a>
				</li>
			</ul>
		</div>
		<!-- 根据cheetTittle 动态切换数据 -->
		<div :class="['tabs-body', {isShowSideBar: !sideBarStatus}]">
			<div class="drop-area content" 
				v-show="!excelData.sheetNameList"
				@drop.prevent.stop="dropHandler" 
				>
				<p class="{'is-loading': isLoading}">拖拽一个Excel文件到这里即可完成上传</p>
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
	import path from 'path'
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
				var dropArea = document.querySelector(".drop-area")
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
							this.setActiveSheet(0)

							this.isLoading = false
							this.setUploadFiles({
					      path: curFile.path,
					      name: curFile.name,
					      extname: path.extname(curFile.path)
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

<style scoped>
	.excel-area{
		display: flex;
		flex-direction: column;
	}
	.tabs{
		flex-shrink: 0;
	}

	.tabs-body{
		flex-grow: 1;
		overflow: auto;
		position: relative;

	}
	.excel-area{
		max-width: 100%;
		width: 100%;
		height: calc(100% - 86px);
		margin-top: -5px;
	}
	.excel-area{
		padding: 5px;
	}
	.excel-cheet-nav {
		margin-bottom: 5px;
	}
	.excel-cheet-nav ul{
		padding-left: 5px;
	}
	.tabs-body{
		display: block;
		overflow: auto;
	}

	.drop-area{
		border: 3px dashed #69707a;
		font-size: 18px;
		position: relative;
		vertical-align: middle;
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
	}
	.drop-area>p{
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
	.tabs-body>*{
		display: block;
		width: 100%;
		height: 100%;
	}
	.drop-area>p{
		display: inline-block;
	}
	.drop-area>p.is-loading{
		/*position: relative;*/
		padding-right: 24px;
	}
	.drop-area>p.is-loading::after{
		position: absolute;
		right: 0;
		top: 5px;
	  -webkit-animation: spin-around 500ms infinite linear;
    animation: spin-around 500ms infinite linear;
	  border: 2px solid #d3d6db;
	  border-radius: 290486px;
	  border-right-color: transparent;
	  border-top-color: transparent;
	  content: "";
	  display: block;
	  height: 16px;
	  width: 16px;
	}
</style>