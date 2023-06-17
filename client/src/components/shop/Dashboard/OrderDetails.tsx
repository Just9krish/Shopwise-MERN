import { useEffect, useState } from "react";
import { BsBagFill } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import { formattedPrice } from "../../../helper/formatPrice";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { IShopOrder } from "../../../Interface";
import { getAllOrdersOfSeller } from "../../../redux/actions/ordersActions";
import { host } from "../../../server";
import { Country, State } from "country-state-city";

export default function OrderDetails() {
  const dispatch = useAppDispatch();
  const { seller } = useAppSelector((state) => state.seller);
  const { shopOrders } = useAppSelector((state) => state.orders);
  const { orderId } = useParams();
  const [selectedOrder, setSelectedOrder] = useState<IShopOrder | null>(null);

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

  useEffect(() => {
    dispatch(getAllOrdersOfSeller(seller._id));
  }, [dispatch, seller._id]);

  useEffect(() => {
    const order = shopOrders.find((order) => order._id === orderId);
    setSelectedOrder(order || null);
  }, [orderId, shopOrders]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <BsBagFill className="text-orange-500" size={30} />
          <h3 className="text-2xl font-bold">Order Details</h3>
        </div>
        <Link to="/shop-orders">
          <button className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded">
            Order List
          </button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-7 shadow p-4 md:p-8 bg-white rounded-md">
        <div className="mb-8 md:mb-0">
          <h4 className="text-lg">
            Order Id: <span>{selectedOrder?._id}</span>
          </h4>

          <h4 className="text-lg mt-2">
            Placed on:{" "}
            <span>
              {selectedOrder &&
                new Date(selectedOrder.createdAt).toLocaleString()}
            </span>
          </h4>
        </div>

        <div className="md:w-2/5">
          {selectedOrder?.cart.map((item) => {
            const { _id, product, quantity } = item;
            const { name, price, images, category, discount_price } = product;

            return (
              <div
                key={_id}
                className="flex items-center gap-4 py-4 border-b border-gray-300"
              >
                <img
                  src={`${host}/${images[0].url}`}
                  alt={images[0]?.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h5 className="text-xl font-semibold">{name}</h5>
                  <h5>
                    {formattedPrice(discount_price)} x {quantity}
                  </h5>
                </div>
              </div>
            );
          })}

          <div className="mt-6">
            <h5 className="text-lg">
              Total Price:{" "}
              <strong>
                {selectedOrder && formattedPrice(selectedOrder.totalPrice)}
              </strong>
            </h5>
          </div>
        </div>

        <div className="md:w-2/5">
          <div className="mt-6 md:mt-0 md:ml-6">
            <h5 className="text-lg font-semibold">Shipping Address :</h5>
            <h5>{selectedOrder && selectedOrder.shippingAddress?.fullname}</h5>
            <h5>
              {selectedOrder &&
                `${selectedOrder.shippingAddress.address1}, ${selectedOrder.shippingAddress.address2}, ${selectedOrder.shippingAddress?.address3}`}
            </h5>

            <h5>
              {selectedOrder &&
                getStateName(
                  selectedOrder?.shippingAddress?.state,
                  selectedOrder?.shippingAddress?.country
                )}
            </h5>
            <h5>
              {selectedOrder &&
                getCountryName(selectedOrder?.shippingAddress?.country)}
            </h5>
            <h5>{selectedOrder?.shippingAddress?.zipcode}</h5>
            <h5>{selectedOrder?.shippingAddress?.primaryNumber}</h5>
            <h5>{selectedOrder?.shippingAddress?.alternateNumber}</h5>
          </div>

          <div className="mt-6 md:ml-6">
            <h5 className="text-lg font-semibold">Payment Info :</h5>
            <h5>{selectedOrder && formattedPrice(selectedOrder.totalPrice)}</h5>
            <h5>Payment: {selectedOrder?.paymentInfo?.status || "Not Paid"}</h5>
          </div>
        </div>
      </div>
    </div>
  );
}
