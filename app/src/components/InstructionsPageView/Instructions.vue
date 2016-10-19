<template>
	<div class="content">
		<h3>帮助文档</h3>

		<p>本文将会介绍《Excel数据过滤工具》的使用方法及一些注意事项。</p>

		<!-- 1 -->
		<h3>关于XCel</h3>
		<p>XCel -《Excel数据过滤工具》	是凹凸实验室出品的一款可通过可视化操作对Excel文档（.xls和.xlsx）进行过滤筛选的工具。</p>
		
		<h3>文件要求</h3>
		<p>Excel 文件的要求如下：</p>
		<ul>
			<li>表格第一行中的列因作为表头而不参与筛选。若该行存在为空的单元格，则会自动命名为【表头空N（N从0开始自增1）】</li>
			<li>从第一列不为空的位置开始读取数据</li>
			<li>表格中均要求是<strong>单一表格（即无合并表格）</strong></li>
			<li>对于数据量较大的文件，该程序只会渲染<strong>前50行数据</strong>，但导出的文件是完整的</li>
			<li>若文件确实过大，建议将文件分割成几份后进行赛选过滤</li>
		</ul>
		<!-- 2 -->
		<h3>使用方法</h3>
		
		<!-- 2.1 -->
		<h5>导入文件</h5>
		<p>导入文件有三种方式：</p>
		<ol>
			<li>点击底部左侧的“<i class="fa fa-upload"></i>”按钮</li>
			<li>拖拽到指定区域（在未导入任何文件的情况下）</li>
			<li>双击左侧栏的文件名导入历史文件</li>
		</ol>

		<!-- 2.2 -->
		<h5>导出文件</h5>
		<p>添加好所有筛选条件后，点击筛选列表右侧的“✅ ”按钮。点击后程序会根据你所添加的所有条件，一次性地对数据进行剔除/保留操作，最后程序会将过滤后的数据生成.xlsx文件。</p>
		
		<!-- 2.3 -->
		<h5>保留/剔除操作</h5>
		<p>程序右上角可选择“保留”或“剔除”操作。保留即将符合筛选条件的数据会保留下来，剔除同理。</p>
		<p>为了方便阐述，下文将统一用“保留”。</p>
		<p>本程序目前主要提供3种筛选方式，分别是：</p>
		<ol>
			<li>单列运算逻辑</li>
			<li>多列运算逻辑</li>
			<li>双列范围逻辑</li>
		</ol>
		
		<p>这三种方式可通过表单的第二列的逻辑操作符（且/或）进行任意组合。另外，表单的最后一列“组别”下拉框则提供了让多个筛选条件结合为一体的方式。</p>
		<p>举例：A>20 && (B="刘"||C="强")</p>
		<p>上述案例中，&& 就应用了逻辑操作符，而括号内的运算就应用了“组别”功能。</p>

		<!-- 2.3.1 -->
		<h5>1. 单列运算逻辑</h5>
		<p>单列运算逻辑是对指定的一列进行筛选。</p>
		<p>通过下拉表单选择需要操作的列后，再选择下列操作符：</p>
		<table class="table is_bordered is_striped is_narrow">
			<tr>
				<th>大于（或等于）</th>
				<td>对数字和字母进行大于（或等于）比较操作，列的值若大于指定值就保留/该行数据。其中字母之间的比较是根据 <a @click="openURL('ascii')">ASCII表</a> 进行比较（如：a > A）</td>
			</tr>
			<tr>
				<th>小于（或等于）</th>
				<td>与【大于（或等于）】同理</td>
			</tr>
			<tr>
				<th>等于</th>
				<td>与【大于（或等于）】同理</td>
			</tr>
			<tr>
				<th>不等于</th>
				<td>与【大于（或等于）】同理</td>
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
		</table>
		
		<p>备注：上述操作符均为<strong>基本操作符</strong>。</p>

		<!-- 2.3.2 -->
		<h5>2. 多列运算逻辑</h5>
		<p>多列运算逻辑是对你所选择的列进行指定运算后的再进行筛选的操作。</p>
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
		<p>双列范围逻辑是对你所指定的两列范围内的列（包含自身）进行基本操作符判断，若该范围内<strong>至少有N列（默认1列）符合指定的判断条件，则保留该行</strong>。</p>
		<p>通过输入框填写需要操作的列，以逗号（中英文均可）进行分隔，列可以是字母或数字。注意：只需输入两列。</p>
		<p>具体操作符与【单列运算逻辑】相同。</p>
		
		<!-- 2.4 -->
		<h3>联系</h3>
		<p>如遇软件使用上的问题，请联系 <a @click="openURL('aotu')">凹凸实验室</a>。同时，也欢迎你提出宝贵的意见。</p>
		<div>
			<img src="assets/qrcode.jpg" alt="凹凸实验室二维码">
		</div>
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