
module.exports = function generateHTMLString(arg){
	var {sheetData, colKeys} = arg
	var resultHeadStr = "<tr><td>1</td>"
	var resultBodyStr = ""
	colKeys.forEach((row, index) => {
		resultHeadStr += `<td>${row}</td>`
	})
	resultHeadStr += "</tr>"

	for(var i = 0, len = Math.min(sheetData.length, 30); i < len; i++){
		var resultTrStr = "<tr>"
		colKeys.forEach((key, index) => {
			if(index === 0){
				resultTrStr += `<td>${i + 2}</td>`
			}
		})

		colKeys.forEach((col, index) => {
			var val = sheetData[i][col]
			if(val == undefined) val = ""
			resultTrStr += `<td title="${i + 2}行${getCharCol(index + 1)}列">${val}</td>`
		})
		resultTrStr += "</tr>"
		resultBodyStr += resultTrStr
	}
	
	sheetData = colKeys = null
	return (resultHeadStr + resultBodyStr)
}


function getCharCol(n) {
  var temCol = "",
    s = "",
    m = 0

  while (n > 0) {
    m = n % 26
    if (m === 0) m = 26
    s = String.fromCharCode(m + 64) + s
    n = (n - m) / 26
  }
  return s
}