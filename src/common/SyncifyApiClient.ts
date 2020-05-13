import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import qs from "qs";
import { LOCAL_STORAGE_JWT } from "./constant";

export class SyncifyApiClient {
  private encodedFormConfig: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };

  public static loginWithJwt = (): AxiosRequestConfig => {
    const token = localStorage.getItem(LOCAL_STORAGE_JWT);
    if (token) {
      return {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
    }
    return {};
  };

  public loginUser = async (username: string, password: string): Promise<AxiosResponse> => {
    const resp = await axios.post(
      "/api/auth/login",
      qs.stringify({
        username,
        password
      }),
      this.encodedFormConfig
    );

    const { token } = resp.data.data;
    console.log(token);
    localStorage.setItem(LOCAL_STORAGE_JWT, token);
    return resp;
  };

  public registerUser = async (
    username: string,
    password: string,
    email: string
  ): Promise<AxiosResponse> => {
    return axios.post(
      "/api/auth/register",
      qs.stringify({
        username,
        password,
        email
      }),
      this.encodedFormConfig
    );
  };

  public listDirectory = async (currPath: string): Promise<AxiosResponse> => {
    return axios.get("/api/path", {
      params: {
        path: currPath
      },
      ...SyncifyApiClient.loginWithJwt()
    });
  };

  public createNewDirectory = async (path: string): Promise<AxiosResponse> => {
    return axios.post(
      "/api/path",
      qs.stringify({
        path
      }),
      { headers: { ...this.encodedFormConfig.headers, ...SyncifyApiClient.loginWithJwt().headers } }
    );
  };

  public deleteDirectory = async (path: string): Promise<AxiosResponse> => {
    return axios.delete("/api/path", {
      headers: { ...this.encodedFormConfig.headers, ...SyncifyApiClient.loginWithJwt().headers },
      data: qs.stringify({
        path
      })
    });
  };

  public deleteFile = async (path: string): Promise<AxiosResponse> => {
    return axios.delete("/api/file", {
      headers: { ...this.encodedFormConfig.headers, ...SyncifyApiClient.loginWithJwt().headers },
      data: qs.stringify({
        file: path
      })
    });
  };

  public moveDirectory = async (orig: string, dest: string): Promise<AxiosResponse> => {
    return axios.put(
      "/api/path/move",
      qs.stringify({
        orig,
        dest
      }),
      {
        headers: { ...this.encodedFormConfig.headers, ...SyncifyApiClient.loginWithJwt().headers }
      }
    );
  };

  public downloadFile = async (currPath: string, type: string, name: string): Promise<void> => {
    const resp = await axios.get("/api/file", {
      params: {
        path: currPath
      },
      responseType: "blob",
      ...SyncifyApiClient.loginWithJwt()
    });

    const blob = new Blob([resp.data], { type });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = name;
    link.click();
  };
}
