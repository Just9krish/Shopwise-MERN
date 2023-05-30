import loadable from "@loadable/component";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { getShopAllProducts } from "../../../redux/actions/productActions";
const Product = loadable(() => import("../../Product/Product"));

export default function ShopProducts() {
  const { products } = useAppSelector((state) => state.products);
  const { seller } = useAppSelector((state) => state.seller);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getShopAllProducts(seller._id));
  }, []);

  return products.length > 0 ? (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-y-10 md:gap-x-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-4 xl:gap-y-10">
      {products?.map((product, idx) => (
        <Product product={product} key={idx} />
      ))}
    </div>
  ) : (
    <div className="h-full w-full">
      <p className="text-center text-gray-900">No products available.</p>
    </div>
  );
}
