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
  generateShortLink,
  generateShortMulti,
  showDetail,
  showLinks,
  updateUrl,
} from "../../store/shortLink/shortLinkActions";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import {
  fetchLoading,
  hasRows,
  listLinks,
  loginLoading,
  multiLoading,
  sepecifDetail,
  shortLoading,
} from "../../store/shortLink/shortLinkSelectors";
import LinkTable from "../TableView/LinkTable";
import { Toaster } from "react-hot-toast";
import { onAuthStateChanged } from "@firebase/auth";
import Message from "../../modules/shared/Message";
import ModalUrl from "../Sidebar/ModalUrl";

function ShortLink() {
  const [user] = useAuthState(auth);
  const dispatch: ThunkDispatch<any, void, AnyAction> = useDispatch();
  const [url, setUrl] = useState<string>();
  const [show, setShow] = useState(false);
  const loadingLinks = useSelector(fetchLoading);
  const allLinks = useSelector(listLinks);
  const coutRows = useSelector(hasRows);
  const shortLoadign = useSelector(shortLoading);
  const loadingMulti = useSelector(multiLoading);
  const LoadingLogin = useSelector(loginLoading);
  const detaillurl = useSelector(sepecifDetail);
  const [form, setNewform] = useState<{ link: string }[]>([
    {
      link: "",
    },
  ]);

  const editUlr = (item: any) => {
    if (item) {
      dispatch(showDetail(item));
      setNewform(detaillurl.links);

      // dispatch(updateUrl({ item, form, user }));
      setShow(true);
    }
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

  const showLink = () => {
    setShow(true);
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

  const generateShortUrl = async () => {
    try {
      if (!user) {
        Message.Error("Please Login ");
      }
      const trimmedUrl = validateAndTrimURL(url);
      // Assuming `dispatch` and `generateShortLink` are defined elsewhere
      await dispatch(generateShortLink({ url: trimmedUrl, user }));
    } catch (error) {
      Message.Error(
        "Please Verify your data its look like this format https//example.com "
      );
    }
  };

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
                placeholder="Enter the link here"
              />
            </div>
            <div className="short__now" onClick={() => generateShortUrl()}>
              {!shortLoadign && <>Shorten Now!</>}

              {shortLoadign && (
                <div className="shorten">
                  Shorten ... <div className="spinners"></div>{" "}
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
        allLinks={allLinks}
        loading={loadingLinks}
        hasRows={coutRows}
        editUlr={editUlr}
        user={user}
      />

      {show && (
        <ModalUrl
          loadingMulti={loadingMulti}
          setShow={setShow}
          setNewform={setNewform}
          form={form}
        />
      )}

      <div className="app__footer"></div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default ShortLink;
