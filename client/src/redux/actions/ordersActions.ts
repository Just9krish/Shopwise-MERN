import { Dispatch } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { server } from "../../server";

export const getAllOrdersOfSeller =
  (shopid: string) => async (dispatch: Dispatch) => {
    try {
      dispatch({ type: "getShopOrders" });

      const { data } = await axios.get(`${server}/shops/${shopid}/orders`, {
        withCredentials: true,
      });

      dispatch({ type: "getShopOrdersSuccess", payload: data.orders });
    } catch (error: AxiosError | any) {
      dispatch({
        type: "getShopOrdersFailure",
        payload: error.response?.data?.message || error.message,
      });
    }
  };
