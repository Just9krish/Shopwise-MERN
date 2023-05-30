import loadable from "@loadable/component";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../hooks";
import { IProduct } from "../../../Interface";
import style from "../../../styles/style";
const Product = loadable(() => import("../../Product/Product"));

interface IProps {
  product: IProduct;
}

export default function RelatedProducts({ product }: IProps) {
  const { category } = product;

  const { allProducts } = useAppSelector((state) => state.allProducts);

  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    const filteredProducts = allProducts?.filter(
      (product) => product.category === category
    );

    setRelatedProducts(filteredProducts);
  }, []);
  return (
    <>
      {relatedProducts.length !== 0 ? (
        <div className="p-4">
          <h1 className={`${style.heading} border-b`}>Related Products</h1>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 mt-8">
            {relatedProducts?.map((product, idx) => (
              <Product product={product} key={idx} />
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}
