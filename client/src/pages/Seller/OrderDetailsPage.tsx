import style from "../../styles/style";
import loadable from "@loadable/component";
const OrderDetails = loadable(
  () => import("../../components/shop/Dashboard/OrderDetails")
);
const ShopHeader = loadable(
  () => import("../../components/shop/ShopLayout/ShopHeader")
);

export default function OrderDetailsPage() {
  return (
    <>
      <ShopHeader />
      <section className={`min-h-screen ${style.section}`}>
        <OrderDetails />
      </section>
    </>
  );
}
