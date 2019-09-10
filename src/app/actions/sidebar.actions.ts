import { createAction } from '@ngrx/store';

export const open = createAction('[Sidebar] Open sidebar',);
export const close = createAction('[Sidebar] Close sidebar');
export const toggle = createAction('[Sidebar] Toggle sidebar');