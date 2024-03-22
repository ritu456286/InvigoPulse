import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import BackgroundImage from "../../asserts/backgroudImg_HomePage2.jpg";
import aboutUsImg from "../../asserts/about_section.svg";
import drinksImg from "../../asserts/drinksimg.svg";
import Footer from "../footer/footer";
function Homepage() {
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = () => {
    setScrollY(window.scrollY);
  };
  const [data, setData] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/homepage");
        setData(response.data.message);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex justify-center  h-fit max-w-screen align-middle">
      <div className="flex flex-col justify-center h-fit w-full relative items-center">
        <nav
          className={`fixed top-0 w-screen px-10 z-50 transition-all duration-500 flex justify-between  ${
            scrollY > 0
              ? "bg-white  backdrop-filter backdrop-blur-lg bg-opacity-30 border-b border-gray-200"
              : "bg-white"
          }`}
        >
          {/* Your NavbarForHomePage content goes here */}
          <div className="">
            <p className="text-xl font-bold py-2 text-red-700">InvigoPulse</p>
            {/* Add more navigation links or components */}
          </div>
          <div className="flex justify-center gap-8">
            <a
              href="#about"
              className="hover:border-b-4 hover:border-red py-4 font-semibold text-black"
            >
              About
            </a>
            <a
              href="#service"
              className="hover:border-b-4 hover:border-red py-4 font-semibold text-black"
            >
              Services
            </a>
            <a className="border-b-4 hover:border-red py-4 border-transparent font-semibold text-black">
              Contact Us
            </a>
          </div>
          <div className="my-2">
            <Link to="/login">
              {" "}
              <button className="py-2 px-6 rounded-lg  text-white bg-red-700 first-letter: transition-all duration-300 ease-in-out hover:scale-95">
                SignIn
              </button>
            </Link>
          </div>
        </nav>
        {/* .SignIn {
  border: 1px solid rgb(188, 6, 6);
  color: white;
  border-radius: 999px;
  padding: 8px 18px;
  font-weight: 300;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.SignIn:hover {
  scale: 0.97;
} */}
        <div
          className="relative bg-cover h-screen w-full"
          style={{
            backgroundImage: `url(${BackgroundImage})`,
          }}
        >
          <div className="flex justify-center items-start flex-col opacity-80 bg-black absolute z-10  w-full top-0 left-0  h-screen px-12 pt-12">
            <h1 className="text-white text-5xl font-bold min-w-max leading-tight">
              Introducing InvigoPulse <br />
              your all-in-one solution for <br /> Inventory and Deadstock Management!
            </h1>
            <p className="text-white max-w-3xl tracking-wide text-start font-light  leading-tight my-4 text-m">
              Welcome to our Inventory management platform! Easily track stock levels, receive alerts, and optimize inventory with predictive analytics. Plus, efficiently manage deadstock with targeted strategies to maximize profitability. Embark on a journey through an enriching experience and elevate your profits!
            </p>
            <div className="flex gap-6">
              <button className="relative inline-flex items-center px-12 py-3 overflow-hidden text-m text-white border-2 border-white rounded-sm hover:text-white group hover:bg-white">
                <Link to="/login">
                  <span class="absolute left-0 block w-full h-0 transition-all bg-black opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-500 ease"></span>
                  <span class="absolute right-0 flex items-center justify-start w-6 h-6 duration-500 transform translate-x-full group-hover:translate-x-0 ease">
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      ></path>
                    </svg>
                  </span>
                  <span class="relative">Let's get Started</span>
                </Link>
              </button>
              <button className="rounded-3xl px-4 py-2 bg-red-900 text-white text-lg font-semibold transition-all duration-200 hover:scale-102 hover:bg-transparent hover:text-white hover:border-2 hover:border-white">
                <Link to="/register">Register</Link>
              </button>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-between py-6 px-10 items-center gap-10 h-screen">
          {<img src={drinksImg} className="max-h-auto max-w-sm"></img>}
          <div>
            <h1 className="text-start text-3xl font-bold text-red-800 py-6">
              About Us
            </h1>
            <div>
              <p className="text-start max-w-2xl font-semibold">
              Introducing our all-in-one web application for inventory and deadstock management! Our solution provides a seamless platform to track, analyze, and optimize your inventory, while efficiently managing deadstock to maximize profitability.
              With our user-friendly interface, you can easily monitor stock levels, track inventory movements in real-time, and receive automated alerts for low stock or excess inventory. Our advanced analytics tools utilize historical data and predictive algorithms to forecast demand accurately, helping you make informed decisions about procurement and inventory replenishment.
                <br /> But that's not all - our web app goes beyond traditional inventory management by offering robust deadstock management features.With customizable reporting dashboards and integration capabilities with other business systems, our web app provides a comprehensive solution tailored to your unique needs. Say goodbye to inventory headaches and hello to streamlined operations and increased profitability with our one-stop inventory and deadstock management solution. Try it today and experience the difference!{" "}
              </p>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    </div>
  );
}

export default Homepage;
