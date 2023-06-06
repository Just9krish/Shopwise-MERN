import axios from "axios";
import { useEffect, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../../hooks";
import { server } from "../../../server";

export default function ShopOrders() {
  const [ShopOrders, setShopOrders] = useState();
  const { seller } = useAppSelector((state) => state.seller);

  async function getShopOrders() {
    const { data } = await axios.get(`${server}/shops/${seller._id}/orders`, {
      withCredentials: true,
    });

    setShopOrders(data.orders);
    console.log(data.orders);
  }

  useEffect(() => {
    getShopOrders();
    console.log(ShopOrders);
    return () => {};
  }, []);

  const columns = [
    {
      field: "id",
      headerName: "Product Id",
      minWidth: 150,
      flex: 0.7,
      maxWidth: 250,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1.4,
      maxWidth: 350,
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 80,
      flex: 0.6,
      maxWidth: 120,
    },
    {
      field: "discountpercentage",
      headerName: "Discount Percentage",
      minWidth: 80,
      flex: 0.6,
      maxWidth: 100,
    },
    {
      field: "discountprice",
      headerName: "Discount Price",
      minWidth: 80,
      flex: 0.6,
      maxWidth: 120,
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      minWidth: 80,
      flex: 0.6,
      maxWidth: 120,
    },
    {
      field: "sold",
      headerName: "Sold out",
      type: "number",
      minWidth: 100,
      flex: 0.6,
      maxWidth: 150,
    },
    {
      field: "Preview",
      flex: 0.8,
      minWidth: 100,
      headerName: "",
      type: "number",
      sortable: false,
      maxWidth: 100,
      renderCell: (params: GridCellParams) => {
        const d = params.row.name;
        const product_name = d.replace(/\s+/g, "-");
        return (
          <>
            <Link to={`/products/${product_name}`}>
              <button className="hover:bg-gray-200 bg-transparent rounded py-1.5 px-4 transition-all">
                <AiOutlineEye size={20} />
              </button>
            </Link>
          </>
        );
      },
    },
  ];
  return <div></div>;
}
