import loadable from "@loadable/component";
import style from "../styles/style";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { IProduct } from "../Interface";
import { Link } from "react-router-dom";
import { useAppSelector } from "../hooks";
import { host, server } from "../server";
import axios from "axios";

const ProductDetails = loadable(
  () => import("../components/ProductDetails/ProductDetails")
);
const Loader = loadable(() => import("../components/Loader/Loader"));
const RelatedProducts = loadable(
  () => import("../components/ProductDetails/RelatedProducts/RelatedProducts")
);

export default function ProductPage() {
  const { product_id } = useParams();
  const [product, setProduct] = useState<IProduct | null>(null);
  const { allProducts } = useAppSelector((state) => state.allProducts);

  useEffect(() => {
    if (product_id) {
      const product = allProducts?.find(
        (product) => product._id === product_id
      );
      if (product !== undefined) {
        setProduct(product);
      }
    }
  }, [product_id, allProducts]);

  return (
    <>
      {product ? (
        <section>
          <div className={`${style.section}`}>
            <ProductDetails product={product} />
            <ProductDetailsInfo product={product} />
            {product && <RelatedProducts product={product} />}
          </div>
        </section>
      ) : (
        <section className="min-h-screen flex justify-center items-center">
          <Loader />
        </section>
      )}
    </>
  );
}

const ProductDetailsInfo = ({ product }: { product: IProduct }) => {
  const [activeTab, setActiveTab] = useState("productDetails");
  const [shopProducts, setShopProducts] = useState(0);
  const { images, name, description, shop } = product;

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  useEffect(() => {
    axios
      .get(`${server}/shops/${shop._id}/products`)
      .then((res) => setShopProducts(res.data.products.length));
  }, []);

  return (
    <div className="bg-white lg:px-10 rounded my-16 px-3 py-6">
      <div className="w-full flex justify-between border-b py-4">
        <h4
          className={`text-base font-medium lg:font-semibold cursor-pointer lg:text-xl relative py-1.5 after:bg-red-400 after:absolute after:left-0 after:bottom-0 after:h-1 ${
            activeTab === "productDetails" ? "after:w-full" : "after:w-0"
          }`}
          onClick={() => handleTabClick("productDetails")}
        >
          Products Details
        </h4>
        <h4
          className={`text-base font-medium lg:font-semibold cursor-pointer lg:text-xl relative py-1.5 after:bg-red-400 after:absolute after:left-0 after:bottom-0 after:h-1 ${
            activeTab === "reviews" ? "after:w-full" : "after:w-0"
          }`}
          onClick={() => handleTabClick("reviews")}
        >
          Products Reviews
        </h4>
        <h4
          className={`text-base font-medium lg:font-semibold cursor-pointer lg:text-xl relative py-1.5 after:bg-red-400 after:absolute after:left-0 after:bottom-0 after:h-1 ${
            activeTab === "seller" ? "after:w-full" : "after:w-0"
          }`}
          onClick={() => handleTabClick("seller")}
        >
          Seller Information
        </h4>
      </div>
      {activeTab === "productDetails" && (
        <div className="space-y-6 lg:space-y-10 px-4 lg:px-8 py-5">
          <p className="text-base lg:text-lg whitespace-pre-line">
            {description.slice(0, 500)}
          </p>
          <p className="text-base lg:text-lg whitespace-pre-line">
            {description.slice(501, 1000)}
          </p>
          <p className="text-base lg:text-lg whitespace-pre-line">
            {description.slice(1001, 1500)}
          </p>
        </div>
      )}
      {activeTab === "reviews" && (
        <div className="flex justify-center items-center h-[40vh]">
          <p>No review yet</p>
        </div>
      )}
      {activeTab === "seller" && (
        <div className="w-full p-5 lg:flex">
          <div className="w-full lg:w-1/2 space-y-3">
            <div className={`${style.flex_normal} gap-3`}>
              <img
                className="h-12 w-12 rounded-full"
                src={`${host}/${shop.avatar}`}
              />
              <div>
                <h4 className={`${style.shop_name} text-xl`}>{shop.name}</h4>
                {/* <h4>{shop.ratings} Ratings</h4> */}
              </div>
            </div>
            <p>{shop.address}</p>
          </div>
          <div className="w-full lg:w-1/2 lg:flex flex-col items-end">
            <div className="text-left space-y-2">
              <h4 className="font-medium">
                Joined on :
                <span>{new Date(shop.createdAt).toLocaleDateString()}</span>
              </h4>
              <h4 className="font-medium">
                Total Products : <span>{shopProducts}</span>
              </h4>
              <h4 className="font-medium">
                Total Reviews : <span>23</span>
              </h4>
              <Link className="inline-block" to="/shop">
                <button className={` ${style.button} text-white `}>
                  Visit Shop
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
