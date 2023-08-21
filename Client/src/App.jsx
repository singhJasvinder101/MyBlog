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

function App() {
  return (
    <>
      <SpeedDialComponent />
      <Router>
        <HeaderComponent />
        <Routes>
          <Route exact path='/' element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<ProtectedRoutesComponent />}>
            <Route path="/post-details/:postId" element={<BlogDescriptionPage />} />
            <Route path="/blogs/:tag" element={<BlogSpecificPage />} />
            <Route path="/user/createPost" element={<CreatePostPage />} />
          </Route>
        </Routes>
      </Router>
      {/* <PaginationComponent /> */}
      <FooterComponent />
    </>
  )
}

export default App
