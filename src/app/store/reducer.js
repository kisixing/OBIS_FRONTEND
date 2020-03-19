import { GET_USER_DOC, ALL_FORM_DATA, IS_FORM_CHANGE, CHECK_HIGHRISK_ALERT, CLOSE_HIGHRISK_ALERT, SHOW_TRIAL_MODAL, 
        SHOW_TRIAL_CARD, SHOW_PHAR_MODAL, SHOW_PHAR_CARD, IS_MEET_PHAR, CHECKED_KEYS, ALL_REMINDER_MODAL, CLOSE_REMINDER_MODAL, 
        SHOW_REMINDER_MODAL, OPEN_MEDICAL_ADVICE, GET_DIAGNOSIS, OPEN_YCQ, TRIAL_VISIBLE, IS_SAVE, SHOW_SYP_MODAL, 
         } from './actionTypes.js'
const defaultState = {
  userDoc: {},
  allFormData: null,
  isFormChange: false,
  highriskAlert:[],
  isShowTrialModal: false,
  isShowTrialCard: false,
  isShowPharModal: false,
  isShowPharCard: false,
  isMeetPhar: false,
  checkedKeys: [],
  allReminderModal: [],
  isOpenMedicalAdvice: true,
  isShowReminderModal: false,
  diagList: [],
  openYCQ: false,
  trialVisible: false,
  isSave: false,
  isShowSypModal: false,
}

export default (state = defaultState, action) => {
    if(action.type === GET_USER_DOC) {
      const newState = JSON.parse(JSON.stringify(state));
      newState.userDoc = action.data;
      return newState;
    }

    if(action.type === ALL_FORM_DATA) {
      const newState = JSON.parse(JSON.stringify(state));
      newState.allFormData = action.data;
      return newState;
    }

    if(action.type === IS_FORM_CHANGE) {
      const newState = JSON.parse(JSON.stringify(state));
      newState.isFormChange = action.bool;
      return newState;
    }

    if(action.type === CHECK_HIGHRISK_ALERT) {
      const newState = JSON.parse(JSON.stringify(state));
      newState.highriskAlert = action.data;
      return newState;
    }
    if(action.type === CLOSE_HIGHRISK_ALERT) {
      const newState = JSON.parse(JSON.stringify(state));
      newState.highriskAlert[action.index].visible = false;
      return newState;
    }

    if(action.type === SHOW_TRIAL_MODAL) {
      const newState = JSON.parse(JSON.stringify(state));
      newState.isShowTrialModal = action.bool;
      return newState;
    }
    if(action.type === SHOW_TRIAL_CARD) {
      const newState = JSON.parse(JSON.stringify(state));
      newState.isShowTrialCard = action.bool;
      return newState;
    }

    if(action.type === SHOW_PHAR_MODAL) {
      const newState = JSON.parse(JSON.stringify(state));
      newState.isShowPharModal = action.bool;
      return newState;
    }
    if(action.type === SHOW_PHAR_CARD) {
      const newState = JSON.parse(JSON.stringify(state));
      newState.isShowPharCard = action.bool;
      return newState;
    }
    if(action.type === IS_MEET_PHAR) {
      const newState = JSON.parse(JSON.stringify(state));
      newState.isMeetPhar = action.bool;
      return newState;
    }
    if(action.type === CHECKED_KEYS) {
      const newState = JSON.parse(JSON.stringify(state));
      newState.checkedKeys = action.arr;
      return newState;
    }
    
    if(action.type === ALL_REMINDER_MODAL) {
      const newState = JSON.parse(JSON.stringify(state));
      newState.allReminderModal = action.data;
      return newState;
    }
    if(action.type === CLOSE_REMINDER_MODAL) {
      const newState = JSON.parse(JSON.stringify(state));
      newState.allReminderModal[action.index].visible = false;
      return newState;
    }
    if(action.type === SHOW_REMINDER_MODAL) {
      const newState = JSON.parse(JSON.stringify(state));
      newState.isShowReminderModal = action.bool;
      return newState;
    }
    if(action.type === OPEN_MEDICAL_ADVICE) {
      const newState = JSON.parse(JSON.stringify(state));
      newState.isOpenMedicalAdvice = action.bool;
      return newState;
    }

    if(action.type === GET_DIAGNOSIS) {
      const newState = JSON.parse(JSON.stringify(state));
      newState.diagList = action.data;
      return newState;
    }

    if(action.type === OPEN_YCQ) {
      const newState = JSON.parse(JSON.stringify(state));
      newState.openYCQ = action.bool;
      return newState;
    }

    if(action.type === TRIAL_VISIBLE) {
      const newState = JSON.parse(JSON.stringify(state));
      newState.trialVisible = action.bool;
      return newState;
    }
    
    if(action.type === IS_SAVE) {
      const newState = JSON.parse(JSON.stringify(state));
      newState.isSave = action.bool;
      return newState;
    }

    if(action.type === SHOW_SYP_MODAL) {
      const newState = JSON.parse(JSON.stringify(state));
      newState.isShowSypModal = action.bool;
      return newState;
    }

    return state;
}