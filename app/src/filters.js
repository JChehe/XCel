export default{
	filterByType(fileList, type){
		if(type.toUpperCase() === "ALL") return fileList

		var filterRegExp = new RegExp(( type + "$" ), "gi")

		return fileList.filter(function(file, index) {
			if(file.name.match(filterRegExp)) return true
		});
	},
	filterByQuery(fileList, query){
		if(query.trim().length === 0) return fileList

		var filterRegExp = new RegExp(query, "gi")

		return fileList.filter((file, index) => {
			if(file.name.match(filterRegExp)) return true
		})
	}
}