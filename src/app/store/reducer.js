import { CHECK_HIGHRISK_ALERT, CLOSE_HIGHRISK_ALERT } from './actionTypes.js'
const defaultState = {
  isShowHighrisk: false,
  highriskAlert: {},
}

export default (state = defaultState, action) => {
    if(action.type === CHECK_HIGHRISK_ALERT) {
      const newState = JSON.parse(JSON.stringify(state));
      newState.highriskAlert = action.data;
      newState.isShowHighrisk = true;
      return newState;
    }
    if(action.type === CLOSE_HIGHRISK_ALERT) {
      const newState = JSON.parse(JSON.stringify(state));
      newState.isShowHighrisk = false;
      return newState;
    }

    return state;
}