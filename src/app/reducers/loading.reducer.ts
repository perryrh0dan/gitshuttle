import { createReducer, on } from '@ngrx/store';
import { start, stop } from '../actions/loading.actions';

export const initialState = false;

const _loadingReducer = createReducer(initialState,
  on(start, state => true),
  on(stop, state => false)
);

export function loadingReducer(state, action) {
  return _loadingReducer(state, action);
}
