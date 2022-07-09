export const formatDate = (date) => {
    var hours = date.getHours()
    var minutes = date.getMinutes()
    var ampm = hours >= 12 ? 'pm' : 'am'
    hours = hours % 12
    hours = hours ? hours : 12
    minutes = minutes < 10 ? `0${minutes}` : minutes
    var strTime = hours + ':' + minutes + ' ' + ampm
    return `${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}-${date.getMonth()+1 < 10 ? `0${date.getMonth()}` : date.getMonth()}-${date.getFullYear()} ${strTime}`
  }