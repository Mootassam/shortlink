import { createSlice } from "@reduxjs/toolkit";

const generateSlice = createSlice({
  name: "short",
  initialState: {
    shortLoading: false,
    loginLoading: false,
    multiLoading: false,
    showLoading: false,
    logoutLoading: false,
    loadingremove: false,
    updateLoading: false,
    editLoading: false,
    searchLoading: false,
    links: [],
    linksDetail: [],
  },
  reducers: {
    shortLoading: (state, actions) => {
      state.shortLoading = actions.payload;
    },
    deleteLoading: (state, actions) => {
      state.loadingremove = actions.payload;
    },
    loginLoading: (state, actions) => {
      state.loginLoading = actions.payload;
    },
    multiLoading: (state, actions) => {
      state.multiLoading = actions.payload;
    },

    logoutLoading: (state, actions) => {
      state.logoutLoading = actions.payload;
    },

    getLoading: (state, actions) => {
      state.showLoading = actions.payload;
    },

    setLink: (state, actions) => {
      state.links = actions.payload;
    },

    setSearch: (state, actions) => {
      state.links = actions.payload;
    },
    getUpdateLoading: (state, actions) => {
      state.updateLoading = actions.payload;
    },

    setDetailUrl: (state, actions) => {
      state.linksDetail = actions.payload.links;
    },

    geteditLoading: (state, actions) => {
      state.editLoading = actions.payload;
    },
    getSearchLoading: (state, actions) => {
      state.searchLoading = actions.payload;
    },
  },
});

export const {
  shortLoading,
  loginLoading,
  getLoading,
  multiLoading,
  setLink,
  logoutLoading,
  deleteLoading,
  getUpdateLoading,
  setDetailUrl,
  geteditLoading,
  getSearchLoading,
  setSearch
} = generateSlice.actions;

export default generateSlice.reducer;
