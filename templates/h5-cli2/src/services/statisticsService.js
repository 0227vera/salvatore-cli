import commonPromise from './commonPromise'

export default {
  getStatistics () {
    return commonPromise('leave/statistics')
  },
  getDepartAttendance () {
    return commonPromise('leave/depart')
  }
}
