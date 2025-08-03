import { configureStore } from '@reduxjs/toolkit';
import seasonsReducer from './slices/seasonsSlice';
import selectedItemsReducer from './slices/selectedItemsSlice';
import itemDetailsReducer from './slices/itemDetailsSlice';

export const store = configureStore({
  reducer: {
    seasons: seasonsReducer,
    selectedItems: selectedItemsReducer,
    itemDetails: itemDetailsReducer,
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