import axios from "axios";

const token = sessionStorage.getItem("wsstfaarvav");
const api_key = process.env.REACT_APP_API_KEY;

export const instance = axios.create({
  headers: {
    "Content-Type": "application/json",
    "x-auth-token": token,
    "x-api-key": api_key,
  },
});

export const imageInstance = axios.create({
  headers: {
    "Content-Type": "multipart/form-data",
    "x-auth-token": token,
    "x-api-key": api_key,
  },
});
