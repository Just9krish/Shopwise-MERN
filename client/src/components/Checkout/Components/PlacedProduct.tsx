import { useEffect, useState } from "react";
import { formattedPrice } from "../../../helper/formatPrice";
import { useAppSelector } from "../../../hooks";
import { IProduct, IShippingAddress } from "../../../Interface";
import { host } from "../../../server";

type Iorder = {
  orders: {
    shippingAddress: IShippingAddress;
    _id: string;
    cart: {
      product: IProduct;
      quantity: number;
    }[];
  }[];
  totalPrice: number;
  isPaid: boolean;
};

type OrderItem = {
  product: IProduct;
  quantity: number;
};

export default function PlacedProduct() {
  const { user } = useAppSelector((state) => state.user);
  const [order, setOrder] = useState<Iorder>();
  const [orderProducts, setOrderProducts] = useState<null | OrderItem[]>();

  useEffect(() => {
    const latestOrder = localStorage.getItem("latestorder");

    if (latestOrder) {
      const order: Iorder = JSON.parse(latestOrder);
      setOrder(order);

      const products = order.orders.flatMap((order) =>
        order.cart.map((cartItem) => cartItem)
      );
      setOrderProducts(products);
    }
  }, []);

  return (
    <div className="bg-white shadow px-6 py-8">
      <p className="font-Poppins font-extralight text-sm">
        Thank you, {user?.name}, for placing an order with us. We will try to
        deliver your order as soon as possible.
      </p>
      {order && (
        <div>
          <h4 className="mt-4 mb-2 text-lg font-semibold">Order Summary</h4>

          <div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h5 className="text-xl font-semibold">
                Total Price : {formattedPrice(order.totalPrice)}
              </h5>
            </div>
            {order.isPaid ? (
              <p className="text-green-500 mt-4">Payment: Paid</p>
            ) : (
              <p className="text-red-500 mt-4">Payment: Cash on Delivery</p>
            )}
          </div>

          {orderProducts && orderProducts?.length > 0 && (
            <div className="mt-4">
              {orderProducts.map((orderProduct) => (
                <div
                  key={orderProduct.product._id}
                  className="flex items-center gap-4 p-4 border-b"
                >
                  <div className="w-[66px] h-[66px] rounded overflow-hidden">
                    <img
                      src={`${host}/${orderProduct.product.images[0].url}`}
                      className="w-full h-full object-cover"
                      alt={orderProduct.product.images[0].name}
                    />
                  </div>
                  <div>
                    <p className="font-semibold">{orderProduct.product.name}</p>
                    <p className="text-gray-600 text-sm">
                      Quantity: {orderProduct.quantity}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Price:
                      {formattedPrice(
                        orderProduct.quantity *
                          (orderProduct.product.discount_percentage > 0
                            ? orderProduct.product.discount_price
                            : orderProduct.product.price)
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
