import loadable from "@loadable/component";
import { formattedPrice } from "../../../helper/formatPrice";
import { IEvent } from "../../../Interface";
import { host } from "../../../server";
import style from "../../../styles/style";
const Countdown = loadable(() => import("../CountDown/Countdown"));

type Props = {
  event: IEvent;
};

export default function EventCard({ event }: Props) {
  if (!event) {
    return null;
  }

  const {
    name,
    images,
    price,
    discount_price,
    description,
    category,
    discount_percentage,
    endDate,
    startDate,
  } = event;

  return (
    <div
      className="w-full bg-white rounded-lg flex flex-col lg:flex-row
     gap-6 p-6"
    >
      <div className="w-full lg:w-1/2 mx-auto">
        <img src={`${host}/${images[0]}`} loading="lazy" alt="" />
      </div>
      <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-4">
        <h4 className={`${style.productTitle}`}>{name}</h4>
        <p>{description}</p>
        <div className="flex justify-between flex-wrap gap-5 items-center">
          <div className={`${style.flex_normal} gap-5`}>
            <h4 className="line-through text-gray-400 font-medium">
              {formattedPrice(price)}
            </h4>
            <h4 className="font-bold text-xl text-green-600">
              {formattedPrice(discount_price)}
            </h4>
          </div>
          <span className="text-sky-400 text-lg">276 solds</span>
        </div>
        <div>
          <Countdown endDate={endDate} startDate={startDate} />
        </div>
      </div>
    </div>
  );
}
