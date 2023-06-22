import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import { useEffect } from "react";
import { AiOutlineArrowRight, AiOutlineMoneyCollect } from "react-icons/ai";
import { MdBorderClear } from "react-icons/md";
import { Link } from "react-router-dom";
import { formattedPrice } from "../../../helper/formatPrice";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { getAllOrdersOfSeller } from "../../../redux/actions/ordersActions";
import { getShopAllProducts } from "../../../redux/actions/productActions";
import style from "../../../styles/style";

type row = {
  id: string;
  total: string;
  quantity: number;
  status: string;
};

export default function ShopDashboardHero() {
  const { shopOrders } = useAppSelector((state) => state.orders);
  const { products } = useAppSelector((state) => state.products);
  const { seller } = useAppSelector((state) => state.seller);
  const dispatch = useAppDispatch();

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params: GridCellParams) => {
        return params.value === "Delivered" ? "greenColor" : "redColor";
      },
    },
    {
      field: "quantity",
      headerName: "Quantity",
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
            <Link to={`/dashboard/order/${params.id}`}>
              <AiOutlineArrowRight size={20} />
            </Link>
          </>
        );
      },
    },
  ];

  const row: row[] = [];

  shopOrders &&
    shopOrders.forEach((order) => {
      row.push({
        id: order._id,
        quantity: order.cart.reduce((acc, item) => acc + item.quantity, 0),
        total: formattedPrice(order.totalPrice),
        status: order.orderStatus,
      });
    });

  useEffect(() => {
    dispatch(getAllOrdersOfSeller(seller._id));
    dispatch(getShopAllProducts(seller._id));
  }, [dispatch]);

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

        <div className="w-full bg-white shadow px-2 py-5 rounded">
          <DataGrid
            columns={columns}
            rows={row}
            autoHeight
            disableRowSelectionOnClick
          />
        </div>
      </div>
    </div>
  );
}
