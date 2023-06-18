import style from "../styles/style";
import loadable from "@loadable/component";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
const ProductFilter = loadable(
  () => import("../components/FilterSection/ProductFilter")
);
const Product = loadable(() => import("../components/Product/Product"));

export default function ProductsPage() {
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
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 gap-8 max-w-xs mx-auto md:grid-cols-3 md:max-w-5xl md:gap-y-11">
                  {filteredProducts?.map((product, idx) => (
                    <Product key={idx} product={product} />
                  ))}
                </div>
              ) : (
                <div className="h-full">
                  <p className="text-2xl mt-14 text-center">
                    No product with this filter.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
