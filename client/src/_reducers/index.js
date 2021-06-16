import { combineReducers } from 'redux';

import { authentication } from './authentication';
import { registration } from './registration';
import { alert } from './alert';
import { board } from './board';
import { queueList } from './queue';

const rootReducer = combineReducers({
  authentication,
  registration,
  alert,
  board,
  queueList
});

export default rootReducer;
