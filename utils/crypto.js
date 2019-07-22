import CryptoJS from 'crypto-js'

const Key16 = '20D36F99C1684DF1'
var Keys = getKey()

function getKey() {
  var time = new Date()
  var myYear = time.getFullYear().toString()
  var myMonth = time.getMonth() + 1
  var myDay = time.getDate()

  if (myMonth < 10) {
    myMonth = '0' + myMonth.toString()
  }

  if (myDay < 10) {
    myDay = '0' + myDay.toString()
  }
  // return 'sX' + myYear + '~!' + myMonth + '!~' + myDay + 'eX'
  // 2019.06.06换成固定的Key以解决跨天时接口调用失败
  return '20D36F99C1684DF0'
}

// AES加密,字符串 key iv  返回base64
export function encrypt(txt) {
  var iv = CryptoJS.enc.Utf8.parse(Key16)
  var key = CryptoJS.enc.Utf8.parse(Keys)
  var srcs = CryptoJS.enc.Utf8.parse(txt)
  var encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
    iv: iv
  })
  return encrypted.toString()
}
// AES解密,字符串 key iv
export function decrypt(txt) {
  var iv = CryptoJS.enc.Utf8.parse(Key16)
  var key = CryptoJS.enc.Utf8.parse(Keys)
  var decrypt = CryptoJS.AES.decrypt(txt, key, {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
    iv: iv
  })
  return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}
