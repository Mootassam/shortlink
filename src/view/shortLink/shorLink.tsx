import React, { useEffect, useState } from "react";
import "./shorLink.css";
import "firebase/compat/auth";
import "firebase/compat/database";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch, useSelector } from "react-redux";
import {
  LoginIn,
  Logout,
  Search,
  UrlUpdate,
  generateShortMulti,
  showDetail,
  showLinks,
} from "../../store/shortLink/shortLinkActions";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import {
  LoadingUpdate,
  fetchLoading,
  hasRows,
  listLinks,
  loadingSearch,
  loginLoading,
  multiLoading,
  sepecifDetail,
} from "../../store/shortLink/shortLinkSelectors";
import LinkTable from "../TableView/LinkTable";
import { Toaster } from "react-hot-toast";
import { onAuthStateChanged } from "@firebase/auth";
import Message from "../../modules/shared/Message";

function ShortLink() {
  const [user] = useAuthState(auth);
  const dispatch: ThunkDispatch<any, void, AnyAction> = useDispatch();
  const [url, setUrl] = useState<string>();
  const [show, setShow] = useState(false);
  const loadingLinks = useSelector(fetchLoading);
  const allLinks = useSelector(listLinks);
  const coutRows = useSelector(hasRows);
  const loadingMulti = useSelector(multiLoading);
  const LoadingLogin = useSelector(loginLoading);
  const [update, setUpdate] = useState(false);
  const loadingUpdate = useSelector(LoadingUpdate);
  const [id, setId] = useState();
  const detaillurl = useSelector(sepecifDetail);
  const searchLoader = useSelector(loadingSearch);

  const [form, setNewform] = useState<{ link: string }[]>([
    {
      link: "",
    },
  ]);
  const editUlr = async (item: any) => {
    try {
      if (item) {
        await dispatch(showDetail(item));
      }

      if (item && detaillurl.length > 0) {
        setShow(true);
        setUpdate(true);
        setId(item);
      }
    } catch (error) {
      // Handle errors
    }
  };

  useEffect(() => {
    // Check detaillurl and other logic when it changes
    if (id && detaillurl.length > 0) {
      setShow(true);
      setUpdate(true);
    }
  }, [detaillurl]);

  useEffect(() => {
    if (update && detaillurl.length > 0) {
      setNewform(detaillurl);
    }
  }, [update, detaillurl]);

  const updateUrl = () => {
    dispatch(UrlUpdate({ id, form }));
  };

  const showLink = () => {
    setShow(true);
    setNewform([{ link: "" }]);
    setUpdate(false);
  };

  const getFirstName = (fullName: any) => {
    const namePart = fullName.split(" ");
    if (namePart.length > 0) {
      return namePart[0];
    }
    return fullName;
  };

  const signIn = async () => {
    try {
      dispatch(LoginIn(""));
    } catch (error) {
      alert(error);
    }
  };
  const signOut = () => {
    dispatch(Logout(""));
  };

  const handletext = (event: any) => {
    const value = event.target.value;
    setUrl(value);
  };

  // fix the  coor0100//

  function isValidURL(input) {
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
    return urlPattern.test(input);
  }

  function validateAndTrimURL(url) {
    const trimmedUrl = url.trim();
    if (!isValidURL(trimmedUrl)) {
      throw new Error("Invalid URL");
    }
    return trimmedUrl;
  }

  const searchShortUrl = async () => {
    try {
      if (!user) {
        Message.Error("Please Login ");
      }
      const trimmedUrl = validateAndTrimURL(url);
      // Assuming `dispatch` and `generateShortLink` are defined elsewhere
      await dispatch(Search(trimmedUrl));
    } catch (error) {
      Message.Error(
        "Please Verify your data its look like this format https//example.com "
      );
    }
  };

  const SaveMultiLinks = async () => {
    // Check if any of the form fields are empty
    function isValidURL(input) {
      const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
      return urlPattern.test(input);
    }
    function validateAndTrimURL(url) {
      const trimmedUrl = url.trim();
      if (!isValidURL(trimmedUrl)) {
        throw new Error("Invalid URL");
      }
      return trimmedUrl;
    }
    const isAnyEmpty = form.some((item) => item.link.trim() === "");

    if (isAnyEmpty) {
      Message.Error("Please fill in all form fields before saving.");
    } else {
      // Check if all URLs in the form are valid
      const areAllURLsValid = form.every((item) => {
        try {
          validateAndTrimURL(item.link);
          return true;
        } catch (error) {
          return false;
        }
      });

      if (areAllURLsValid) {
        if (user) {
          dispatch(generateShortMulti({ form, user }));
        } else {
          Message.Error("Auth required");
        }
      } else {
        Message.Error("Please enter valid URLs in all form fields.");
      }
    }
  };

  const addFields = () => {
    setNewform([
      ...form,
      {
        link: "",
      },
    ]);
  };
  const removeFields = (index: number) => {
    let formDelete = [...form];

    if (formDelete.length == 1) {
      Message.Error("Should be less 1 value their")
    } else {
      formDelete.splice(index, 1);
      setNewform(formDelete);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    i: number
  ) => {
    let formN = [...form];
    formN[i] = { ...formN[i], [event.target.name]: event.target.value };
    setNewform(formN);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If a user is logged in, call showLinks with their UID
        dispatch(showLinks(user.uid));
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [dispatch]);
  return (
    <div className="app">
      <div className="app__header">
        <div className="app__left">
          <img src="/logo.png" alt="" width={110} height={40} />
        </div>
        <div className="app__center"></div>
        <div className="app__right">
          {user ? (
            <div className="user__name">
              <div className="left__image">
                <img
                  src={user.photoURL || "/default-profile-image.png"}
                  alt=""
                  width={34}
                  height={34}
                  className="image__profile"
                />
              </div>
              <div className="left__user">
                <span className="welcome"> Welcome</span>
                <span className="user__loginame">
                  {getFirstName(user.displayName)}
                </span>
              </div>
            </div>
          ) : (
            <div className="app__login" onClick={signIn}>
              Login
              {LoadingLogin ? (
                <div className="spinners"></div>
              ) : (
                <img src={"/signin.png"} alt="" />
              )}
            </div>
          )}

          {user && (
            <div className="app__register" onClick={signOut}>
              Sign Out
            </div>
          )}
        </div>
      </div>

      <div className="app__content">
        <div className="content__title">
          <h1>Shorten Your Loooong Links :)</h1>
          <span className="content__span">
            Linkly is an efficient and easy-to-use URL shortening service that
            streamlines your online experience.
          </span>
        </div>
        <div className="content__search">
          <div className="input__short">
            <div className="short__left">
              <img src="/link.png" alt="" />
              <input
                type="text"
                className="url__short"
                onChange={() => handletext(event)}
                typeof="url"
                required
                placeholder="Enter the Short Link"
              />
            </div>
            <div className="short__now" onClick={() => searchShortUrl()}>
              {!searchLoader && <>Search Now!</>}

              {searchLoader && (
                <div className="shorten">
                  Searching ... <div className="spinners"></div>{" "}
                </div>
              )}
            </div>
          </div>
        </div>
        <span className="small__description">
          You can create{" "}
          <label htmlFor="" className="red">
            05{" "}
          </label>{" "}
          more links.{" "}
          <div className="clickhere" onClick={showLink}>
            {" "}
            Click here{" "}
          </div>
        </span>
      </div>

      <LinkTable
        loading={loadingLinks}
        hasRows={coutRows}
        editUlr={editUlr}
        allLinks={allLinks}
      />

      {show && (
        <div className="app__sidebar">
          <div className="content__plus">
            <div className="plus__link" onClick={addFields}>
              <i className="fa-solid fa-plus"></i>
            </div>
          </div>
          <div className="sidebar__content">
            {form &&
              form?.map((item, index) => (
                <div className="content__" key={index}>
                  <div className="circle">{index + 1}</div>
                  <div className="more__links">
                    <div>
                      <img src="/link.png" alt="" />
                    </div>
                    <input
                      type="text"
                      className="more__link"
                      name="link"
                      value={item.link}
                      placeholder="Enter the link here"
                      onChange={(e) => {
                        handleChange(e, index);
                      }}
                    />
                  </div>
                  {index > -1 ? (
                    <div className="cancel" onClick={() => removeFields(index)}>
                      <i className="fa-solid fa-minus"></i>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ))}
          </div>

          <div className="sidebar__bottom">
            <div className="sidebar__save">
              <div className="cancel__now" onClick={() => setShow(false)}>
                Cancel Now!
              </div>

              {update && (
                <div className="update__now" onClick={updateUrl}>
                  {!loadingUpdate && <>Update Now!</>}
                  {loadingUpdate && (
                    <div className="shorten">
                      Shorten ... <div className="spinners"></div>
                    </div>
                  )}
                </div>
              )}

              {!update && (
                <>
                  <div className="save__now" onClick={SaveMultiLinks}>
                    {!loadingMulti && <>Save Now!</>}
                    {loadingMulti && (
                      <div className="shorten">
                        Shorten ... <div className="spinners"></div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="app__footer"></div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default ShortLink;
