import { configureStore } from '@reduxjs/toolkit';
import seasonsReducer from './slices/seasonsSlice';
import selectedItemsReducer from './slices/selectedItemsSlice';

export const store = configureStore({
  reducer: {
    seasons: seasonsReducer,
    selectedItems: selectedItemsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;