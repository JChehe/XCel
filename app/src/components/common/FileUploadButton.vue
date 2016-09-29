<template>
	<div class="upload-btn">
		<button class="button is-fullwidth file-mask"
			:class="{'is-loading': isLoading}">
			上传Excel文件
		</button>
		<input type="file" name="upload-excel-input" 
			@change="handleFile">
	</div>
</template>

<script>
	import fs from 'fs-extra'
	import path from 'path'
	import { setExcelData, setActiveSheet, setUploadFiles } from '../../vuex/actions'
	
	export default {
		data(){
			return {
				isLoading: false
			}
		},
		vuex: {
			actions: {
				setExcelData,
				setActiveSheet,
				setUploadFiles
			}
		},
		methods: {
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
							this.setActiveSheet(0)

							this.isLoading = false
							this.setUploadFiles({
					      path: curFile.path,
					      name: curFile.name,
					      extname: path.extname(curFile.path)
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
<style scoped>
	.upload-btn{
		position: relative;
		height: 32px;
		overflow: hidden;
	}

	.file-mask, input[name="upload-excel-input"]{
		position: absolute;
		left: 0;right: 0;
		top: 0;bottom: 0;
		cursor: pointer;
	}
	input[name="upload-excel-input"]{
		opacity: 0;
	}
</style>