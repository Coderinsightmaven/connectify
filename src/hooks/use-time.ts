import moment from "@/lib/moment-config"

export function useTime() {
  const formatTimeAgo = (date: Date | string) => {
    return moment(date).fromNow()
  }

  const formatDate = (date: Date | string, format = "MMM DD, YYYY") => {
    return moment(date).format(format)
  }

  const formatTime = (date: Date | string, format = "h:mm A") => {
    return moment(date).format(format)
  }

  const formatDateTime = (date: Date | string, format = "MMM DD, YYYY h:mm A") => {
    return moment(date).format(format)
  }

  const isToday = (date: Date | string) => {
    return moment(date).isSame(moment(), 'day')
  }

  const isYesterday = (date: Date | string) => {
    return moment(date).isSame(moment().subtract(1, 'day'), 'day')
  }

  const getRelativeTime = (date: Date | string) => {
    const momentDate = moment(date)
    
    if (isToday(date)) {
      return formatTime(date)
    } else if (isYesterday(date)) {
      return `Yesterday ${formatTime(date)}`
    } else if (momentDate.isSame(moment(), 'year')) {
      return formatDate(date, "MMM DD")
    } else {
      return formatDate(date, "MMM DD, YYYY")
    }
  }

  return {
    formatTimeAgo,
    formatDate,
    formatTime,
    formatDateTime,
    isToday,
    isYesterday,
    getRelativeTime,
    moment
  }
} 