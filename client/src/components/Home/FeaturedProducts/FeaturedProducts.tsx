import style from "../../../styles/style";
import loadable from "@loadable/component";
import productData from "../../../constant/product.json";
const Product = loadable(() => import("../../Product/Product"));
import { useAppSelector } from "../../../hooks";

export default function FeaturedProducts() {
  const { allProducts } = useAppSelector((state) => state.allProducts);

  return (
    <section>
      <div className={`${style.section}`}>
        <h1 className={`${style.heading}`}>Featured Products</h1>
        {productData && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 mt-8">
            {allProducts?.map((product, idx) => (
              <Product key={idx} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
