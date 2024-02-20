import {combineReducers} from 'redux';
import authReducer from './slices/authSlice';
import dashReducer from './slices/dashSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  dash: dashReducer,
});

export default rootReducer;
