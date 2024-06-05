import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FooterComponent from './components/FooterComponent';
import HeaderComponent from './components/HeaderComponent';
import SpeedDialComponent from './components/SpeedDialComponente';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BlogDescriptionPage from './pages/user/BlogDescriptionPage';
import BlogSpecificPage from './pages/BlogSpecificPage';
import ProtectedRoutesComponent from './components/ProtectedRoutesComponent';
import CreatePostPage from './pages/CreatePostPage';
import NotFoundPage from './pages/404Page';
import ForgotPassword from './pages/forgot-password';
import ResetPassword from './pages/reset-password';
import { useState } from 'react';

function App() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      {isLoading && (
        <div className="loader">
          <div className="scanner">
            <span>Loading...</span>
          </div>
        </div>
      )}
      <>
        <SpeedDialComponent />
        <Router>
          <HeaderComponent />
          <Routes>
            <Route path="*" element={<NotFoundPage />} />
            <Route exact path="/" element={<HomePage setIsLoading={setIsLoading} />} />
            <Route path="/login" element={<LoginPage setIsLoading={setIsLoading} />} />
            <Route path="/register" element={<RegisterPage setIsLoading={setIsLoading} />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password-form/:id" element={<ResetPassword />} />
            <Route element={<ProtectedRoutesComponent />}>
              <Route path="/post-details/:postId" element={<BlogDescriptionPage setIsLoading={setIsLoading} />} />
              <Route path="/blogs/:tag" element={<BlogSpecificPage setIsLoading={setIsLoading} />} />
              <Route path="/user/createPost" element={<CreatePostPage setIsLoading={setIsLoading} />} />
            </Route>
          </Routes>
          <FooterComponent />
        </Router>
      </>
    </>
  );
}

export default App;
