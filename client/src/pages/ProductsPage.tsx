import loadable from "@loadable/component";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import style from "../styles/style";
import { IProduct } from "../Interface";
import { useAppDispatch, useAppSelector } from "../hooks";
import ProductFilter from "../components/FilterSection/ProductFilter";
const Product = loadable(() => import("../components/Product/Product"));

export default function ProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const { allProducts } = useAppSelector((state) => state.allProducts);
  const dispatch = useAppDispatch();
  const { filteredProducts, filters, sort_value } = useAppSelector(
    (state) => state.filteredProducts
  );

  const [searchParams] = useSearchParams();
  const categoryData = searchParams.get("category");

  // useEffect(() => {
  //   if (categoryData === null) {
  //     const sorted = [...allProducts]?.sort((a, b) => a.sold_out - b.sold_out);
  //     setProducts(sorted);
  //   } else {
  //     const sorted = allProducts?.filter(
  //       (product) => product.category == categoryData
  //     );
  //     setProducts(sorted);
  //   }
  //   window.scrollTo(0, 0);
  // }, [categoryData]);

  useEffect(() => {
    dispatch({ type: "loadFilteredProducts", payload: allProducts });
  }, [allProducts]);

  useEffect(() => {
    dispatch({ type: "filterProducts" });
    dispatch({ type: "sortProducts" });
  }, [filters, sort_value]);

  return (
    <section className="min-h-screen flex">
      <div className={`${style.section}`}>
        {allProducts.length === 0 ? (
          <h1 className="text-2xl text-center">
            Sorry, No Product for the {categoryData} category right now.
          </h1>
        ) : (
          <div className="lg:grid lg:grid-cols-4 gap-8 lg:min-h-screen">
            <ProductFilter />
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 gap-8 max-w-xs mx-auto md:grid-cols-3 md:max-w-5xl md:gap-y-11">
                {filteredProducts?.map((product, idx) => (
                  <Product key={idx} product={product} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
