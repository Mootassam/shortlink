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

export const deleteUrlLoading = createSelector(
  selectState,
  (select) => select.loadingremove
);

export const editUrl = createSelector(
  selectState,
  (state) => state.updateLoading
);

export const sepecifDetail = createSelector(
  selectState,
  (state) => state.linksDetail
);

export const LoadingUpdate = createSelector(
  selectState,
  (state) => state.updateLoading
);

export const editLoading = createSelector(
  selectState,
  (state) => state.editLoading
);

export const loadingSearch = createSelector(
  selectState,
  (state) => state.searchLoading
);
