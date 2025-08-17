import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Re-export RTK Query hooks for convenience
export {
  useSearchSeasonsQuery,
  useGetSeasonDetailsQuery,
  useLazySearchSeasonsQuery,
  useLazyGetSeasonDetailsQuery,
  useRefreshSearchCacheMutation,
  useRefreshSeasonDetailsMutation,
  useCacheInvalidation,
} from './api/apiSlice';
