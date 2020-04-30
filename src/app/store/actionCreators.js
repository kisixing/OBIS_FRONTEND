import { GET_USER_DOC, ALL_FORM_DATA, IS_FORM_CHANGE, CHECK_HIGHRISK_ALERT, CLOSE_HIGHRISK_ALERT, SHOW_TRIAL_MODAL, 
        SHOW_TRIAL_CARD, SHOW_PHAR_MODAL, SHOW_PHAR_CARD, IS_MEET_PHAR, CHECKED_KEYS, ALL_REMINDER_MODAL, CLOSE_REMINDER_MODAL, 
        SHOW_REMINDER_MODAL, OPEN_MEDICAL_ADVICE, GET_DIAGNOSIS, OPEN_YCQ, TRIAL_VISIBLE, IS_SAVE, SHOW_SYP_MODAL, 
        GET_SZ_LIST, GET_FZ_LIST, GET_RELATEDID, GET_WHICH, TEMPLATE_TREE1, SET_EMPTY_DATA, GET_YCQ_ENTITY  } from './actionTypes.js'

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
export const templateTree1Action = (list) => ({
  type: TEMPLATE_TREE1,
  list
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

export const getDiagnisisAction = (data) => ({
  type: GET_DIAGNOSIS,
  data
})

export const openYCQAction = (bool) => ({
  type: OPEN_YCQ,
  bool
})

export const trailVisibleAction = (bool) => ({
  type: TRIAL_VISIBLE,
  bool
})

export const isSaveAction = (bool) => ({
  type: IS_SAVE,
  bool
})

export const showSypAction = (bool) => ({
  type: SHOW_SYP_MODAL,
  bool
})

export const szListAction = (list) => ({
  type: GET_SZ_LIST,
  list
})
export const fzListAction = (list) => ({
  type: GET_FZ_LIST,
  list
})
export const getIdAction = (param) => ({
  type: GET_RELATEDID,
  param
})
export const getWhichAction = (param) => ({
  type: GET_WHICH,
  param
})

export const setEmptyAction = (obj) => ({
  type: SET_EMPTY_DATA,
  obj
})
 
export const getYCQAction = (obj) => ({
  type: GET_YCQ_ENTITY,
  obj
})