import { useState } from "react";
import QRCode from "react-qr-code";
import Date from "../../modules/shared/date";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import { deleteshortUrl } from "../../store/shortLink/shortLinkActions";
import {
  deleteUrlLoading,
  editLoading,
} from "../../store/shortLink/shortLinkSelectors";

function LinkTable({ allLinks, loading, hasRows, editUlr }) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [selected, setSelectedItem] = useState<any>();
  const deleteLoadings = useSelector(deleteUrlLoading);
  const loadingedit = useSelector(editLoading);
  const [user] = useAuthState(auth);
  const [currentIndex, setCurrentIndex] = useState<number>();

  const [deleteIndex, setDeleteIndex] = useState();
  const dispatch: ThunkDispatch<any, void, AnyAction> = useDispatch();
  const handleCopy = (value: any, index: number) => {
    const el = document.createElement("textarea");
    el.value = value;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setCopySuccess(true);
    setSelectedItem(index);

    setTimeout(() => {
      setCopySuccess(false);
    }, 2000);
  };

  const deleteUrl = (id: number, user: any, idmulti: any, i) => {
    dispatch(deleteshortUrl({ id, user, idmulti }));
    setDeleteIndex(i);
  };
  const edit = (id: any, index: number) => {
    editUlr(id);
    setCurrentIndex(index);
  };
  return (
    <div className="app__table">
      <table>
        <thead>
          <tr className="tr__">
            <td>Short Link</td>
            {/* <td>Original Link</td> */}
            <td>QR Code</td>
            <td>Clicks</td>
            <td>Status</td>
            <td className="date__">
              Date
              <img src="/date.png" alt="date__" />
            </td>
            <td>Action</td>
          </tr>
        </thead>
        {!loading && allLinks && hasRows > 0 && (
          <tbody>
            {allLinks?.map((item: any, i: number) => (
              <tr key={i}>
                <td>
                  <div className="td__detail">
                    <div className="shortlinks">{item.shortlink}</div>
                    <div
                      className={`copy ${
                        copySuccess && selected === i ? "copied" : ""
                      }`}
                      onClick={() => handleCopy(item.shortlink, i)}
                    >
                      <img src="/copy.png" alt="" />
                    </div>
                  </div>
                </td>
                {/* <td className="original__link">{item.originallink}</td> */}
                <td>
                  <div
                    style={{
                      height: "auto",
                      maxWidth: 40,
                      width: "100%",
                    }}
                  >
                    <QRCode
                      size={256}
                      style={{
                        height: "auto",
                        maxWidth: "100%",
                        width: "100%",
                      }}
                      value={item.shortlink}
                      viewBox={`0 0 256 256`}
                      bgColor="#73767c"
                    />
                  </div>
                </td>
                <td>1313</td>
                <td className="status">
                  <span className="active">{item.status}</span>
                  <div className="link__active">
                    <a href={item.shortlink} target="__blank">
                      <img src="/link1.png" alt="link__active" />
                    </a>
                  </div>
                </td>
                <td>{Date.format(item.date)}</td>
                <td className="actions__">
                  <div className="edit" onClick={() => edit(item.multiId, i)}>
                    {loadingedit && currentIndex === i ? (
                      <div className="spinnerdelete"></div>
                    ) : (
                      <img
                        src="/edit.png"
                        alt="edit__"
                        width={16}
                        height={16}
                      />
                    )}
                  </div>
                  <div
                    className="delete"
                    onClick={() => deleteUrl(item.id, user, item.multiId, i)}
                  >
                    {deleteLoadings === true && deleteIndex == i ? (
                      <div className="spinnerdelete"></div>
                    ) : (
                      <img
                        src="/delete.png"
                        alt="delete__"
                        width={16}
                        height={16}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {/* <tr>
              <td className="td__detail">
                https://linkly.com/Bn41aCOlnxj
                <div className="copy">
                  <img src="/copy.png" alt="" />
                </div>
              </td>
              <td>https://www.twitter.com/tweets/8erelCoihu/</td>
              <td>
                <img src="/qrcode.png" alt="" />
              </td>
              <td>1313</td>
              <td className="status">
                <span className="inactive">Inavtive</span>
                <div className="link__active">
                  <img src="/unlink.png" alt="" />
                </div>
              </td>
              <td>Oct - 10 -2023</td>
            </tr> */}
          </tbody>
        )}
      </table>

      {loading && (
        <div className="Loadingdisplay">
          <div className="spinner"></div>
          Loading ...
        </div>
      )}

      {loading === false && hasRows === 0 && (
        <div className="nodatadisplay">
          <tr>No Data Found</tr>
        </div>
      )}
    </div>
  );
}

export default LinkTable;
