<template>
	<footer class="footer" :class="{isShowSideBar: isShowSideBar}">
		<ul class="btn_group">
			<li class="btn search_btn" title="搜索文件" @click="focusSearchInput">
				<i class="fa fa-search"></i>
				<!-- <div class="search_panel">
					<form action="">
						<label>
							<input type="text" placeholder="文件名" v-model="">
						</label>
					</form>
				</div> -->
			</li>
			<li class="btn upload_btn" title="上传文件">
				<i class="fa fa-upload"></i>
				<input type="file" @change="handleFile">
			</li>
			<li class="btn filter_btn" title="添加筛选条件">
				<i class="fa fa-filter"></i>
			</li>
			<li class="btn instruction_btn" title="使用说明">
				<i class="fa fa-info"></i>
			</li>
		</ul>
		<div>
			<p class="summary_info">筛选后数据为 <em>300</em> 行，原始记录为 <em>1024</em> 行，共 <em>3</em> 个<span attr="会变">保留</span>条件</p>
			<img src="./assets/O2-icon.png" alt="">
		</div>
		
	</footer>
</template>

<script>
	import { getSideBarStatus, getFilterPanelStatus } from '../../vuex/getters'
	import { toggleSideBar } from '../../vuex/actions'
	export default {
		vuex: {
			getters: {
				isShowSideBar: getSideBarStatus
			},
			actions: {
				toggleSideBar
			}
		},
		methods: {
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
	/*.search_panel{
		position: absolute;
	}*/
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
	.footer.isShowSideBar {
		/*margin-left: 269px;*/
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
	}
	.footer .btn_group{
		font-size: 0;
		display: flex;
		justify-content: space-between;
		min-width: 120px;
		max-width: 150px;
		width: 30%;
		margin-right: 20px;
	}
	.footer>div{
		flex-wrap: nowrap;
		white-space: nowrap;
	}
	.footer .btn_group li{
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
	}
	.footer .btn_group li.cur{
		color: #fff;
	}
	.footer .btn_group li:not(:last-child) {
		margin-right: 2.5%;
	}
	.footer .btn_group li.cur{
		color: #2B3244;
	}
	.footer .summary_info{
		font-size: 12px;
		color: #fff;
		display: inline-block;
		vertical-align: middle;
		white-space: nowrap;
	}
	.footer .summary_info em{
		font-style: normal;
		text-decoration: underline;
	}
	.footer .summary_info+img{
		width: 24px;
		vertical-align: middle;
		border-radius: 50%;
		margin-left: 5px;
	}

	.upload_btn{
		overflow: hidden;
	}
</style>