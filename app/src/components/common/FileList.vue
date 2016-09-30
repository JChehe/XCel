<template>
	<nav class="file_list_container">
	  <div class="file_list">
	  	<ul>
	  		<li title="双击文件名即可导入"
	  			v-for="(index, file) in fileList | filterByQuery curSearchVal" 
	  			@dblclick="confirm(file.path ,index)">
	  			<span>{{ file.extname.replace(/^./, "") }}</span>
	  			<p>{{ file.name }}</p>
	  			<button class="btn del_btn" @click="delUploadFiles(index)">删除</button>
	  		</li>
	  	</ul>
	  </div>
	</nav>
</template>


<script>
	import xlsx from 'xlsx'
	import fs from 'fs'
	import pathModule from 'path'
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
		methods: {
			confirm(path, index){
				var isConfirm = window.confirm("导入该文件会覆盖目前的筛选结果，是否确认要导入？")
				if(isConfirm) {
					this.$nextTick(() => {
						this.curLoadingIndex = index
					})
					fs.stat(path, (err, stats) => {
						if(stats && stats.isFile()) {
							var workbook = xlsx.readFile(path)
							this.setExcelData(workbook)
							this.setActiveSheet(0)
							console.log("第五阶段")
							this.setUploadFiles({
					      path: path,
					      name: pathModule.basename(path),
					      extname: pathModule.extname(path)
					    })
						}else{
							var isDelConfirm = window.confirm("当前文件不存在，是否删除该记录？")
							if(isDelConfirm) {
								this.delUploadFiles(index)
							}
						}
						this.curLoadingIndex = -1
					})
				}
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
				&:hover {
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