/**
 * 命理大师 - 通用工具函数
 */

function formatTime(date) {
  if (!(date instanceof Date)) date = new Date(date)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}`
}

function formatDate(date) {
  if (!(date instanceof Date)) date = new Date(date)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function generateId() {
  return Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 6)
}

function debounce(fn, delay) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

function showToast(title, icon = 'none', duration = 2000) {
  wx.showToast({ title, icon, duration })
}

function showLoading(title = '加载中...') {
  wx.showLoading({ title, mask: true })
}

function hideLoading() {
  wx.hideLoading()
}

module.exports = {
  formatTime,
  formatDate,
  generateId,
  debounce,
  deepClone,
  showToast,
  showLoading,
  hideLoading
}
