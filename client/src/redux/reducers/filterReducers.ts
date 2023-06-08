import { createReducer } from "@reduxjs/toolkit";
import { IProduct } from "../../Interface";

interface IFilterState {
  filterText: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  price: number;
}

interface IProductsState {
  filteredProducts: IProduct[];
  allProducts: IProduct[];
  sort_value: string;
  filters: IFilterState;
}

const inititalState: IProductsState = {
  filteredProducts: [],
  allProducts: [],
  sort_value: "relevance",
  filters: {
    filterText: "",
    category: "all",
    price: 0,
    maxPrice: 0,
    minPrice: 0,
  },
};

const applyFilters = (products: IProduct[], filters: IFilterState) => {
  const { filterText, category, price } = filters;

  let filteredProducts = products;

  if (filterText) {
    filteredProducts = filteredProducts.filter((product) => {
      return product.name.toLowerCase().includes(filterText.toLowerCase());
    });
  }

  if (category !== "all") {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === category
    );
  }

  if (price !== null) {
    filteredProducts = filteredProducts.filter(
      (product) => product.discount_price <= price
    );
  }

  return filteredProducts;
};

export const filterReducer = createReducer(inititalState, {
  loadFilteredProducts: (state, action) => {
    const prices = action.payload.map(
      (product: IProduct) => product.discount_price
    );

    const maxPrice = Math.max(...prices);

    state.allProducts = [...action.payload];
    state.filteredProducts = [...action.payload];
    state.filters = {
      ...state.filters,
      maxPrice: maxPrice,
      price: maxPrice,
    };
  },

  updateFilterText: (state, action) => {
    const { name, value } = action.payload;

    return {
      ...state,
      filters: {
        ...state.filters,
        [name]: value,
      },
    };
  },

  getSortValue: (state, action) => {
    state.sort_value = action.payload;
  },

  sortProducts: (state) => {
    const { filteredProducts } = state;
    const products = [...filteredProducts];

    const sortFunctions: Record<string, (a: IProduct, b: IProduct) => number> =
      {
        relevance: (a, b) => b.rating - a.rating,
        ltoh: (a, b) => a.discount_price - b.discount_price,
        htol: (a, b) => b.discount_price - a.discount_price,
      };

    const sort_value = state.sort_value;
    const sortFunction = sortFunctions[sort_value] || (() => {});
    const sortedProducts = sort_value ? products.sort(sortFunction) : products;

    state.filteredProducts = sortedProducts;
  },

  filterProducts: (state, action) => {
    const filteredProducts = applyFilters(
      [...state.allProducts],
      state.filters
    );

    return {
      ...state,
      filteredProducts: filteredProducts,
    };
  },

  clearFilters: (state, action) => {
    const { maxPrice } = state.filters;

    state.filters = {
      ...state.filters,
      filterText: "",
      category: "all",
      price: maxPrice,
    };
  },
});
