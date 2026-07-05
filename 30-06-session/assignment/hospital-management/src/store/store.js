import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from './authSlice';
import patientsReducer from './patientsSlice';
import appointmentsReducer from './appointmentsSlice';
import labReducer from './labSlice';
import usersReducer from './usersSlice';

const persistConfig = {
  key: 'hbys-auth',
  version: 1,
  storage,
  whitelist: ['auth', 'lab'], // Oturum ve laboratuvar verilerini tut
};

const rootReducer = combineReducers({
  auth: authReducer,
  patients: patientsReducer,
  appointments: appointmentsReducer,
  lab: labReducer,
  users: usersReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
