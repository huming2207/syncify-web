import { AxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_JWT } from "./constant";

export const AxiosEncodedFormConfig: AxiosRequestConfig = {
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  }
};

export function loginWithJwt(): AxiosRequestConfig {
  const token = localStorage.getItem(LOCAL_STORAGE_JWT);
  if (token) {
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  }
  return {};
}
