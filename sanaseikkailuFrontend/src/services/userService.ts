import axios from "axios";
import { apiUrl } from "../constants";
import { LoggedPlayerUser, SecurePlayerUser } from "../../types";

export const updateUserPoints = (
  user: LoggedPlayerUser
): Promise<SecurePlayerUser> => {
  const request = axios
    .put(`${apiUrl}/users`, user)
    .then(response => {
      const data: SecurePlayerUser = response.data;
      return data;
    })
    .catch(err => {
      throw new Error(err);
    });
  return request;
};
