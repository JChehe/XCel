<template>
	<nav class="panel file-panel">
	  <p class="panel-tabs is-left">
	    <a href="javascript:;" 
	    	v-for="fileType in allFileType" 
	    	:class="{'is-active': $index === curTypeIndex}" 
	    	@click="tabFileType($index, fileType)">
	    	{{ fileType }}
	    </a>
	  </p>
	  <div class="list">
	  	<a href="javascript:;" class="panel-block"
	  		v-for="file in fileList | filterByQuery curSearchVal | filterByType curTypeName">
		    <span class="panel-icon">
		      <i class="fa fa-book"></i>
		    </span>
		    {{ file.name }}
		    <button class="button is-small" :class="{'is-loading': $index === curLoadingIndex}" 
		    	@click="confirm(file.path, $index)">
		    	导入
		    </button>
		  </a>
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
				curTypeIndex: 0,
				curTypeName: "all",
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
			tabFileType(n, s){
				this.curTypeIndex = n
				this.curTypeName = s
			},
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

<style>
	.panel-tabs.is-left{
		-webkit-box-pack: start;
      -ms-flex-pack: start;
        justify-content: flex-start;
	}
	.panel-tabs a{
		font-size: 12px;
	}
	.file-panel{
		position: relative;
		border: 0;
		margin-bottom: 0!important;
	}
	.panel{
		text-align: left;
	}
	.list{
		display: block;
		height: calc(100vh - 226px);
		overflow: auto;
		box-shadow: inset 0 -6px 20px -12px rgba(0,0,0,.7)

	}
	.list>a{
		position: relative;
	}
	.list>a .button.is-loading{
		display: block;
	}
	.list>a:hover .button{
		display: block;
	}
	.list .button{
		display: none;
		position: absolute;
		right: 10px;
		top: 50%;
		-webkit-transform: translateY(-50%);
		-ms-transform: translateY(-50%);
		-o-transform: translateY(-50%);
		transform: translateY(-50%);
	}	
</style>