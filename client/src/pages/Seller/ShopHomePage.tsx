import ShopInfo from "../../components/shop/ShopInfo";
import style from "../../styles/style";
import ShopProfileData from "./ShopProfileData";

export default function ShopHomePage() {
  console.log("ddfd");
  return (
    <section>
      <div className={`${style.section}`}>
        <div
          className={`${style.flex_normal} justify-between !items-start gap-2`}
        >
          <aside className="w-1/4 bg-white rounded shadow overflow-scroll h-[90vh] sticky top-0 left-0 z-10">
            <ShopInfo isOwner={true} />
          </aside>
          <div className="w-[73%] bg-white rounded shadow overflow-scroll h-[90vh] sticky top-0 left-0 z-10">
            <ShopProfileData isOwner={true} />
          </div>
        </div>
      </div>
    </section>
  );
}
