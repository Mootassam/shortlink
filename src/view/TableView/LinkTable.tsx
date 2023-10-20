import{ useState } from "react";
import QRCode from "react-qr-code";
import Date from "../../modules/shared/date";

function LinkTable(props) {
  const { allLinks, loading, hasRows } = props;
  const [copySuccess, setCopySuccess] = useState(false);
  const [selected, setSelectedItem] = useState<any>();

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
  return (
    <div className="app__table">
      <table>
        <thead>
          <tr className="tr__">
            <td>Short Link</td>
            <td>Original Link</td>
            <td>QR Code</td>
            <td>Clicks</td>
            <td>Status</td>
            <td className="date__">
              Date
              <img src="/date.png" alt="" />
            </td>
          </tr>
        </thead>
        {!loading && allLinks && hasRows > 0 && (
          <tbody>
            {allLinks?.map((item: any, i: number) => (
              <tr key={i}>
                <td className="td__detail">
                  {item.shortlink}
                  <div
                    className={`copy ${
                      copySuccess && selected === i ? "copied" : ""
                    }`}
                    onClick={() => handleCopy(item.shortlink, i)}
                  >
                    <img src="/copy.png" alt="" />
                  </div>
                </td>
                <td className="original__link">{item.originallink}</td>
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
                      <img src="/link1.png" alt="" />
                    </a>
                  </div>
                </td>
                <td>{Date.format(item.date)}</td>
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
