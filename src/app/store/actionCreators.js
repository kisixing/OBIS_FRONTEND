import { GET_USER_DOC, ALL_FORM_DATA, IS_FORM_CHANGE, CHECK_HIGHRISK_ALERT, CLOSE_HIGHRISK_ALERT, SHOW_TRIAL_MODAL, 
        SHOW_TRIAL_CARD, SHOW_PHAR_MODAL, SHOW_PHAR_CARD, IS_MEET_PHAR, CHECKED_KEYS, ALL_REMINDER_MODAL, CLOSE_REMINDER_MODAL, 
        SHOW_REMINDER_MODAL, OPEN_MEDICAL_ADVICE } from './actionTypes.js'

export const getUserDocAction = (data) => ({
  type: GET_USER_DOC,
  data
})

export const getAllFormDataAction = (data) => ({
  type: ALL_FORM_DATA,
  data
})

export const isFormChangeAction = (bool) => ({
  type: IS_FORM_CHANGE,
  bool
})
 
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
export const showTrialCardAction = (bool) => ({
  type: SHOW_TRIAL_CARD,
  bool
})

export const showPharAction = (bool) => ({
  type: SHOW_PHAR_MODAL,
  bool
})
export const showPharCardAction = (bool) => ({
  type: SHOW_PHAR_CARD,
  bool
})
export const isMeetPharAction = (bool) => ({
  type: IS_MEET_PHAR,
  bool
})
export const checkedKeysAction = (arr) => ({
  type: CHECKED_KEYS,
  arr
})

export const allReminderAction = (data) => ({
  type: ALL_REMINDER_MODAL,
  data
})
export const closeReminderAction = (index) => ({
  type: CLOSE_REMINDER_MODAL,
  index
})
export const showReminderAction = (bool) => ({
  type: SHOW_REMINDER_MODAL,
  bool
})
export const openMedicalAction = (bool) => ({
  type: OPEN_MEDICAL_ADVICE,
  bool
})
