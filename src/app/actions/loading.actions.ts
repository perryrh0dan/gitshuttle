import { createAction } from '@ngrx/store';

export const start = createAction('[Loading] Start Loading',);
export const stop = createAction('[Loading] Stop Loading');