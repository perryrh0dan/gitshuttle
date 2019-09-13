import { createReducer, on, ActionsSubject } from '@ngrx/store';
import { open } from '../actions/maintab.actions';

// export const initialState = 'left';
export const initialState = { tab: 'left' };

const _maintabReducer = createReducer(initialState,
  // on(open, (state, { payload }) => payload),
  on(open, (state, { payload }) => ({
    ...state,
    tab: payload
  }))
);

export function maintabReducer(state, action) {
  return _maintabReducer(state, action);
}
