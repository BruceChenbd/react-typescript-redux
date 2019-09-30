import * as api from '../api/fetchdata';
export function dateFmt(pattern: string = 'YYYY-MM-DD hh:mm:ss', date: Date = new Date()) {
  let m: any = {
    'Y+': date.getFullYear(),
    'M+': date.getMonth() + 1,
    'D+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }

  Object.keys(m).forEach((k: string) => {
    if (new RegExp('(' + k + ')').test(pattern)) {
      pattern = pattern.replace(RegExp.$1, ('00' + m[k]).slice(-RegExp.$1.length))
    }
  })
  return pattern
}

export function checkUserToken() {
  return api.checkUser().then(res => {
    return res
  }).catch(err => {
    console.log(err,'err')
  })
}