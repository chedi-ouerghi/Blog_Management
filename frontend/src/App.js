import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { useDarkMode } from './components/DarkMode';
import { lightTheme, darkTheme } from './styles/theme';
import GlobalStyles from './styles/GlobalStyles';
import HomePage from './pages/HomePage';
import BlogDetails from './components/BlogDetails';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Header from './components/Header';
import EditBlog from './components/EditBlog';
import CreateBlog from './components/CreateBlog';
import Footer from './components/Footer';

const App = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyles />
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blogs/:id" element={<BlogDetails />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/add-blog" element={<CreateBlog />} />
          <Route path="/edit-blog/:id" element={<EditBlog />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
          <Footer />
      </Router>
    </ThemeProvider>
  );
};

export default App;
