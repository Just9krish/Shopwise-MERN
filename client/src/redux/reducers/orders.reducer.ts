import { createReducer } from "@reduxjs/toolkit";
import { IOrder, IShopOrder } from "../../Interface/index";

type State = {
  isLoading: boolean;
  shopOrders: IShopOrder[];
  error: string | null;
};

const initialState: State = {
  isLoading: true,
  shopOrders: [],
  error: null,
};

export const orderReducer = createReducer(initialState, {
  getShopOrders: (state) => {
    state.isLoading = true;
  },

  getShopOrdersSuccess: (state, action) => {
    state.isLoading = false;
    state.shopOrders = action.payload;
  },

  getShopOrdersFailure: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  clearError: (state) => {
    state.error = null;
  },
});
