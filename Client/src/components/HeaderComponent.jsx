import React, { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logOutUser } from "../../redux/slices/loginRegisterSlice";
import { BiLogOut } from "react-icons/bi";
import { Sling as Hamburger } from 'hamburger-react';
import { FaBell } from "react-icons/fa";
// Import SpeedDialComponent
import SpeedDialComponent from "./SpeedDialComponente"; // Ensure this path is correct

const HeaderComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isNavbarExpanded, setIsNavbarExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchInputRef = useRef(null);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      navigate(`/blogs/${searchQuery.trim()}`);
      setIsNavbarExpanded(false);
    }
  };

  const userInfo = useSelector(state => state.userLoggedIn.userInfo);

  const handleLogout = () => {
    dispatch(logOutUser());
    setIsNavbarExpanded(false);
  };

  const focusSearchInput = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const toggleNavbar = () => {
    setIsNavbarExpanded(!isNavbarExpanded);
  };

  const closeNavbar = () => {
    setIsNavbarExpanded(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <button
          className="navbar-toggler mx-4"
          type="button"
          aria-controls="navbarSupportedContent"
          aria-expanded={isNavbarExpanded}
          aria-label="Toggle navigation"
          onClick={toggleNavbar}
        >
          <Hamburger toggled={isNavbarExpanded} toggle={toggleNavbar} size={20} />
        </button>

        <div className={`collapse navbar-collapse ${isNavbarExpanded ? 'show' : ''}`} id="navbarSupportedContent">
          <Link to="/" className="navbar-brand mr-5 ml-5">
            TechBytes
          </Link>
          <ul className="navbar-nav align-items-center">
            {['technology', 'ai', 'news', 'datascience', 'security'].map((path, index) => (
              <li key={index} className="nav-item">
                <Link
                  style={{ color: '#a7acb3' }}
                  className={`nav-link ${location.pathname === `/blogs/${path}` ? 'active-link' : ''}`}
                  to={`/blogs/${path}`}
                  onClick={closeNavbar}
                >
                  {path.toUpperCase()}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="right-header nav-top d-flex align-items-center justify-content-center">
          {userInfo.isAdmin ? (
            <li className="nav-item">
              <Link
                className="nav-link position-relative"
                style={{ fontSize: '1rem' }}
                to="/admin"
                onClick={closeNavbar}
              >
                Admin
                <span className="position-absolute top-5 start-100 translate-middle p-2 bg-success border border-light rounded-circle"></span>
              </Link>
            </li>
          ) : userInfo.name && !userInfo.isAdmin ? (
            <div className="d-flex align-items-center">
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

              <div className="dropdown">
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuLink">
                  <li>
                    <a className="dropdown-item py-3" href="#">Hi! welcome to my blog</a>
                  </li>
                </ul>
              </div>
              <div className="dropdown">
                <a
                  className="nav-link px-3 dropdown-toggle d-flex align-items-center"
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
                    alt="Avatar"
                    loading="lazy"
                  />
                </a>
                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-lg-left" aria-labelledby="navbarDropdownMenuAvatar">
                  <li>
                    <a className="dropdown-item py-3" onClick={handleLogout} href="#">
                      Logout <BiLogOut />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="login-signup mx-4">
              <Link to="/login" className="btn btn-primary mx-2 px-4 py-2 rounded-pill" onClick={closeNavbar}>
                Login
              </Link>
              <Link to="/register" className="text-light signup" onClick={closeNavbar}>
                SignUp
              </Link>
            </div>
          )}
        </div>
      </div>
      <SpeedDialComponent style={{ display: 'none' }} focusSearchInput={focusSearchInput} />
    </nav>
  );
};

export default HeaderComponent;
