import { GET_USER_DOC, CHECK_HIGHRISK_ALERT, CLOSE_HIGHRISK_ALERT, SHOW_TRIAL_MODAL, SHOW_TRIAL_CARD,  
          SHOW_PHAR_MODAL, SHOW_PHAR_CARD, IS_MEET_PHAR, CHECKED_KEYS } from './actionTypes.js'
const defaultState = {
  userDoc: {},
  highriskAlert:[],
  isShowTrialModal: false,
  isShowTrialCard: false,
  isShowPharModal: false,
  isShowPharCard: false,
  isMeetPhar: false,
  checkedKeys: [],
}

export default (state = defaultState, action) => {
    if(action.type === GET_USER_DOC) {
      const newState = JSON.parse(JSON.stringify(state));
      newState.userDoc = action.data;
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

    return state;
}