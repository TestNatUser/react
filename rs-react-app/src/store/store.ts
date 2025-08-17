import { configureStore } from '@reduxjs/toolkit';
import seasonsReducer from './slices/seasonsSlice';
import selectedItemsReducer from './slices/selectedItemsSlice';
import itemDetailsReducer from './slices/itemDetailsSlice';
import { apiSlice } from './api/apiSlice';

export const store = configureStore({
  reducer: {
    seasons: seasonsReducer,
    selectedItems: selectedItemsReducer,
    itemDetails: itemDetailsReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
