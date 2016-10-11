
var filterUtils = {
  mathOperaArr: [">", "<", ">=", "<="],
  conditionArr: ["=", "!=", "contain", "notContain", "startsWith", "endsWith", "regexp"],
  
  filterByOneOperator(args){
    var {row, colKeys, filterCol, operator, target} = args
    var selectKey = colKeys[filterCol]
    var curVal = row[selectKey]
    if(curVal === undefined) {
      return false
    }else{
      return this.filterUnit({operator, curVal, target})
    }
  },
  // 双列范围逻辑的【非or、and】，即表单3.1
  filterByDoubleColsRange(args) {
    var { row, colKeys, filterCol, operator, target, needConformColIndex } = args
    
    var passCounter = 0

    // 判断每列中是否有一列符合单一逻辑，即3.1
    for(var i = 0, len = filterCol.length; i < len; i++) {
      var selectKey = filterCol[i]
      var curKey = colKeys[selectKey]
      var isCurColPassed = this.filterUnit({
        operator,
        curVal: row[curKey],
        target: target
      })
      if(isCurColPassed) {
        passCounter++
      }
      if(passCounter >= needConformColIndex){
        return true
      }
    }
    return false
  },
  // 第二个表单：多列运算逻辑
  filterByMultiColCalc(args){
    // 此处 filterCol 是数组
    var { row, colKeys, filterCol, operator, target, colOperator } = args
    var rowCalcResult = this.calcMultiCol({
      row,
      colOperator,
      filterCol,
      colKeys
    })
    console.log({row, colOperator, filterCol})
    console.log(rowCalcResult)
    return this.filterUnit({
      operator,
      curVal: rowCalcResult,
      target
    })
  },
  // 计算每行是否符合要求
  calcMultiCol(args){
    var { row, colOperator, colKeys, filterCol } = args
    var calcResult
    if(!colOperator.includes('time')){
      calcResult = this.calcNum({row, colOperator, filterCol, colKeys})
      // console.log("calcResult", calcResult)
    }else{
      var date0 = moment(row[colKeys[filterCol[0] - 1]], "m/d/y hh:mm")
      var date1 = moment(row[colKeys[filterCol[1] - 1]], "m/d/y hh:mm")
      var diff = date1.diff(date0, "seconds")
      // minutes
      calcResult = Math.floor(diff/60)
    }
    return calcResult
  },
  calcNum(args){
    var {colOperator, row, filterCol, colKeys} = args
    var result = row[colKeys[filterCol[0]]]
    result = result === undefined ? 0 : +result
    if(isNaN(result)) return undefined
    console.log(colOperator, row, filterCol, colKeys)
    // console.log(filterCol)
    for(var i = 1, len = filterCol.length; i < len; i++){
      var cKey = colKeys[filterCol[i]]
      var curVal = row[cKey] === undefined ? 0 : +row[cKey]
      if(isNaN(curVal)) return undefined

      switch (colOperator){
        case "+": result += curVal; break;
        case "-": result -= curVal; break;
        case "*": result *= curVal; break;
        case "/": result /= curVal; break;
        case "%": result %= curVal; break;
        default: console.log("calcNumSet未匹配操作符")
      }
    }
    return isNaN(result) ? undefined : result
  },
  filterUnit(args){
    var { operator, curVal, target } = args
    if(operator == undefined || target == undefined || curVal == undefined){
      return false
    }
    if(!isNaN(+curVal) || !isNaN(+target)){ // +"a" 是 NaN，另外：toFixed是为了避免浮点数的不精确表示，如 0.1+0.2 = 0.30000000000000004
      // 另外toFixed 返回的是字符串类型
      curVal = typeof (+curVal) === "number" ? +(+curVal).toFixed(12) : (+curVal)
      target = typeof (+target) === "number" ? +(+target).toFixed(12) : (+target)
    }
    // console.log(typeof curVal, typeof operator, typeof target)
    // console.log(curVal,operator,target)
    switch (operator) {
      case ">": return (curVal > target); break;
      case "<": return (curVal < target); break;
      case "<=": return (curVal <= target); break;
      case ">=": return (curVal >= target); break;
      // 上面是逻辑操作符
      // 下面是字符串操作符
      // 因为= !=可用于字符串的对比，因此不放在逻辑操作符内
      // 下面的字符串方法对参数是Number也适用
      case "=": return (curVal == target); break;
      case "!=": return (curVal != target); break; 
      case "contain": return curVal.includes(target); break;
      case "notContain": return !curVal.includes(target); break;
      case "startsWith": return curVal.startsWith(target); break;
      case "endsWith": return curVal.endsWith(target); break;
      case "regexp":
        var regexp = new RegExp(target, "ig")
        return curVal.match(regexp); break;
      default: 
        console.log("未匹配操作符")
        return true
    }
  }
}


module.exports = filterUtils