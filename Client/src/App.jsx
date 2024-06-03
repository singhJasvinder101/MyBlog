import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import FooterComponent from './components/FooterComponent'
import HeaderComponent from './components/HeaderComponent'
import PaginationComponent from './components/PaginationComponent'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import BlogDescriptionPage from './pages/user/BlogDescriptionPage'
import BlogSpecificPage from './pages/BlogSpecificPage'
import ProtectedRoutesComponent from './components/ProtectedRoutesComponent'
import SpeedDialComponent from './components/SpeedDialComponente'
import CreatePostPage from './pages/CreatePostPage'
import { createContext, useState } from 'react'
import {  useState } from 'react'
import NotFoundPage from './pages/404Page'

export const ThemeContext = createContext(null);

function App() {
  const [isLoading, setIsLoading] = useState(false);

  const [theme,setTheme] = useState("dark");

  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"))
  }

  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      {isLoading && (
        <div className="loader">
          <div className="scanner">
            <span>Loading...</span>
          </div>
        </div>
      )}
      <div className='app' id={theme}>
        <SpeedDialComponent />
        <Router>
     
          <HeaderComponent />
          <Routes>
          <Route path="*" element={<NotFoundPage />} />
            <Route exact path="/" element={<HomePage setIsLoading={setIsLoading} />} />
            <Route path="/login" element={<LoginPage setIsLoading={setIsLoading} />} />
            <Route path="/register" element={<RegisterPage setIsLoading={setIsLoading} />} />
            {/* <Route element={<ProtectedRoutesComponent />}> */}
              <Route path="/post-details/:postId" element={<BlogDescriptionPage setIsLoading={setIsLoading} />} />
              <Route path="/blogs/:tag" element={<BlogSpecificPage setIsLoading={setIsLoading} />} />
              <Route path="/user/createPost" element={<CreatePostPage setIsLoading={setIsLoading} />} />
            {/* </Route> */}
          </Routes>
          <FooterComponent />
        </Router>
        {/* <PaginationComponent /> */}
      </div>
      </ThemeContext.Provider>
  );
}

export default App;
