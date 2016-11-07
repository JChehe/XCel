<template>
	<span class="select">
		<select v-model="groupId">
			<option value="-1">组别</option>
			<option v-for="index in groupNum" :value="getGroupValue(index)">{{ getGroupValue(index) }}</option>
		</select>
		<p class="val_mask">{{ getGroupName(groupId) }}</p>
	</span>
</template>

<script>
	import { getCharCol } from "../../utils/ExcelSet"
	export default {
		data() {
			return {
				groupNum: 5
			}
		},
		props: {
			groupId: {
				default: -1,
				required: true,
				type: [Number, String]
			}
		},
		methods: {
			getGroupValue(index) {
				return getCharCol(index)
			},
			getGroupName(groupId) {
				return groupId == '-1' ? '组别' : groupId
			}
		}
	}
</script>

<style scoped lang="scss">
	
</style>