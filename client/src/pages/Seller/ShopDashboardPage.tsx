import loadable from "@loadable/component";
const ShopDashboardHero = loadable(
  () => import("../../components/shop/Dashboard/ShopDashboardHero")
);
const ShopHeader = loadable(
  () => import("../../components/shop/ShopLayout/ShopHeader")
);
const ShopSidebar = loadable(
  () => import("../../components/shop/ShopLayout/ShopSidebar")
);

export default function ShopDashboardPage() {
  return (
    <>
      <ShopHeader />
      <section>
        <div className="flex gap-2 md:gap-5 mt-3">
          <ShopSidebar activeTab={1} />
          <div className="w-full overflow-x-scroll flex-grow h-[87vh] flex p-8">
            <ShopDashboardHero />
          </div>
        </div>
      </section>
    </>
  );
}
