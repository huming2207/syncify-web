import { AxiosRequestConfig } from "axios";

export const AxiosEncodedFormConfig: AxiosRequestConfig = {
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  }
};

export default AxiosEncodedFormConfig;
