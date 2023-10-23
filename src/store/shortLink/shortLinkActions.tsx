import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  shortLoading,
  loginLoading,
  getLoading,
  setLink,
  multiLoading,
  logoutLoading,
  deleteLoading,
} from "./shortLinkReducers";
import {
  generateShortLinks,
  fetchLinks,
  saveLink,
  saveMulti,
  loginService,
  logoutService,
  deleteLink,
} from "./shortLinkService";
import Message from "../../modules/shared/Message";

export const showLinks = createAsyncThunk<void, any>(
  "show/links",
  async (user, thunkAPI) => {
    try {
      thunkAPI.dispatch(getLoading(true));
      const links = await fetchLinks(user);
      thunkAPI.dispatch(setLink(links));
      thunkAPI.dispatch(getLoading(false));
    } catch (error) {
      thunkAPI.dispatch(getLoading(false));
      console.log("Error generating numbers", error);
    }
  }
);
export const generateShortLink = createAsyncThunk<void, any>(
  "generate/generateShortLink",
  async (url, thunkAPI) => {
    try {
      thunkAPI.dispatch(shortLoading(true));
      const newUrl = await generateShortLinks(url?.url);
      await saveLink(url?.url, newUrl);
      thunkAPI.dispatch(shortLoading(false));
      console.log();

      thunkAPI.dispatch(showLinks(url?.user.uid));
      Message.Success("Successfully");
    } catch (error) {
      thunkAPI.dispatch(shortLoading(false));
      console.log("Error generating numbers", error);
      Message.Success(error);
    }
  }
);

export const generateShortMulti = createAsyncThunk<void, any>(
  "generate/generateShortMulti",
  async (form, thunkAPI) => {
    try {
      thunkAPI.dispatch(multiLoading(true));
      const idDoc = await saveMulti(form.form);
      const url = window.location.href + "detail/" + idDoc;
      const newUrl = await generateShortLinks(url);
      await saveLink(url, newUrl);
      thunkAPI.dispatch(multiLoading(false));
      thunkAPI.dispatch(showLinks(form?.user.uid));
      Message.Success("Successfully");
    } catch (error) {
      thunkAPI.dispatch(multiLoading(false));
      console.log("Error generating numbers", error);
      Message.Success(error);
    }
  }
);

export const LoginIn = createAsyncThunk<void, any>(
  "login/in",
  async (_, thunkAPI) => {
    try {
      thunkAPI.dispatch(loginLoading(true));
      const userId = await loginService();
      thunkAPI.dispatch(showLinks(userId?.user.uid));
      thunkAPI.dispatch(loginLoading(false));
    } catch (error) {
      thunkAPI.dispatch(loginLoading(false));
      console.log("Error generating numbers", error);
    }
  }
);

export const deleteshortUrl = createAsyncThunk<void, any>(
  "url/delete",
  async (data, thunkAPI) => {
    console.log("data data", data);

    try {
      thunkAPI.dispatch(deleteLoading(true));
      await deleteLink(data?.id);
      thunkAPI.dispatch(showLinks(data?.user.uid));
      thunkAPI.dispatch(deleteLoading(false));
    } catch (error) {
      thunkAPI.dispatch(deleteLoading(false));
    }
  }
);
export const Logout = createAsyncThunk<void, any>(
  "login/in",
  async (_, thunkAPI) => {
    try {
      thunkAPI.dispatch(logoutLoading(true));
      await logoutService();
      thunkAPI.dispatch(showLinks(""));
      thunkAPI.dispatch(logoutLoading(false));
    } catch (error) {
      thunkAPI.dispatch(logoutLoading(false));
      console.log("Error generating numbers", error);
    }
  }
);
