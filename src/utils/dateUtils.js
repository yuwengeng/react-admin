/*
包含n个日期时间处理函数模块
*/

/*
  格式化日期
*/
export function formateDate(time) {
  if (!time) return ''
  let date = new Date(time)
  let m = date.getMinutes()
  let s = date.getSeconds()
  // 处理个位数问题
  if (parseInt(m)<10){
    m = '0'+m; 
  }
  if (parseInt(s)<10){
    s = '0'+s;
  }
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    + ' ' + date.getHours() + ':' + m + ':' + s
}