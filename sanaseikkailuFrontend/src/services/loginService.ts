import axios from "axios";
import { baseUrl } from "../constants";
import { LoggedPlayerUser, LoginData } from "../../types";

export const userLogin = (user: LoginData): Promise<LoggedPlayerUser> => {
  const request = axios
    .post(`${baseUrl}/login`, user)
    .then(response => {
      const data: LoggedPlayerUser = response.data;
      return data;
    })
    .catch(err => {
      throw new Error(err);
    });
  return request;
};
