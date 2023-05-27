import { useEffect, useState } from "react";
import { useAppSelector } from "../../../hooks";
import { IProduct, IShippingAddress } from "../../../Interface";

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

export default function PlacedProduct() {
  const { user } = useAppSelector((state) => state.user);
  const [order, setOrder] = useState<Iorder>();

  useEffect(() => {
    const latestOrder = localStorage.getItem("latestorder");

    if (latestOrder) {
      const order: Iorder = JSON.parse(latestOrder);
      setOrder(order);
    }
  }, []);

  console.log(order);

  return (
    <div>
      <h1>
        Thank you {user?.name} to place order with us. We will try to deliver
        your order as earliest as possible.
      </h1>
    </div>
  );
}
