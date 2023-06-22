import { AiOutlineMoneyCollect } from "react-icons/ai";
import { MdBorderClear } from "react-icons/md";
import { Link } from "react-router-dom";
import { formattedPrice } from "../../../helper/formatPrice";
import { useAppSelector } from "../../../hooks";
import style from "../../../styles/style";

export default function ShopDashboardHero() {
  const { shopOrders } = useAppSelector((state) => state.orders);
  const { products } = useAppSelector((state) => state.products);

  return (
    <div className="p-8 w-full space-y-12">
      <div className="space-y-4">
        <h4 className="text-2xl font-semibold font-Poppins">Overview</h4>

        <div className="w-full flex flex-col md:flex-row gap-4 md:gap-8 items-center justify-between">
          <div className="w-full bg-white shadow rounded px-2 py-3 flex gap-4">
            <div className="my-auto">
              <AiOutlineMoneyCollect
                size={60}
                fill="#00BFA5"
                className="mr-2"
              />
            </div>
            <div className="space-y-3">
              <div>
                <h4 className={`${style.productTitle} leading-5 !text-lg !m-0`}>
                  Account Balance
                </h4>
                <span className="text-sm !font-thin">
                  (with 10% service charge)
                </span>
              </div>
              <div>
                <p className="text-2xl font-medium">
                  {formattedPrice(23423032.234)}
                </p>
                <Link to="/dashboard" className="text-[#077f9c]">
                  Withdraw Money
                </Link>
              </div>
            </div>
          </div>

          <div className="w-full bg-white shadow rounded px-2 py-3 flex gap-4">
            <div className="my-auto">
              <MdBorderClear size={60} fill="#00BFA5" className="mr-2" />
            </div>
            <div className="space-y-3">
              <div>
                <h4 className={`${style.productTitle} leading-5 !text-lg !m-0`}>
                  All Orders
                </h4>
              </div>
              <div>
                <p className="text-2xl font-medium">{shopOrders.length}</p>
                <Link to="/shop-orders" className="text-[#077f9c]">
                  View Orders
                </Link>
              </div>
            </div>
          </div>

          <div className="w-full bg-white shadow rounded px-2 py-3 flex gap-4">
            <div className="my-auto">
              <AiOutlineMoneyCollect
                size={60}
                fill="#00BFA5"
                className="mr-2"
              />
            </div>
            <div className="space-y-3">
              <div>
                <h4 className={`${style.productTitle} leading-5 !text-lg !m-0`}>
                  All Products
                </h4>
              </div>
              <div>
                <p className="text-2xl font-medium">{products.length}</p>
                <Link to="/shop-products" className="text-[#077f9c]">
                  View Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-2xl font-semibold font-Poppins">Latest Orders</h4>

        <div className="w-full bg-white shadow px-2 py-5 rounded"></div>
      </div>
    </div>
  );
}
