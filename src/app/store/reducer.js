import { GET_USER_DOC, ALL_FORM_DATA, IS_FORM_CHANGE, CHECK_HIGHRISK_ALERT, CLOSE_HIGHRISK_ALERT, SHOW_TRIAL_MODAL, 
        SHOW_TRIAL_CARD, SHOW_PHAR_MODAL, SHOW_PHAR_CARD, IS_MEET_PHAR, CHECKED_KEYS, ALL_REMINDER_MODAL, CLOSE_REMINDER_MODAL, 
        SHOW_REMINDER_MODAL, OPEN_MEDICAL_ADVICE, GET_DIAGNOSIS, OPEN_YCQ, TRIAL_VISIBLE, IS_SAVE, SHOW_SYP_MODAL, 
        GET_SZ_LIST, GET_FZ_LIST, GET_RELATEDID, GET_WHICH, TEMPLATE_TREE1, SET_EMPTY_DATA, GET_YCQ_ENTITY, IS_TWINS,
        SHOW_DIAG_SEARCH, SET_DIAGNOSIS, GET_DIAG_TEMP, SHOW_PREECLAMPSIA } from './actionTypes.js'
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
  templateTree1: null,
  allReminderModal: [],
  isOpenMedicalAdvice: true,
  isShowReminderModal: false,
  diagList: [],
  openYCQ: false,
  trialVisible: false,
  isSave: false,
  isShowSypModal: false,
  szList: [],
  fzList: [],
  relatedid: '',
  whichPage: '',
  emptyData: {
    "tab-0": ['现病史'],
    "tab-1": ['既往史'],
    "tab-2": ['其他病史'],
    "tab-3": ['孕产史'],
    "tab-4": ['体格检查'],
    "tab-5": ['专科检查'],
    "tab-6": ['检验检查'],
    "tab-7": ['诊断处理'],
  },
  ycqEntity: null,
  isTwins: false,
  diagnosis: '',
  isShowDiagSearch: false,
  diagTempList: null,
  isShowPreeclampsia: false,
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
    if(action.type === TEMPLATE_TREE1) {
      const newState = JSON.parse(JSON.stringify(state));
      newState.templateTree1 = action.list;
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

    if(action.type === GET_SZ_LIST) {
      const newState = JSON.parse(JSON.stringify(state));
      newState.szList = action.list;
      return newState;
    }
    if(action.type === GET_FZ_LIST) {
      const newState = JSON.parse(JSON.stringify(state));
      newState.fzList = action.list;
      return newState;
    }
    if(action.type === GET_RELATEDID) {
      const newState = JSON.parse(JSON.stringify(state));
      newState.relatedid = action.param;
      return newState;
    }
    if(action.type === GET_WHICH) {
      const newState = JSON.parse(JSON.stringify(state));
      newState.whichPage = action.param;
      return newState;
    }
    
    if(action.type === SET_EMPTY_DATA) {
      const newState = JSON.parse(JSON.stringify(state));
      newState.emptyData = action.obj;
      return newState;
    }
    
    if(action.type === GET_YCQ_ENTITY) {
      const newState = JSON.parse(JSON.stringify(state));
      newState.ycqEntity = action.obj;
      return newState;
    }

    if(action.type === IS_TWINS) {
      const newState = JSON.parse(JSON.stringify(state));
      newState.isTwins = action.bool;
      return newState;
    }

    if(action.type === SHOW_DIAG_SEARCH) {
      const newState = JSON.parse(JSON.stringify(state));
      newState.isShowDiagSearch = action.bool;
      return newState;
    }
    if(action.type === SET_DIAGNOSIS) {
      const newState = JSON.parse(JSON.stringify(state));
      newState.diagnosis = action.param;
      return newState;
    }
    if(action.type === GET_DIAG_TEMP) {
      const newState = JSON.parse(JSON.stringify(state));
      newState.diagTempList = action.list;
      return newState;
    }

    if(action.type === SHOW_PREECLAMPSIA) {
      const newState = JSON.parse(JSON.stringify(state));
      newState.isShowPreeclampsia = action.bool;
      return newState;
    }

    return state;
}