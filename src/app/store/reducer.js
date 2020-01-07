import { CHECK_HIGHRISK_ALERT, CLOSE_HIGHRISK_ALERT, SHOW_TRIAL_MODAL, SHOW_PHAR_CARD } from './actionTypes.js'
const defaultState = {
  highriskAlert:[],
  isShowTrialModal: true,
  isShowTrialCard: false,
  isShowPharCard: false
}

export default (state = defaultState, action) => {
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
    if(action.type === SHOW_PHAR_CARD) {
      const newState = JSON.parse(JSON.stringify(state));
      newState.isShowPharCard = true;
      return newState;
    }

    return state;
}