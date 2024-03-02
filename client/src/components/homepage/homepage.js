import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import BackgroundImage from "../../asserts/backgroudImg_HomePage2.jpg";
import aboutUsImg from "../../asserts/about_section.svg";
import drinksImg from "../../asserts/drinksimg.svg";

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
            <Link to="/customerlogin">
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
              Quench your thirst <br />
              with just a click, because <br /> every sip deserves a perfect
              pick!
            </h1>
            <p className="text-white max-w-3xl tracking-wide text-start font-light  leading-tight my-4 text-m">
              Welcome to our online drinks store, where every pour tells a story
              and every sip ignites a celebration. Embark on a journey through a
              tantalizing array of beverages meticulously curated to tantalize
              your taste buds and elevate your drinking experience.
            </p>
            <div className="flex gap-6">
              <button className="relative inline-flex items-center px-12 py-3 overflow-hidden text-m text-white border-2 border-white rounded-sm hover:text-white group hover:bg-white">
                <Link to="/customerlogin">
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
                <Link to="/customerregister">Register</Link>
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
                Introducing our innovative online platform that revolutionizes
                the way customers enjoy their favorite drinks and empowers store
                owners to effortlessly manage their inventory. <br />
                With our user-friendly interface, customers can browse through
                an extensive collection of beverages, from spirits and wines to
                beers and mixers, all conveniently available at their
                fingertips.
                <br /> Our seamless ordering system ensures a smooth and secure
                transaction process, allowing customers to purchase their
                desired drinks with ease and confidence. Meanwhile, for store
                owners, our advanced inventory management tools provide
                real-time updates on stock levels, enabling efficient monitoring
                and restocking to meet customer demand effectively.{" "}
              </p>
            </div>
          </div>
        </div>
        <div
          className=" w-full h-fit  flex flex-col justify-start items-center py-16 gap-8 bg-gray-900"
          id="service"
        >
          <div className="flex flex-col gap-4 justify-center">
            <h2 className="text-5xl font-bold text-white align-center text-center">
              ABOUT OUR TEAM
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl align-middle text-center"></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
