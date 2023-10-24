import React, { useState, useEffect } from "react";
import Message from "../../modules/shared/Message";
import { generateShortMulti } from "../../store/shortLink/shortLinkActions";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import { LoadingUpdate } from "../../store/shortLink/shortLinkSelectors";
function ModalUrl(props: any) {
  const { loadingMulti, setNewform, form, update, updateUrl, detaillurl } =
    props;
  const dispatch: ThunkDispatch<any, void, AnyAction> = useDispatch();
  const [user] = useAuthState(auth);

  const loadingUpdate = useSelector(LoadingUpdate);
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
  useEffect(() => {}, [form]);

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
    formDelete.splice(index, 1);
    setNewform(formDelete);
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    i: number
  ) => {
    let formN = [...form];
    formN[i] = { ...formN[i], [event.target.name]: event.target.value };
    setNewform(formN);
  };
  return (
    <div className="app__sidebar">
      <div className="content__plus">
        <div className="plus__link" onClick={() => addFields()}>
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
              {index ? (
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
          <div className="cancel__now" onClick={() => props.setShow(false)}>
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
  );
}

export default ModalUrl;
