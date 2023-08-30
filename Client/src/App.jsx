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
import { useEffect, useState } from 'react'



function App() {
  const [isLoading, setIsLoading] = useState(true); // State to track loading

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  return (
    <>
      {isLoading ? ( 
        <div className="loader">
          <div className="scanner">
            <span>Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <SpeedDialComponent />
          <Router>
            <HeaderComponent />
            <Routes>
              <Route exact path="/" element={<HomePage setIsLoading={setIsLoading} />} />
              <Route path="/login" element={<LoginPage setIsLoading={setIsLoading} />} />
              <Route path="/register" element={<RegisterPage setIsLoading={setIsLoading} />} />
              <Route element={<ProtectedRoutesComponent />}>
                <Route path="/post-details/:postId" element={<BlogDescriptionPage setIsLoading={setIsLoading} />} />
                <Route path="/blogs/:tag" element={<BlogSpecificPage setIsLoading={setIsLoading} />} />
                <Route path="/user/createPost" element={<CreatePostPage setIsLoading={setIsLoading} />} />
              </Route>
            </Routes>
          <FooterComponent />
          </Router>
          {/* <PaginationComponent /> */}
        </>
      )}
    </>
  );
}

export default App;
