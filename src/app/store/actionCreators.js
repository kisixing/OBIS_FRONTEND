import { CHECK_HIGHRISK_ALERT, CLOSE_HIGHRISK_ALERT } from './actionTypes.js'
 
export const getAlertAction = (data) => ({
  type: CHECK_HIGHRISK_ALERT,
  data
})

export const closeAlertAction = (index) => ({
  type: CLOSE_HIGHRISK_ALERT,
  index
})
