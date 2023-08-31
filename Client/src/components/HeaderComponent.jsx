import React, { useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { useDispatch, useSelector } from "react-redux";
import { logOutUser } from "../../redux/slices/loginRegisterSlice";
import SpeedDialComponent from "./SpeedDialComponente";
import { BiLogOut } from "react-icons/bi";
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
  // console.log(userInfo)

  const handleLogout = () => {
    dispatch(logOutUser())
  }

  const focusSearchInput = () => {
    // You can use a ref to reference the search input and focus on it
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
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
          <span className="navbar-toggler-icon"></span>
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
                Technology
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
                Tech News
              </Link>
            </li>
            <li className="nav-item">
              <Link style={{ 'color': '#a7acb3' }}
                className={`nav-link ${location.pathname === "/datascience" ? "active-link" : ""}`}
                to="/blogs/datascience"
              >
                Data Science
              </Link>
            </li>
            <li className="nav-item">
              <Link style={{ 'color': '#a7acb3' }}
                className={`nav-link ${location.pathname === "/security" ? "active-link" : ""}`}
                to="/blogs/security"
              >
                Security
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
                <path strokeWidth="32" strokeMiterlimit="10" stroke="currentColor" fill="none" d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z"></path>
                <path d="M338.29 338.29L448 448" strokeWidth="32" strokeMiterlimit="10" strokeLinecap="round" stroke="currentColor" fill="none"></path>
              </svg>
            </div>
          </div>


          {userInfo.isAdmin ? (
            <li className="nav-item">
              <Link
                className="nav-link position-relative"
                style={{ fontSize: '1rem' }}
                to="/admin/orders">
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
                <a
                  className="nav-link ghanti dropdown-toggle position-relative mr-1 text-muted"
                  href="#"
                  id="navbarDropdownMenuLink"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i className="fas fa-bell" style={{ fontSize: "1.2rem" }}></i>
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger text-light">1</span>
                </a>
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
                    height="25"
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
              <div className="login-signup mx-4">
                <Link to="/login" className="btn btn-primary mx-2">
                  Login
                </Link>
                <Link to="/register" className="text-light">
                  SignUp
                </Link>
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