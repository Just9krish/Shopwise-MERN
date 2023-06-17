import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { AiOutlineArrowRight, AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import { formattedPrice } from "../../../helper/formatPrice";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { IOrder, IShopOrder } from "../../../Interface";
import { getAllOrdersOfSeller } from "../../../redux/actions/ordersActions";
import { server } from "../../../server";
import Loader from "../../Loader/Loader";
import OrderDetails from "./OrderDetails";

type Row = {
  id: string;
  itemsQty: number;
  total: string;
  status: string;
};

export default function ShopOrders() {
  const { seller } = useAppSelector((state) => state.seller);
  const { shopOrders, isLoading } = useAppSelector((state) => state.orders);
  const dispatch = useAppDispatch();

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
            <Link to={`/shop-orders/${params.id}`}>
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

  shopOrders.forEach((order) => {
    row.push({
      id: order._id,
      itemsQty: order.cart.length,
      total: formattedPrice(order.totalPrice),
      status: order.orderStatus,
    });
  });

  useEffect(() => {
    dispatch(getAllOrdersOfSeller(seller._id));
  }, [seller._id]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="w-[100%] lg:mx-8 pt-1 lg:mt-10 bg-white overflow-x-scroll">
            <DataGrid rows={row} columns={columns} autoHeight />
          </div>
        </>
      )}
    </>
  );
}
