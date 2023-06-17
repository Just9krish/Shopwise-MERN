import { AxiosError } from "axios";
import { ChangeEvent, ReactNode } from "react";

export interface IProduct {
  _id: string;
  category?: string;
  name: string;
  description: string;
  price: number;
  discount_percentage: number;
  discount_price: number;
  tags?: string;
  images: {
    id: number;
    url: string;
    name: string;
    type: string;
    size: number;
  }[];
  shop: ISeller;
  reviews?: { user: {}; comment: string; rating: number }[];
  rating: number;
  sold_out: number;
  stock: number;
  created_at: Date;
  updated_at: Date;
}

export interface IAddProduct {
  name: string;
  description: string;
  category: string;
  tags?: string;
  price: number;
  discount_percentage?: number;
  discount_price?: number;
  stock: number;
  images: File[];
}

export interface ICategory {
  id: number;
  subTitle: string;
  title: string;
  image_Url: string;
}

export interface IPasswordInputProps {
  placeholder: string;
  value: string;
  name: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export interface ICustomResponse {
  success: boolean;
  message: string;
}

export interface IComponentProp {
  children: ReactNode;
}

export interface IStarsProps {
  stars: number;
}

export interface ICoupon {
  _id: string;
  name: string;
  value: number;
  minAmount: number;
  selectedProduct: IProduct | null;
  shop: ISeller;
}

export interface IEvent {
  _id: string;
  name: string;
  description: string;
  category: string;
  startDate: Date;
  endDate: Date;
  status: string;
  tags: string;
  price: number;
  discount_percentage: number;
  discount_price: number;
  stock: number;
  images: File[];
  shop: ISeller;
  sold_out: number;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  addresses: IAddress[];
  primaryPhoneNumber: string;
  secondaryPhoneNumber: string;
}

export interface IAddress {
  country: string;
  state: string;
  address1: string;
  address2: string;
  address3: string;
  zipcode: number;
  addressType: string;
  _id: string;
}

export interface ISeller {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  phoneNumber: number;
  address: string;
  zipcode: number;
  createdAt: string;
}

export interface IUserState {
  isUserAuthenticate: boolean;
  isUserLoading: boolean;
  userError: null | string;
  user: IUser;
  message: string;
}

export interface ISellerState {
  isSellerAuthenticate: boolean;
  isSellerLoading: boolean;
  sellerError?: null | string;
  seller: ISeller;
}

export interface IAddProductState {
  isProductLoading: boolean;
  product: IAddProduct;
  error?: null | string;
  isSuccess: boolean;
}

export interface IServerProductsState {
  isProductsLoading: boolean;
  products: IProduct[];
  error: null | AxiosError;
  isSuccess: boolean;
  message: string;
}

export interface IEventsState {
  isEventsLoading: boolean;
  events: IEvent[];
  shopEvents: IEvent[];
  error: null | AxiosError;
  isSuccess: boolean;
  message: string;
}

export interface IAllProductState {
  isAllProductsLoading: boolean;
  allProducts: IProduct[];
  error: null;
  message: string;
}

export interface ICartItem extends IProduct {
  quantity: number;
}

export interface ICartSate {
  cart: ICartItem[];
  isCartOpen: boolean;
  cartPrice: number;
  totalSaving: number;
  couponID: string;
}

export interface IWishlistState {
  wishlists: IProduct[];
}

export interface IAppState {
  user: IUserState;
  seller: ISellerState;
  products: IServerProductsState;
  events: IEventsState;
  allProducts: IAllProductState;
  cart: ICartSate;
  wishlists: IWishlistState;
}

export interface IQuestion {
  question: string;
  answer: string;
}

export interface IAddProduct {
  productName: string;
  productDescription: string;
  productImages: any[];
  productCategory: string;
  productTags: string;
  productPrice: number;
  productDiscountPrice: number;
  productDiscountPercentage: number;
  productStock: number;
}

export interface IPaymentInfo {
  id: string;
  status: string;
  paymentMethod: string;
}

export interface IShippingAddress extends IAddress {
  primaryNumber: number;
  alternateNumber: number;
  fullname: string;
}

export interface IOrder {
  shippingAddress: IShippingAddress;
  paymentInfo: IPaymentInfo;
  _id: string;
  cart: {
    product: string;
    quantity: number;
    _id: string;
  }[];
  user: string;
  totalPrice: number;
  orderStatus: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface IShopOrder {
  shippingAddress: IShippingAddress;
  paymentInfo: IPaymentInfo;
  _id: string;
  cart: {
    product: IProduct;
    quantity: number;
    _id: string;
  }[];
  user: string;
  totalPrice: number;
  orderStatus: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
