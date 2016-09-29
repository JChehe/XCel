<template>
	<div class="fixed-bottom is-fullwidth panel-block">
		<file-upload-button></file-upload-button>
	</div>
</template>

<script>
	import FileUploadButton from './FileUploadButton'

	export default {
		components: {
			FileUploadButton
		}
	}
</script>

<style scoped>
	.fixed-bottom{
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0
	}
</style>