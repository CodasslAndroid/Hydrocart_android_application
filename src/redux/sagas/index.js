import {all} from 'redux-saga/effects';
import {authSaga} from './authSaga';
import {dashSaga} from './dashSaga';

const root = function* root() {
  yield all([authSaga(), dashSaga()]);
};

export default root;
