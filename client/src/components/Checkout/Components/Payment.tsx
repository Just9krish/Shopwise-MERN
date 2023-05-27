import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios, { AxiosError } from "axios";
import { ChangeEvent, FormEvent, useState } from "react";
import { GrPowerReset } from "react-icons/gr";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { server } from "../../../server";
import style from "../../../styles/style";

type SavedAddress = {
  fullName: string;
  email: string;
  primaryNumber: number;
  alternateNumber: number;
  zipCode: string;
  selectedCountry: string;
  selectedState: string;
  address1: string;
  address2: string;
  address3: string;
};

type IProps = {
  toggleActiveStep: (para: number) => void;
};

export default function Payment({ toggleActiveStep }: IProps) {
  const [select, setSelect] = useState<null | number>(null);
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useAppDispatch();
  const { cart, couponID } = useAppSelector((state) => state.cart);

  const cartWithIDandQty = cart?.map((item) => ({
    productId: item._id,
    productQuantity: item.quantity,
  }));

  const cartData = {
    cartWithIDandQty,
    couponID,
  };

  const shipping_address = localStorage.getItem("shipping_address");

  let savedAddress: SavedAddress | undefined;

  if (shipping_address) {
    savedAddress = JSON.parse(shipping_address);
  }

  let shippingAddress = {
    country: savedAddress?.selectedCountry,
    zipcode: savedAddress?.zipCode,
    state: savedAddress?.selectedState,
    address3: savedAddress?.address3,
    address2: savedAddress?.address2,
    address1: savedAddress?.address1,
    fullname: savedAddress?.fullName,
    primaryNumber: savedAddress?.primaryNumber,
    alternateNumber: savedAddress?.alternateNumber,
  };

  // card payment
  async function handleCardPayment(e: FormEvent) {
    e.preventDefault();
    try {
      if (!elements || !stripe) {
        return;
      }

      const cardNumberElement = elements.getElement(CardNumberElement);

      if (cardNumberElement) {
        // creating payment intent
        const { data } = await axios.post(
          `${server}/payments/create-payment-intent`,
          cartData,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        const client_secret = data.clientSecret;

        const { error, paymentIntent } = await stripe?.confirmCardPayment(
          client_secret,
          {
            payment_method: { card: cardNumberElement },
          }
        );

        if (error) {
          toast.error(error.message);
        } else {
          if (paymentIntent.status === "succeeded") {
            const paymentInfo = {
              id: paymentIntent.id,
              status: paymentIntent.status,
              paymentMethod: "Card",
            };

            const order = {
              paymentInfo,
              shippingAddress,
              cartWithIDandQty,
              paidPrice: paymentIntent.amount,
            };

            const { data } = await axios.post(`${server}/orders`, order, {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
            });

            toast.success("Order created successfully");
            localStorage.setItem("cartItems", JSON.stringify([]));
            localStorage.removeItem("shipping_address");
            localStorage.setItem("cartPrice", JSON.stringify(0));
            localStorage.setItem("latestorder", JSON.stringify(data));
            dispatch({ type: "clearCart" });
            toggleActiveStep(2);
          }
        }
      }
    } catch (err: AxiosError | any) {
      if (err.response) {
        toast.error(err.response.data.message);
      } else {
        toast.error(err.message);
      }
    }
  }

  // cash on delivery
  const [randomText, setRandomText] = useState(generateRandomText());
  const [userInput, setUserInput] = useState("");

  function generateRandomText() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let text = "";
    for (let i = 0; i < 6; i++) {
      text += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return text;
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setUserInput(e.target.value);
  }

  async function handleVerify() {
    try {
      const paymentInfo = {
        paymentMethod: "COD",
        status: "Pending",
      };
      const order = {
        shippingAddress,
        cartWithIDandQty,
        paymentInfo,
        couponID: cartData.couponID,
      };

      const { data } = await axios.post(`${server}/orders`, order, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      toast.success("Order created successfully");
      localStorage.setItem("cartItems", JSON.stringify([]));
      localStorage.removeItem("shipping_address");
      localStorage.setItem("cartPrice", JSON.stringify(0));
      localStorage.setItem("latestorder", JSON.stringify(data));
      dispatch({ type: "clearCart" });

      toggleActiveStep(2);
    } catch (err: AxiosError | any) {
      if (err.response) {
        toast.error(err.response.data.message);
      } else {
        toast.error(err.message);
      }
    }
  }

  function handleReset() {
    setRandomText(generateRandomText());
    setUserInput("");
  }

  return (
    <div className="bg-white shadow rounded p-8">
      <div className="space-y-8">
        {/* card payment */}
        <button className="flex gap-8" onClick={() => setSelect(1)}>
          <span
            className={`bg-transparent h-6 w-6 rounded-full border-2 border-green-500 flex justify-center items-center relative after:absolute after:bg-green-500 after:z-30 after:rounded-full ${
              select === 1 ? "after:h-[18px] after:w-[18px]" : ""
            }`}
          ></span>
          <h4 className="font-semibold text-[#000000b1]">
            Pay with Debit/Credit Card
          </h4>
        </button>

        {select == 1 && (
          <div className="flex border-b px-14 pb-8">
            <form className="w-full space-y-4" onSubmit={handleCardPayment}>
              <div className="max-w-sm w-full">
                <label
                  htmlFor="nameoncard"
                  className="block text-sm font-medium text-[#000000a4]"
                >
                  Name On Card
                </label>
                <input
                  id="nameoncard"
                  required
                  className={`${style.input} w-full rounded-none text-[#444] p-0 text-[18px]`}
                />
              </div>

              <div className="max-w-sm w-full">
                <p className="text-sm font-medium text-[#000000a4]">
                  Card Information
                </p>
                <CardNumberElement
                  options={{
                    placeholder: "XXXX XXXX XXXX XXXX",
                    style: {
                      base: { fontSize: "17px", color: "#444" },
                      empty: {
                        "::placeholder": {
                          color: "#c8c8c8",
                        },
                      },
                    },
                  }}
                  className={`${style.input} rounded-none`}
                />
                <div className={`${style.flex_normal} gap-4 mt-1`}>
                  <div className="w-1/2">
                    <CardExpiryElement
                      options={{
                        style: {
                          base: { fontSize: "17px", color: "#444" },
                          empty: {
                            "::placeholder": {
                              color: "#c8c8c8",
                            },
                          },
                        },
                      }}
                      className={`${style.input} rounded-none`}
                    />
                  </div>
                  <div className="w-1/2">
                    <CardCvcElement
                      options={{
                        style: {
                          base: { fontSize: "17px", color: "#444" },
                          empty: {
                            "::placeholder": {
                              color: "#c8c8c8",
                            },
                          },
                        },
                      }}
                      className={`${style.input} rounded-none`}
                    />
                  </div>
                </div>
              </div>

              <div className="max-w-sm w-full">
                <button className="w-full border border-orange-500 py-1.5 rounded text-orange-500 font-medium transition-all hover:text-white hover:bg-orange-500">
                  Pay
                </button>
              </div>
            </form>
          </div>
        )}

        {/* paypal */}
        <button className="flex gap-8" onClick={() => setSelect(2)}>
          <span
            className={`bg-transparent h-6 w-6 rounded-full border-2 border-green-500 flex justify-center items-center relative after:absolute  after:bg-green-500 after:rounded-full after:z-30 ${
              select === 2 ? "after:h-[18px] after:w-[18px]" : ""
            }`}
          ></span>
          <h4 className="font-semibold text-[#000000b1]">Pay with Pay Pal</h4>
        </button>

        {select === 2 && (
          <div className="w-ful px-14 pb-8 border-b">
            <h1 className="font-medium text-[#000000a4]">
              We are not accepting paypal payment right now.
            </h1>
          </div>
        )}

        {/* cash on delivery */}
        <button className="flex gap-8" onClick={() => setSelect(3)}>
          <span
            className={`bg-transparent h-6 w-6 rounded-full border-2 border-green-500 flex justify-center items-center relative after:absolute after:bg-green-500 after:z-30 after:rounded-full ${
              select === 3 ? "after:h-[18px] after:w-[18px]" : ""
            }`}
          ></span>
          <h4 className="font-semibold text-[#000000b1]">Cash On Delivery</h4>
        </button>
        {select === 3 && (
          <div className="px-14 pb-8 space-y-4 max-w-md w-full">
            <h4 className="text-[#000000a4]">
              Enter the text shown in the image:
            </h4>
            <img
              src={`https://dummyimage.com/180x50/999/fff&text=${randomText}`}
              alt="Random Text"
            />
            <div className={`${style.flex_normal} gap-3`}>
              <input
                className={`${style.input} w-4/5`}
                type="text"
                value={userInput}
                onChange={handleInputChange}
              />
              <button onClick={handleReset}>
                <GrPowerReset size={20} cursor="pointer" />
              </button>
            </div>
            <button
              className="py-1.5 px-4 bg-orange-500 text-white rounded-md border border-orange-500 transition-all hover:text-orange-500 hover:bg-transparent"
              onClick={handleVerify}
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
