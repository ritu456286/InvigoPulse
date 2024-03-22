import React from "react";
import { RiFacebookFill } from "react-icons/ri";
import { FaInstagram } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import { FaTwitter } from "react-icons/fa";
const Footer = () => {
  return (
    <div className="bg-slate-800 w-full px-6 py-6">
      <div className="flex gap-4 justify-evenly items-center gap-30 text-white">
        <div>
          <h1 className="font-extrabold text-4xl">
            INVIGO
            <br />
            PULSE
          </h1>
        </div>
        <div>
          <h2 className="font-bold text-xl">Contact Us</h2>
          <p className="font-semibold text-lg">+91-1234567890</p>
          <p className="font-semibold text-lg">invogopulse@gmail.com</p>
        </div>
        <div>
          <h2 className="font-bold text-xl">Team Members</h2>
          <p className="font-semibold text-lg">Ritu kansal</p>
          <p className="font-semibold text-lg">Shreeya</p>
          <p className="font-semibold text-lg">Saachi Bansal</p>
          <p className="font-semibold text-lg">Teesha Madaan</p>
          <p className="font-semibold text-lg">Vanshika Malik</p>
        </div>
        <div className="flex gap-5">
          <span className="font-bold text-2xl">
            <RiFacebookFill />
          </span>
          <span className="font-bold text-2xl">
            <FaInstagram />
          </span>
          <span className="font-bold text-2xl">
            <FaTwitter />
          </span>
          <span className="font-bold text-2xl">
            <MdOutlineMail />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Footer;