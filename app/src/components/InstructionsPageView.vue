<template>
	<v-header class="is-overlay"></v-header>
	<main class="is-fullwidth">
		<instructions-area>
			
		</instructions-area>
	</main>
</template>

<script>
	import vHeader from './common/Header'
	import InstructionsArea from './InstructionsPageView/Instructions'
	export default {
		components: {
			vHeader,
			InstructionsArea
		},
		name: "instructions",
		data(){
			return {

			}
		}
	}
</script>

<style scoped>
	.is-fullwidth{
		margin-top: 52px;
		width: 100%;
		min-height: calc(100vh - 52px);
		padding: 15px;
	}
</style>