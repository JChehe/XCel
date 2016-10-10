<template>
	<footer class="footer">
		<ul class="btn_group">
			<li class="btn search_btn" title="搜索文件"
				v-show="!isShowInstruction" 
				@click="focusSearchInput">
				<i class="fa fa-search"></i>
			</li>
			<li class="btn upload_btn" title="上传文件"
				 v-show="!isShowInstruction">
				<i class="fa fa-upload"></i>
				<input type="file" name="upload-excel-input" @change="handleFile">
			</li>
			<li class="btn filter_btn" title="添加筛选条件" 
				v-show="!isShowInstruction"
				@click="toggleFilterPanelStatus"
				:class="{active: isShowFilterPanel}">
				<i class="fa fa-filter"></i>
			</li>
			<li class="btn instruction_btn" title="使用说明" 
				:class="{'active': isShowInstruction}" 
				@click="toggleView">
				<i class="fa fa-info"></i>
			</li>
		</ul>
		<div>
			<p class="summary_info" v-show="hasFile">
				筛选后数据为 <em>{{filteredRows}}</em> 行，原始记录为 <em>{{ oriRows }}</em> 行，共 <em>{{ filterTagListLength }}</em> 个{{ filterWay == 0 ? "保留" : "剔除"}}</span>条件
			</p>
			<img src="./assets/O2-icon.png" alt="O2_logo">
		</div>
	</footer>
</template>

<script>
	import pathModule from "path"
	import {ipcRenderer} from "electron"
	import { 
		getSideBarStatus,
		getFilterPanelStatus,
		getFilterWay,
		getCurSheetSize 
	} from '../../vuex/getters'

	import { 
		toggleSideBar,
		toggleFilterPanelStatus,
		setExcelData,
		setActiveSheet,setUploadFiles
	} from '../../vuex/actions'

	export default {
		data(){
			return {
				isShowInstruction: this.$route.name === "instructions"
			}
		},
		vuex: {
			getters: {
				isShowFilterPanel: getFilterPanelStatus,
				filterWay: getFilterWay,
				curSheetSize: getCurSheetSize
			},
			actions: {
				toggleSideBar,
				toggleFilterPanelStatus,
				setExcelData, 
				setActiveSheet, 
				setUploadFiles
			}
		},
		computed: {
			hasFile(){
				return this.curSheetSize && this.curSheetSize.origin && this.curSheetSize.origin.rows > 0
			},
			oriRows(){
				return this.curSheetSize && this.curSheetSize.origin && this.curSheetSize.origin.rows
			},
			filteredRows(){
				return this.curSheetSize && this.curSheetSize.filtered && this.curSheetSize.filtered.rows
			},
			filterTagListLength(){
				return this.curSheetSize && this.curSheetSize.tagList && this.curSheetSize.tagList.length
			}
		},	
		methods: {
			toggleView(){
				var curRouteName = this.$route.name
				if(curRouteName === "instructions") {
					this.$route.router.go("index")
				}else{
					this.$route.router.go("instructions")		
				}
			},
			focusSearchInput(){
				if(!this.isShowSideBar){
					this.toggleSideBar(true)
				}
				var searchInput = document.getElementById("search_file_input")
				setTimeout(()=>{
					searchInput && searchInput.focus()
				}, 0)
			},
			handleFile(e) {
				var files = e.target.files
				var i,f
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
							console.log("第四阶段")
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
	input[type="file"] {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		height: 24px;
		/*visibility: hidden;*/
		opacity: 0;
	}

	.footer{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 24px;
		height: 56px;
		background-color: #262626;
		position: relative;
		z-index: 99;
		>div{
			flex-wrap: nowrap;
			white-space: nowrap;
		}
		.btn_group{
			font-size: 0;
			display: flex;
			justify-content: space-between;
			min-width: 120px;
			max-width: 150px;
			width: 30%;
			margin-right: 20px;
			li {
				width: 24px;
				height: 24px;
				display: inline-block;
				background-color: #4285F4;
				color: #000;
				font-size: 12px;
				border-radius: 50%;
				white-space: nowrap;
				flex-shrink: 0;
				text-align: center;
				line-height: 24px;
				position: relative;
				&:not(:last-child) {
					margin-right: 2.5%;
				}
				&.active {
					color: #fff;
				}
			}
		}
		.summary_info {
			font-size: 12px;
			color: #fff;
			display: inline-block;
			vertical-align: middle;
			white-space: nowrap;
			&+img{
				width: 24px;
				vertical-align: middle;
				border-radius: 50%;
				margin-left: 5px;
			}
			em {
				font-style: normal;
				text-decoration: underline;				
			}
		}
		.upload_btn{
			overflow: hidden;
		}
	}
</style>