import { BsTwitter, BsYoutube } from "react-icons/bs";
import { MdLocationOn, MdWifiCalling3, MdEmail } from "react-icons/md";
import { FiInstagram } from "react-icons/fi";
import style from "../../../styles/style";
import siteLink from "../../../constant/footerLinks.json";
import supportLink from "../../../constant/footerSupportLinks.json";
import { Link } from "react-router-dom";
import logo from "../../../assets/shopwise.png";

export default function Footer() {
  return (
    <footer className="bg-[#00252E] pt-24 pb-16 px-4 lg:pt-24 lg:pb-8 lg:px-0 text-white">
      <div className="container mx-auto px-4 max-w-lg md:max-w-5xl lg:max-w-7xl">
        {/* <h3 className="mb-6 text-2xl font-semibold lg:text-4xl">Shopwise</h3> */}
        <img
          className="w-40 mb-6"
          style={{ filter: "grayscale(100%) invert(100%) hue-rotate(180deg)" }}
          src={logo}
          alt="Shopwise log"
        />
        <div className="lg:flex lg:justify-between lg:items-start">
          <div className="mb-12 md:max-w-sm">
            <div className={`${style.flex_normal} mb-4`}>
              <span className="mr-4">
                <MdLocationOn fontSize="1.2em" />
              </span>
              <p>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Excepturi dolores similique repudiandae?
              </p>
            </div>
            <div className="flex items-center mb-4">
              <span className="mr-4">
                <MdWifiCalling3 fontSize="1.2em" />
              </span>
              <p>+91 0123456789</p>
            </div>
            <div className="flex items-center mb-4">
              <span className="mr-4">
                <MdEmail fontSize="1.2em" />
              </span>
              <p>example@shopwise.com</p>
            </div>
          </div>
          <div className="mb-6">
            <h4 className="mb-2">Subcribe to get notified for latest offer</h4>
            <form action="" className="flex items-center gap-4 flex-wrap">
              <input
                type="text"
                placeholder="Your Email"
                autoComplete="off"
                name="subscribe"
                className="rounded-md px-2 py-1 mr-4 text-gray-500"
                required
              />
              <button className="bg-orange-500 py-1 px-3.5 rounded-md uppercase hover:bg-orange-400">
                Subscribe
              </button>
            </form>
            <div className="flex justify-between mt-8">
              {siteLink && (
                <ul className="list-none">
                  <h4 className="font-semibold mb-2 text-lg">Company</h4>
                  {siteLink?.map((link, idx) => (
                    <li
                      key={idx}
                      className="hover:text-[#ff7d1a] transition-all hover:underline mb-1"
                    >
                      <Link to={link.link}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              )}
              {supportLink && (
                <ul className="list-none">
                  <h4 className="font-semibold mb-2 text-lg">Support</h4>
                  {supportLink?.map((link, idx) => (
                    <li
                      className="hover:text-[#ff7d1a] transition-all hover:underline mb-1 cursor-pointer"
                      key={idx}
                    >
                      {link.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="mt-8 lg:m-0">
            <h1 className="mb-2 hidden lg:block">Follow us</h1>
            <div className="flex justify-center items-centers mb-6">
              <a
                className="flex justify-center items-center w-8 h-8 border border-white mr-4 rounded-full p-2 text-white transition-all hover:border-orange-500 hover:text-orange-500 hover:-translate-y-1"
                href="#"
              >
                <BsTwitter />
              </a>
              <a
                className="flex justify-center items-center w-8 h-8 border border-white mr-4 rounded-full p-2 text-white transition-all hover:border-orange-500 hover:text-orange-500 hover:-translate-y-1"
                href="#"
              >
                <FiInstagram />
              </a>
              <a
                className="flex justify-center items-center w-8 h-8 border border-white rounded-full p-2 text-white transition-all hover:border-orange-500 hover:text-orange-500 hover:-translate-y-1"
                href="#"
              >
                <BsYoutube />
              </a>
            </div>
          </div>
        </div>
        <div className="text-center text-xs lg:text-xl lg:text-left md:mb-1">
          <p>&copy; Copyright 2022 Shopwise. All rights reservered.</p>
        </div>
      </div>
    </footer>
  );
}
