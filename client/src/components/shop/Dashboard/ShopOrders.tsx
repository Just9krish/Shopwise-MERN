import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { AiOutlineArrowRight, AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import { formattedPrice } from "../../../helper/formatPrice";
import { useAppSelector } from "../../../hooks";
import { IOrder } from "../../../Interface";
import { server } from "../../../server";
import Loader from "../../Loader/Loader";

type Row = {
  id: string;
  itemsQty: number;
  total: string;
  status: string;
};

export default function ShopOrders() {
  const [ShopOrders, setShopOrders] = useState<IOrder[]>([]);
  const { seller } = useAppSelector((state) => state.seller);
  const [isLoading, setIsLoading] = useState(false);

  console.log(ShopOrders);

  async function getShopOrders() {
    setIsLoading(true);

    const { data } = await axios.get(`${server}/shops/${seller._id}/orders`, {
      withCredentials: true,
    });

    setShopOrders(data.orders);
    setIsLoading(false);
  }

  useEffect(() => {
    getShopOrders();
  }, []);

  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      minWidth: 150,
      flex: 0.7,
    },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params: GridCellParams) => {
        return params.value == "Delivered" ? "greenColor" : "redcolor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,

      renderCell: (params: GridCellParams) => {
        return (
          <>
            <Link to={`/order/${params.id}`}>
              <button>
                <AiOutlineArrowRight size={20} />
              </button>
            </Link>
          </>
        );
      },
    },
  ];

  const row: Row[] = [];

  ShopOrders.forEach((order) => {
    row.push({
      id: order._id,
      itemsQty: order.cart.length,
      total: formattedPrice(order.totalPrice),
      status: order.orderStatus,
    });
  });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-[100%] lg:mx-8 pt-1 lg:mt-10 bg-white overflow-x-scroll">
          <DataGrid rows={row} columns={columns} autoHeight />
        </div>
      )}
    </>
  );
}
