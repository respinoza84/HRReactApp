/*
  @author Oliver Zamora
  @description Utils for Express
*/

const utils = {
  showErrors: false,
  throttleTime: 200,
  getThrottleRange: function (time: number = 0) {
    return Math.floor(Math.random() * 1000) + (time || this.throttleTime)
  },
  errorStatus: 400,
  returnEmpty: false
}

exports.utils = utils
