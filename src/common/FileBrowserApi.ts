import axios, { AxiosResponse } from "axios";
import qs from "qs";
import { loginWithJwt, AxiosEncodedFormConfig } from "./AxiosHelper";

export async function listDirectory(currPath: string): Promise<AxiosResponse> {
  return axios.get("/api/path", {
    params: {
      path: currPath
    },
    ...loginWithJwt()
  });
}

export async function createNewDirectory(path: string): Promise<AxiosResponse> {
  return axios.post(
    "/api/path",
    qs.stringify({
      path
    }),
    { headers: { ...AxiosEncodedFormConfig.headers, ...loginWithJwt().headers } }
  );
}

export async function deleteDirectory(path: string): Promise<AxiosResponse> {
  return axios.delete("/api/path", {
    headers: { ...AxiosEncodedFormConfig.headers, ...loginWithJwt().headers },
    data: qs.stringify({
      path
    })
  });
}

export async function deleteFile(path: string): Promise<AxiosResponse> {
  return axios.delete("/api/file", {
    headers: { ...AxiosEncodedFormConfig.headers, ...loginWithJwt().headers },
    data: qs.stringify({
      file: path
    })
  });
}

export async function moveDirectory(orig: string, dest: string): Promise<AxiosResponse> {
  return axios.put(
    "/api/path/move",
    qs.stringify({
      orig,
      dest
    }),
    {
      headers: { ...AxiosEncodedFormConfig.headers, ...loginWithJwt().headers }
    }
  );
}

export async function downloadFile(currPath: string, type: string, name: string): Promise<void> {
  const resp = await axios.get("/api/file", {
    params: {
      path: currPath
    },
    responseType: "blob",
    ...loginWithJwt()
  });

  const blob = new Blob([resp.data], { type });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = name;
  link.click();
}
