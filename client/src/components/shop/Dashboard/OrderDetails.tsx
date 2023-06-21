import loadable from "@loadable/component";
import { useEffect, useState } from "react";
import { BsBagFill } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import { formattedPrice } from "../../../helper/formatPrice";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { IShopOrder } from "../../../Interface";
import { getAllOrdersOfSeller } from "../../../redux/actions/ordersActions";
import { host, server } from "../../../server";
import { Country, State } from "country-state-city";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
const Loader = loadable(() => import("../../Loader/Loader"));

export default function OrderDetails() {
  const dispatch = useAppDispatch();
  const { seller } = useAppSelector((state) => state.seller);
  const { shopOrders, isLoading } = useAppSelector((state) => state.orders);
  const { orderId } = useParams();
  const [selectedOrder, setSelectedOrder] = useState<IShopOrder | null>(null);
  const [orderStatus, setOrderStatus] = useState("");

  const orderStatusList = ["Shipped", "Delivered", "Cancelled", "Processing"];
  const refundStatusList = ["Processing refund", "Refund Success"];

  const getCountryName = (isoCode: string) => {
    const country = Country.getAllCountries().find(
      (country) => country.isoCode === isoCode
    );
    return country ? country.name : "";
  };

  const getStateName = (isoCode: string, countryIsoCode: string) => {
    const country = State.getStatesOfCountry(countryIsoCode).find(
      (country) => country.isoCode === isoCode
    );
    return country ? country.name : "";
  };

  async function orderUpdateHandler() {
    try {
      const res = await axios.put(
        `${server}`,
        { orderStatus },
        { withCredentials: true }
      );

      if (res.status == 200) {
        toast.success("Order status updated successfully");
      }
    } catch (e: AxiosError | any) {
      if (e.response) {
        toast.error(e.response.data.message);
      }
      toast.error(e.message);
    }
  }

  useEffect(() => {
    dispatch(getAllOrdersOfSeller(seller._id));
  }, [dispatch, seller._id]);

  useEffect(() => {
    const order = shopOrders.find((order) => order._id === orderId);
    setSelectedOrder(order || null);

    setOrderStatus(order?.orderStatus || "");
  }, [orderId, shopOrders]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <BsBagFill className="text-orange-500" size="30" />
              <h1 className="text-2xl font-bold">Order Details</h1>
            </div>
            <a href="/shop-orders">
              <button className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded">
                Order List
              </button>
            </a>
          </div>

          <section className="shadow p-4 md:p-8 bg-white rounded-md">
            <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-7">
              <article className="mb-8 md:mb-0 space-y-2">
                <div>
                  <h2 className="text-lg text-[#201f13]">Order Id:</h2>
                  <span className="text-[#4a4a4a]">{selectedOrder?._id}</span>
                </div>
                <div>
                  <h2 className="text-lg  text-[#201f13]">Placed on:</h2>
                  <span className="text-[#4a4a4a]">
                    {selectedOrder &&
                      new Date(selectedOrder.createdAt).toLocaleString()}
                  </span>
                </div>
              </article>

              <article className="md:w-2/5">
                {selectedOrder?.cart.map((item) => {
                  const { _id, product, quantity } = item;
                  const { name, price, images, category, discount_price } =
                    product;

                  return (
                    <div
                      key={_id}
                      className="flex items-center gap-4 py-4 border-b border-gray-300"
                    >
                      <Link to={`/products/${product._id}`}>
                        <img
                          src={`${host}/${images[0].url}`}
                          alt={images[0]?.name || "Product image"}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      </Link>
                      <div>
                        <Link to={`/products/${product._id}`}>
                          <h3 className="text-xl font-semibold  text-[#201f13] hover:underline hover:text-orange-500 transition-all">
                            {name}
                          </h3>
                        </Link>
                        <div className="flex items-center justify-between">
                          <span className="text-[#4a4a4a] tracking-wider">
                            {formattedPrice(discount_price)} x {quantity}
                          </span>
                          <span className="bg-orange-200 py-1 px-2 rounded text-[#201f13] text-xs md:text-sm">
                            {category}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="mt-6 flex items-center gap-2 justify-end">
                  <span className="text-lg text-[#201f13]">Total Price:</span>
                  <span className="tracking-wide">
                    <strong>
                      {selectedOrder &&
                        formattedPrice(selectedOrder.totalPrice)}
                    </strong>
                  </span>
                </div>
              </article>

              <article className="md:w-2/5">
                <div className="mt-6 md:mt-0 md:ml-6">
                  <h2 className="text-lg font-semibold text-[#201f13]">
                    Shipping Address:
                  </h2>
                  <h3 className="text-[#4a4a4a]">
                    {selectedOrder && selectedOrder.shippingAddress?.fullname}
                  </h3>
                  <h3 className="text-[#4a4a4a]">
                    {selectedOrder &&
                      `${selectedOrder.shippingAddress.address1}, ${selectedOrder.shippingAddress.address2}, ${selectedOrder.shippingAddress?.address3}`}
                  </h3>

                  <h3 className="text-[#4a4a4a]">
                    {selectedOrder &&
                      getStateName(
                        selectedOrder?.shippingAddress?.state,
                        selectedOrder?.shippingAddress?.country
                      )}
                  </h3>
                  <h3 className="text-[#4a4a4a]">
                    {selectedOrder &&
                      getCountryName(selectedOrder?.shippingAddress?.country)}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[#201f13]">Pincode:</span>
                    <span className="text-[#4a4a4a]">
                      {selectedOrder?.shippingAddress?.zipcode}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[#201f13]">Contacts Number:</span>
                    <div className="space-x-1 text-[#4a4a4a]">
                      <span>
                        {selectedOrder?.shippingAddress?.primaryNumber}
                      </span>
                      <span>/</span>
                      <span>
                        {selectedOrder?.shippingAddress?.alternateNumber}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 md:ml-6">
                  <h2 className="text-lg font-semibold text-[#201f13]">
                    Payment Info
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-[#201f13] font-extralight">
                      Total Price:
                    </span>
                    <span className="font-extrabold tracking-wide">
                      {selectedOrder &&
                        formattedPrice(selectedOrder.totalPrice)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[#201f13] font-extralight">
                      Payment Status:
                    </span>
                    <span>
                      {selectedOrder?.paymentInfo?.status || "Not Paid"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[#201f13] font-extralight">
                      Payment Mode:
                    </span>
                    <span
                      className={`${
                        selectedOrder?.paymentInfo?.status === "succeeded"
                          ? "text-[#19e50b]"
                          : selectedOrder?.paymentInfo?.status === "canceled"
                          ? "text-[#f75e68]"
                          : "text-orange-500"
                      } font-Poppins font-semibold`}
                    >
                      {selectedOrder?.paymentInfo?.paymentMethod === "COD"
                        ? "Cash on Delivery"
                        : "Online Payment"}
                    </span>
                  </div>
                </div>
              </article>
            </div>

            <div>
              <p>Change product status:</p>
              <div className="flex items-center gap-4 mt-4">
                <select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                  className="w-56 mt-2 border rounded"
                >
                  {orderStatusList.map((status, index) => (
                    <option key={index} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                <select className="w-56 mt-2 border rounded" name="" id="">
                  {refundStatusList.map((status, index) => (
                    <option key={index} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={orderUpdateHandler}
                className="bg-orange-500 hover:bg-orange-600 text-white py-1.5 px-4 rounded mt-4"
              >
                Update Status
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
