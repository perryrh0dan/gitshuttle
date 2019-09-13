import { createAction } from '@ngrx/store';

export const open = createAction('[MainTab] Open Tab', (payload: string) => ({payload}));