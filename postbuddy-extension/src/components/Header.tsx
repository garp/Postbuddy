/* global chrome */
import React from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { GoLinkExternal } from "react-icons/go";
import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";

export default function Header() {
  const handleClose = () => {
    window.close();
  };
  return (
    <div id="header">
      <div id="logo-container">
        <Link to="/">
          <img
            src="https://res.cloudinary.com/ddbzdperq/image/upload/v1738439551/16_ctkp0v.png"
            alt="Reply Bot Logo"
            id="logo"
            width={100}
            height={100}
          />
        </Link>
        <h1 id="title" className="text-3xl gradient-text">
          Postbuddy Ai
        </h1>
      </div>
      <div id="header-buttons">
        <p>
          <IoSettingsOutline 
            className="icon" 
            onClick={() => chrome.runtime.openOptionsPage()}
            style={{ cursor: 'pointer' }}
          />
        </p>
        <a
          href="https://postbuddy.ai/plans"
          target="_blank"
          rel="noreferrer"
          className="icon-link"
        >
          <GoLinkExternal />
        </a>
        <p onClick={handleClose} className="cursor-pointer">
          <IoMdClose className="icon" />
        </p>
      </div>
    </div>
  );
}
