import { CHECK_HIGHRISK_ALERT, CLOSE_HIGHRISK_ALERT } from './actionTypes.js'
const defaultState = {
  highriskAlert:[],
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

    return state;
}