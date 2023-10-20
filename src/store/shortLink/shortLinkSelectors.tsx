import { createSelector } from "reselect";

const selectState = (state) => state.generate;

export const fetchLoading = createSelector(
  selectState,
  (generate) => generate.showLoading
);

export const listLinks = createSelector(
  selectState,
  (generate) => generate.links
);

export const hasRows = createSelector(listLinks, (all) => all.length);

export const shortLoading = createSelector(
  selectState,
  (state) => state.shortLoading
);

export const multiLoading = createSelector(
  selectState,
  (state) => state.multiLoading
);

export const loginLoading = createSelector(
  selectState,
  (select) => select.loginLoading
);

export const LogoutLoading = createSelector(
  selectState,
  (select) => select.logoutLoading
);
