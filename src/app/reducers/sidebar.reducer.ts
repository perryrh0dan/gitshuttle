import { createReducer, on } from '@ngrx/store';
import { open, close, toggle } from '../actions/sidebar.actions';

export const initialState = false;
 
const _sidebarReducer = createReducer(initialState,
  on(open, state => true),
  on(close, state => false),
  on(toggle, state => !state)
);
 
export function sidebarReducer(state, action) {
  return _sidebarReducer(state, action);
}
