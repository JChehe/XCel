// 该文件存放 Excel 的相关方法

// Excel 横向坐标的转换 1 <--> A
/* 来自 http://www.cnblogs.com/lavezhang/archive/2012/05/14/2499000.html */ 

export function getCharCol(n) {
  let temCol = '',
    s = '',
    m = 0

  while (n > 0) {
    m = n % 26
    if (m === 0) m = 26
    s = String.fromCharCode(m + 64) + s
    n = (n - m) / 26
  }
  return s
}

export function getNumCol(s) {
  if (!s) return 0
  let n = 0
  for (let i = s.length - 1, j = 1; i >= 0; i--, j *= 26) {
    let c = s[i].toUpperCase()
    if (c < 'A' || c > 'Z') return 0
    n += (c.charCodeAt() - 64) * j
  }

  return n
}

export const colOperator = [{
    char: '+',
    words: '相加'
  },{
    char: '-',
    words: '相减'
  },{
    char: '*',
    words: '相乘'
  },{
    char: '/',
    words: '相除'
  },{
    char: '%',
    words: '求余'
  },{
    char: '-(time)',
    words: '时间相减'
  }/*,{
    char: '+()',
    words: '字符串拼接'
  }*/]
export function getColArithmeticOperatorWords(sets, char) {
  for(let i = 0, len = sets.length; i < len; i++ ) {
    let curColOperator = sets[i]
    if(curColOperator.char === char) {
      return curColOperator.words
    }
  }
  return '匹配失败'
}

export function getLogicOperatorWords(char) {
  return char === 'and' ? '且' : '或'
}

export function getOperatorWords(sets, char) {
  for(let i = 0, len = sets.length; i < len; i++){
    let obj = sets[i]
    if(obj.char === char) 
      return obj.words
  }
  return '匹配失败'
}

export function getColOperatorWords(sets, char) {
  for(let i = 0, len = sets.length; i < len; i++){
    let obj = sets[i]
    if(obj.char === char) 
      return obj.words
  }
  return '匹配失败'
}

export function getFilterWordsPrimitive(args){
  let { operator, operatorCol, operatorWords, val, colOperatorSelect, filterType } = args,
      primitiveFilterWords = ''
  // 判断是选择哪个操作符
  switch(operator){
    case 'startsWith': ;
    case 'ends': primitiveFilterWords = `的${operatorWords}为“${val}”`;break;
    case 'regexp': primitiveFilterWords = `应用了正则表达式"/${val}/ig"`;break;
    default: 
      if(operator === 'empty' || operator === 'notEmpty') {
        primitiveFilterWords = `${operatorWords}`
      }else {
        primitiveFilterWords = `${operatorWords}"${val}"`
      }

      if(colOperatorSelect && colOperatorSelect.includes('time')) {
        primitiveFilterWords += '分钟'
      }
  }
  return primitiveFilterWords
}
