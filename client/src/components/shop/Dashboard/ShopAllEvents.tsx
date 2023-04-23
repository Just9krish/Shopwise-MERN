import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import { useEffect } from "react";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { formattedPrice } from "../../../helper/formatPrice";
import { IAppState } from "../../../Interface";
import {
  deleteEvent,
  getShopAllEvents,
} from "../../../redux/actions/eventsActions";
import {
  deleteProduct,
  getShopAllProducts,
} from "../../../redux/actions/productActions";
import Loader from "../../Loader/Loader";

type row = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: string;
  price: string;
  stock: number;
  sold: number;
  discountpercentage: number;
  discountprice: string;
};

export default function ShopAllEvents() {
  const dispatch = useDispatch();
  const { seller } = useSelector((state: IAppState) => state.seller);
  const { events, isEventsLoading } = useSelector(
    (state: IAppState) => state.events
  );

  function deleteEventHandler(eventId: string, sellerId: string) {
    // @ts-ignore
    dispatch(deleteEvent(eventId, sellerId));
    window.location.reload();
  }

  useEffect(() => {
    // @ts-ignore
    dispatch(getShopAllEvents(seller._id));
  }, [dispatch, seller._id]);

  const columns = [
    {
      field: "id",
      headerName: "Product Id",
      minWidth: 150,
      flex: 0.7,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "startDate",
      headerName: "Start Date",
      minWidth: 100,
      flex: 1.4,
    },
    {
      field: "endDate",
      headerName: "End Date",
      minWidth: 100,
      flex: 1.4,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 100,
      flex: 1.4,
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 80,
      flex: 0.6,
    },
    {
      field: "discountpercentage",
      headerName: "Discount Percentage",
      minWidth: 80,
      flex: 0.6,
    },
    {
      field: "discountprice",
      headerName: "Discount Price",
      minWidth: 80,
      flex: 0.6,
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      minWidth: 80,
      flex: 0.6,
    },
    {
      field: "sold",
      headerName: "Sold out",
      type: "number",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "Preview",
      flex: 0.8,
      minWidth: 100,
      headerName: "",
      type: "number",
      sortable: false,
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
    {
      field: "Delete",
      flex: 0.8,
      minWidth: 100,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params: GridCellParams) => {
        console.log(params);
        return (
          <>
            <button
              onClick={() =>
                deleteEventHandler(params.id.toString(), seller._id)
              }
              className="hover:bg-gray-200 bg-transparent rounded py-1.5 px-4 transition-all"
            >
              <AiOutlineDelete size={20} />
            </button>
          </>
        );
      },
    },
  ];

  const row: row[] = [];

  events?.forEach((item) => {
    row.push({
      id: item._id,
      name: item.name,
      startDate: item.startDate,
      endDate: item.endDate,
      status: item.status,
      price: formattedPrice(item.price),
      stock: item.stock,
      sold: item.sold_out,
      discountpercentage: item.discount_percentage,
      discountprice: formattedPrice(item.discount_price),
    });
  });

  return (
    <>
      {isEventsLoading ? (
        <Loader />
      ) : (
        <div className="w-full lg:mx-8 pt-1 lg:mt-10 bg-white overflow-x-scroll">
          <DataGrid
            rows={row}
            columns={columns}
            autoHeight
            disableRowSelectionOnClick
          />
        </div>
      )}
    </>
  );
}
