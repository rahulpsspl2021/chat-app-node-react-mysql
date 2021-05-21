import axios from "axios";
import config from "../Config";

const API_URL = config.apiUrl;


const chatInit = (data) => {
  return axios
    .post(API_URL + "chatInit", data)
    .then((response) => {
      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
}

const logout = () => {
  localStorage.removeItem("user");
};

const authServices = {
  logout,
  chatInit,
};

export default authServices