import { createReducer, on } from '@ngrx/store';
import { open, close } from '../actions/settings.actions';

export const initialState = false;
 
const _settingsReducer = createReducer(initialState,
  on(open, state => true),
  on(close, state => false)
);
 
export function settingsReducer(state, action) {
  return _settingsReducer(state, action);
}
