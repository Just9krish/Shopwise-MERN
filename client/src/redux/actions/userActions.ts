import { Action, Dispatch } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { IUser } from "../../Interface";
import { server } from "../../server";

interface IFrom extends IUser {
  password: string;
}

type addressFrom = {
  country: string;
  state: string;
  address1: string;
  address2: string;
  address3: string;
  zipcode: string;
  addressType: string;
};

export const loadUser = () => async (dispatch: Dispatch<Action>) => {
  try {
    dispatch({ type: "LoadUserRequest" });

    const { data } = await axios.get(`${server}/users/getuser`, {
      withCredentials: true,
    });

    dispatch({ type: "LoadUserSuccess", payload: data.user });
  } catch (error: AxiosError | any) {
    dispatch({
      type: "LoadUserFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const updateUserInfo =
  (form: IFrom) => async (dispatch: Dispatch<Action>) => {
    try {
      dispatch({ type: "UpdateUserInfoRequest" });
      const { data } = await axios.put(`${server}/users/profile`, form, {
        withCredentials: true,
      });
      dispatch({ type: "UpdateUserInfoSuccess", payload: data.user });
    } catch (error: AxiosError | any) {
      dispatch({
        type: "UpdateUserInfoFailure",
        payload: error.response?.data?.message || error.message,
      });
    }
  };

// update user address
export const updateUserAddress =
  (form: addressFrom) => async (dispatch: Dispatch<Action>) => {
    try {
      const { data } = await axios.post(`${server}/users/address`, form, {
        withCredentials: true,
      });
      dispatch({ type: "UpdateUserAddressSuccess", payload: data });
    } catch (error: AxiosError | any) {
      dispatch({
        type: "UpdateUserAddressFailure",
        payload: error.response?.data?.message || error.message,
      });
    }
  };

// Delete user address
export const deleteUserAddress =
  (id: string) => async (dispatch: Dispatch<Action>) => {
    try {
      const { data } = await axios.delete(`${server}/users/address/${id}`, {
        withCredentials: true,
      });

      dispatch({ type: "DeleteUserAddressSuccess", payload: data });
    } catch (error: AxiosError | any) {
      dispatch({
        type: "DeleteUserAddressFailure",
        payload: error.response?.data?.message || error.message,
      });
    }
  };
