<template>
	<nav class="file_list_container">
	  <div class="file_list">
	  	<ul>
	  		<li title="双击文件名即可导入"
	  			v-for="(index, file) in fileList | filterByQuery curSearchVal" 
	  			@dblclick="confirmRead(file.path ,index)">
	  			<span>{{ file.extname.replace(/^./, "") }}</span>
	  			<p>{{ file.name }}</p>
	  			<button class="btn del_btn" @click="confirmDel(index)">删除</button>
	  		</li>
	  	</ul>
	  </div>
	</nav>
</template>


<script>
	import xlsx from 'xlsx'
	import fs from 'fs'
	import pathModule from 'path'
	import { ipcRenderer } from 'electron'
	import { changeFileType, setExcelData, setActiveSheet, setUploadFiles, delUploadFiles } from '../../vuex/actions'
	import { getCurSearchVal, getAllFileType, getUploadFiles } from '../../vuex/getters'

	export default {
		data(){
			return {
				filterFileList: [],
				curLoadingIndex: -1
			}
		},
		vuex: {
			getters: {
				fileList: getUploadFiles,
				allFileType: getAllFileType,
				curSearchVal: getCurSearchVal
			},
			actions: {
				changeFileType,
				setExcelData,
				setActiveSheet,
				setUploadFiles,
				delUploadFiles
			}
		},
		created(){
			ipcRenderer.on("sync-confirm-dialog-reponse", (event, arg) => {
				// 点击确认按钮
				if(arg.index === 0) {
					// 是否删除无效文件
					if(arg.typeId === "isDel") {
						this.delUploadFiles(arg.fileIndex)
					}
					// 是否确认导入
					if(arg.typeId === "coverFile") {
						var path = arg.path
						console.log("确定导入")
						this.$nextTick(() => {
							this.curLoadingIndex = arg.fileIndex
						})
						fs.stat(path, (err, stats) => {
							if(stats && stats.isFile()) {
								var workbook = xlsx.readFile(path)
								this.setExcelData(workbook)
								// this.setActiveSheet(0)
								console.log("第五阶段")
								this.setUploadFiles({
						      path: path,
						      name: pathModule.basename(path),
						      extname: pathModule.extname(path)
						    })
							}else{
								this.confirmDel(arg.fileIndex)
							}
							this.curLoadingIndex = -1
						})
					}
				}
			})
		},
		methods: {
			confirmRead(path, index){
				ipcRenderer.send("sync-confirm-dialog", {
					typeId: "coverFile",
					content: "导入该文件会覆盖目前的筛选结果，是否确认要导入？",
					fileIndex: index,
					path: path
				})
			},
			confirmDel(index) {
				ipcRenderer.send("sync-confirm-dialog", {
					typeId: "isDel",
					content: "当前文件不存在，是否删除该记录？",
					fileIndex: index
				})
			}
		}
	}


</script>
<style scoped>
	.del_btn{
		background-color: #FF4081;
		color: #fff;
		border: 0;
		outline: 0;
		font-size: 12px;
		cursor: pointer;
	}
</style>
<style lang="scss" scoped>
	.file_list_container {
		padding-left: 24px;
		.file_list {
			li {
				display: flex;
				align-items: center;
				height: 48px;
				justify-content: space-between;
				-webkit-user-select: none;
				user-select: none;
				&:hover .del_btn{
					display: block;
				}
				&:not(:first-child) p {
						color: rgba(0,0,0, .87);
				}
				&:first-child {
					span {
						background-color: #4285F4;
					}
					p {
						color: #4285F4;
					}
				}
				p {
					flex-grow: 1;
					font-size: 13px;
					text-align: left;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					padding-right: 10px;
				}
				span {
					display: inline-block;
					font-size: 10px;
					margin-right: 16px;
					width: 40px;
					text-align: center;
					border-radius: 2px;
					line-height: 18px;
					background-color: #6B727D;
					color: #fff;
					flex-shrink: 0;
				}
				.btn {
					margin-right: 10px;
					display: none;
					flex-shrink: 0;
				}
			}
		}
	}

</style>