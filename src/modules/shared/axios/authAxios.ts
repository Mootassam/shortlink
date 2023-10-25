import Axios from "axios";

const authAxios = Axios.create({
  baseURL: "https://api.tinyurl.com",
});
authAxios.interceptors.request.use(
  async function (options) {
    const token =
      "Jm0FUupFHrdPTjr677duNq7vjai0KpK93es3nAM4xPPjZ9g04IlihEB76JMS";

    if (token) {
      options.headers["Authorization"] = `Bearer ${token}`;
    }

    return options;
  },
  function (error) {
    console.log("Request error: ", error);
    return Promise.reject(error);
  }
);

export default authAxios;
