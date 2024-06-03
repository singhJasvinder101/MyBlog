import React, { useContext, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { useDispatch, useSelector } from "react-redux";
import { logOutUser } from "../../redux/slices/loginRegisterSlice";
import SpeedDialComponent from "./SpeedDialComponente";
import { BiLogOut } from "react-icons/bi";
import { Sling as Hamburger } from 'hamburger-react'
import { Button } from "react-bootstrap";
import { FaBell } from "react-icons/fa";
import { Switch } from 'antd';
import { ThemeContext } from "../App";

const HeaderComponent = () => {
  const apiUrl = import.meta.env.VITE_API_URI;

  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchInputRef = useRef(null)

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      navigate(`/blogs/${searchQuery.trim()}`)
    }
  };

  const userInfo = useSelector(state => state.userLoggedIn.userInfo)

  const handleLogout = () => {
    dispatch(logOutUser())
  }

  const focusSearchInput = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleThemeChange = () => {
    toggleTheme(); 
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };


  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <Hamburger size={20} />
        </button>

        <div className="nav-top-links nav-top collapse navbar-collapse" id="navbarSupportedContent">
          <Link to="/" className="navbar-brand mr-5 ml-5" href="#">
            TechBytes
          </Link>
          <ul className="navbar-nav align-items-center">
            <li className="nav-item">
              <Link style={{ 'color': '#a7acb3' }}
                className={`nav-link ${location.pathname === "/technology" ? "active-link" : ""}`}
                to="/blogs/technology"
              >
                TECHNOLOGY
              </Link>
            </li>
            <li className="nav-item">
              <Link style={{ 'color': '#a7acb3' }}
                className={`nav-link ${location.pathname === "/ai" ? "active-link" : ""}`}
                to="/blogs/ai"
              >
                AI
              </Link>
            </li>
            <li className="nav-item">
              <Link style={{ 'color': '#a7acb3' }}
                className={`nav-link ${location.pathname === "/technews" ? "active-link" : ""}`}
                to="/blogs/news"
              >
                TECH NEWS
              </Link>
            </li>
            <li className="nav-item">
              <Link style={{ 'color': '#a7acb3' }}
                className={`nav-link ${location.pathname === "/datascience" ? "active-link" : ""}`}
                to="/blogs/datascience"
              >
                DATA SCIENCE
              </Link>
            </li>
            <li className="nav-item">
              <Link style={{ 'color': '#a7acb3' }}
                className={`nav-link ${location.pathname === "/security" ? "active-link" : ""}`}
                to="/blogs/security"
              >
                SECURITY
              </Link>
            </li>
          </ul>
        </div>

        <div className="right-header nav-top d-flex align-items-center justify-content-center">

          <div className="search-container">
            <input
              ref={searchInputRef}
              placeholder="Search by tag e.g. ai"
              required=""
              className="input1"
              name="text"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              autoComplete="off"
            />
            <div className="icon">
              <svg viewBox="0 0 512 512" className="ionicon" xmlns="http://www.w3.org/2000/svg">
                <title>Search</title>
                <path strokeWidth="32" strokeMiterlimit="10" stroke="white" fill="none" d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z"></path>
                <path d="M338.29 338.29L448 448" strokeWidth="32" strokeMiterlimit="10" strokeLinecap="round" stroke="white" fill="none"></path>
              </svg>
            </div>
          </div>


          {userInfo.isAdmin ? (
            <li className="nav-item">
              <Link
                className="nav-link position-relative"
                style={{ fontSize: '1rem' }}
                to="/admin">
                Admin
                <span
                  className="position-absolute top-5 start-100 translate-middle p-2 bg-success border border-light rounded-circle"
                >
                </span>
              </Link>
            </li>
          ) : userInfo.name && !userInfo.isAdmin ? (
            <div className="d-flex align-items-center">
              {/* best thing */}
              <div className="dropdown">
                {/* <a
                  className="nav-link ghanti dropdown-toggle position-relative mr-1"
                  href="#"
                  id="navbarDropdownMenuLink"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <FaBell fontSize={"1.3rem"}/>
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger text-light">1</span>
                </a> */}
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="navbarDropdownMenuLink"
                >
                  <li>
                    <a className="dropdown-item py-3" href="#">Hi! welcome to my blog</a>
                  </li>
                </ul>
              </div>
              <div className="dropdown">
                <a
                  className="nav-link dropdown-toggle d-flex align-items-center"
                  href="#"
                  id="navbarDropdownMenuAvatar"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <img
                    src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp"
                    className="rounded-circle"
                    height="27"
                    alt="Black and White Portrait of a Man"
                    loading="lazy"
                  />
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-end dropdown-menu-lg-left"
                  aria-labelledby="navbarDropdownMenuAvatar"
                >
                  <li>
                    <a className="dropdown-item py-3" onClick={handleLogout} href="#">
                      Logout  <BiLogOut />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            (
              <div className="flex">
              <div className="login-signup mx-4">
                <Link to="/login" className="btn btn-primary mx-2 px-4 py-2 rounded-pill login">
                  Login
                </Link>
                <Link to="/register" className="text-light signup">
                  SignUp
                </Link>
              </div>
              <div className="h-full mt-1"><Switch 
        style={{ backgroundColor: theme === "dark" ? "#000000" : "" }} 
        onChange={handleThemeChange} 
        checked={theme === "dark"} 
        checkedChildren="Dark" 
        unCheckedChildren="Light" 
      /></div>
              </div>
            )
          )}

        </div>
      </div>
      <SpeedDialComponent style={{ display: 'none' }} focusSearchInput={focusSearchInput} />
    </nav>

  );
};
export default HeaderComponent;