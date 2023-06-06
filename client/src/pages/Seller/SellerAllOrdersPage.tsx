import loadable from "@loadable/component";
const ShopHeader = loadable(
  () => import("../../components/shop/ShopLayout/ShopHeader")
);
const ShopSidebar = loadable(
  () => import("../../components/shop/ShopLayout/ShopSidebar")
);
const ShopOrders = loadable(
  () => import("../../components/shop/Dashboard/ShopOrders")
);

export default function SellerAllOrdersPage() {
  return (
    <>
      <ShopHeader />
      <section>
        <div className="flex gap-2 md:gap-5 mt-3">
          <ShopSidebar activeTab={2} />
          <div className="w-full flex-grow flex overflow-x-scroll rounded bg-white shadow h-[87vh]">
            <ShopOrders />
          </div>
        </div>
      </section>
    </>
  );
}
