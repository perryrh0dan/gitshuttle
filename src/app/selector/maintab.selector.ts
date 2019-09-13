import { createSelector, createFeatureSelector } from '@ngrx/store';

export const selectMainTab = createFeatureSelector<String>('maintab');

export const selectMainTabState = createSelector(
  selectMainTab,
  (state: String) => state
);