import { configureStore, combineReducers } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from 'redux-persist';

import authReducer from '@/redux/authSlice';
import userReducer from '@/redux/userSlice';
import loaderReducer from '@/redux/loaderSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'user'], // 👈 ONLY these persisted
};

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  loader: loaderReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);