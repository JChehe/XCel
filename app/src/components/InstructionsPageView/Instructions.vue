<template>
	<div class="content">
		<h3>使用说明</h3>

		<p>这里将会介绍《用研数据清洗工具》的使用方法及一些注意事项。</p>

		<!-- 1 -->
		<h3>软件用途</h3>
		<p>《用研数据清洗工具》	是一款面向运营的、通过可视化操作对Excel文档（.xls和.xlsx）进行过滤筛选的工具。</p>
		
		<h3>文件要求</h3>
		<p>Excel 文件的要求如下：</p>
		<ul>
			<li>第一行为每列的字段名，因此该列不参与筛选。若该行存在为空的单元格，则会自动命名为【表头空N（N从0开始自增1）】</li>
			<li>从第一列不为空的位置开始读取数据</li>
			<li>表格中均要求是单一表格（即无合并表格）</li>
			<li>对于数据量较大的文件，该程序只会渲染<strong>前50行数据</strong>，但导出的文件是完整的</li>
			<li>若文件确实过大，建议将文件分割成几份后进行过滤</li>
		</ul>
		<!-- 2 -->
		<h3>使用方法</h3>
		
		<!-- 2.1 -->
		<h5>导入文件</h5>
		<p>导入文件有三种方式：</p>
		<ol>
			<li>点击左侧栏底部的“上传Excel文件”按钮</li>
			<li>拖拽到指定区域（在未导入任何文件的情况下）</li>
			<li>点击左侧栏文件列表的“导入”按钮</li>
		</ol>

		<!-- 2.2 -->
		<h5>导出文件</h5>
		<p>点击“导出”按钮即可将过滤筛选后的Excel文件导出到本地。</p>
		
		<!-- 2.3 -->
		<h5>筛选（过滤）操作</h5>
		<p>本软件目前主要提供3种过滤方式：</p>
		<ol>
			<li>单列（组合）逻辑</li>
			<li>多列运算逻辑</li>
			<li>双列范围逻辑</li>
		</ol>

		<!-- 2.3.1 -->
		<h5>1. 单列（组合）逻辑</h5>
		<p>单列（组合）逻辑是对指定的列进行筛选，筛选条件的添加顺序的不同，会产生不一样的筛选结果。每添加一个筛选条件就是对前一个筛选结果（若有）进行再次筛选，即相当于串联操作。</p>
		<p>通过下拉表单选择需要操作的列。</p>
		<table class="table is_bordered is_striped is_narrow">
			<tr>
				<th>大于（或等于）</th>
				<td>对数字和字母进行大于（或等于）比较操作，列的值若大于指定值就保留该行数据。其中字母是根据 <a @click="openURL('ascii')">ASCII表</a> 进行比较（如：a > A）</td>
			</tr>
			<tr>
				<th>小于（或等于）</th>
				<td>与【大于（或等于）】类似</td>
			</tr>
			<tr>
				<th>等于</th>
				<td>与【大于（或等于）】类似</td>
			</tr>
			<tr>
				<th>不等于</th>
				<td>与【大于（或等于）】类似</td>
			</tr>
			<tr>
				<th>包含</th>
				<td>判断该列数据是否含有指定值，<strong>若含有则保留该行数据</strong></td>
			</tr>
			<tr>
				<th>不包含</th>
				<td>判断该列数据是否含有指定值，<strong>若不含有则保留该行数据</strong></td>
			</tr>
			<tr>
				<th>开头字符</th>
				<td>判断该列数据的开头字符是否是指定值，<strong>若是则保留该行数据</strong></td>
			</tr>
			<tr>
				<th>结束字符</th>
				<td>判断该列数据的开头字符是否是指定值，<strong>若不是则保留该行数据</strong></td>
			</tr>
			<tr>
				<th>正则表达式</th>
				<td>指定值是正则表达式（默认标志是ig，即不区分大小写和全局搜索），<strong>若该列的值匹配该正则表达式，则保留该行数据<br>例子：a?b+</td>
			</tr>
			<tr>
				<th>或</th>
				<td>该操作符下，可添加多个基本操作符，并以<strong>或（||）</strong>的形式匹配指定列。<br>
			例子：第N列的值的开头字符为‘刘’ <strong>或</strong> '章'</td>
			</tr>
			<tr>
				<th>与</th>
				<td>该操作符下，可添加多个基本操作符，并以<strong>与（&&）</strong>的形式匹配指定列。<br>
			例子：第N列的值的开头字符为'刘' <strong>且</strong> 结束字符为 '东'</td>
			</tr>
		</table>
		
		<p>备注：单列（组合）逻辑中除了“或”和“与”，其余操作符均为<strong>基本操作符</strong>。</p>

		<!-- 2.3.2 -->
		<h5>2. 多列运算逻辑</h5>
		<p>多列运算逻辑是对您所选择的列进行一定运算后的再筛选过滤的操作。</p>
		<p>通过输入框填写需要操作的列，以<strong>逗号（中英文均可）进行分隔</strong>，列可以是<strong>字母或数字</strong>。注意：时间相关的操作只能选择两列。</p>
		<table class="table is_bordered is_striped is_narrow">
			<tr>
				<th>相加</th>
				<td>多列相加后进行基本操作符判断，若符合则保留</td>
			</tr>
			<tr>
				<th>相减</th>
				<td>多列相减后进行基本操作符判断，若符合则保留</td>
			</tr>
			<tr>
				<th>相乘</th>
				<td>多列相乘后进行基本操作符判断，若符合则保留</td>
			</tr>
			<tr>
				<th>相除</th>
				<td>多列相除后进行基本操作符判断，若符合则保留</td>
			</tr>
			<tr>
				<th>求余</th>
				<td>多列求余后进行基本操作符判断，若符合则保留</td>
			</tr>
			<tr>
				<th>时间相减</th>
				<td>两列时间相减后进行基本操作符判断（单位：分钟），若符合则保留</td>
			</tr>
		</table>
		
		<!-- 2.3.3 -->
		<h5>3. 双列范围逻辑</h5>
		<p>双列范围逻辑是对您所指定的两列范围内的列（包含自身）进行基本操作符判断，若该范围内<strong>至少有一列符合指定的判断条件，则保留该行</strong>。</p>
		<p>通过输入框填写需要操作的列，以逗号（中英文均可）进行分隔，列可以是字母或数字。注意：只需输入两列。</p>
		<p>具体操作符与【单列（组合）逻辑】相同。</p>
		
		<!-- 2.4 -->
		<h3>联系</h3>
		<p>如遇软件使用上的问题，请联系 <a @click="openURL('aotu')">凹凸实验室</a> ——健超（邮箱：liujianchao1@jd.com）。</p>
	</div>
		
</template>


<script>
	// import shell from 'shell'
	const {shell} = require("electron")
	const ASCII_URL = "http://tool.oschina.net/commons?type=4"
	const AOTU_URL = "https://aotu.io/"
	export default {
		methods: {
			openURL(args){
				switch (args){
					case "ascii": shell.openExternal(ASCII_URL); break;
					case "aotu": shell.openExternal(AOTU_URL); break;
					default: console.log("无该地址");
				}
			}
		}
	}
</script>

<style>
	

</style>
<style lang="scss" scoped>
	.content{
		text-align: left;
		width: 100%;
		background-color: #fff;
		outline: 15px solid #fff;
		height: 100%;
		overflow: auto;
	}
	table th{
		white-space: nowrap;
		font-weight: 400;
	}
	.img_container{
		overflow: hidden;
		border-radius: 8px;
		width: 80%;
		img {
			width: 100%;
		}
	}
</style>