import { CHECK_HIGHRISK_ALERT, CLOSE_HIGHRISK_ALERT, SHOW_TRIAL_MODAL, SHOW_PHAR_CARD } from './actionTypes.js'
 
export const getAlertAction = (data) => ({
  type: CHECK_HIGHRISK_ALERT,
  data
})

export const closeAlertAction = (index) => ({
  type: CLOSE_HIGHRISK_ALERT,
  index
})

export const showTrialAction = (bool) => ({
  type: SHOW_TRIAL_MODAL,
  bool
})

export const showPharCardAction = () => ({
  type: SHOW_PHAR_CARD
})
