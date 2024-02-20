import {configureStore} from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistReducer, persistStore} from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['auth', 'dash'],
};

let sagaMiddleware = createSagaMiddleware();

const persistedReducer = persistReducer(persistConfig, rootReducer);

let store = configureStore({
  reducer: persistedReducer,
  //   middleware: [sagaMiddleware],
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({thunk: true, serializableCheck: false}).concat(
      sagaMiddleware,
    ),
});

let persistor = persistStore(store);

sagaMiddleware.run(rootSaga);

export {store, persistor};
