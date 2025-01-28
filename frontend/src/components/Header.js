import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuthToken, setAuthToken } from '../utils/auth';
import styled from 'styled-components';
import { useDarkMode } from './DarkMode'; 

const HeaderWrapper = styled.header`
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: 0.1rem;

  a {
    color: ${(props) => props.theme.text};
    text-decoration: none;
    &:hover {
      opacity: 0.9;
      transition: color 0.3s;
    }
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 600;
  color: ${(props) => props.theme.buttonText};
  background-color: ${(props) => props.theme.buttonBackground};
  transition: background-color 0.3s;

  &:hover {
    opacity: 0.9;
  }
`;

const Header = () => {
  const navigate = useNavigate();
  const token = getAuthToken();
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user && user.role === 'admin';

  const { isDarkMode, toggleDarkMode } = useDarkMode(); 

  const handleLogout = () => {
    setAuthToken(null);
    navigate('/login');
  };

  return (
    <HeaderWrapper>
      <Container>
        <Title>
          <Link to="/">Blog Platform</Link>
        </Title>

        <Nav>
          {token ? (
            <>
              {isAdmin ? (
                <Link
                  to="/admin"
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: '500',
                    color: 'inherit',
                  }}
                >
                  Admin Dashboard
                </Link>
              ) : (
                <Link
                  to="/add-blog"
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: '500',
                    color: 'inherit',
                  }}
                >
                  Create Blog
                </Link>
              )}

              <Button onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  fontSize: '1.125rem',
                  fontWeight: '500',
                  color: 'inherit',
                }}
              >
                Login
              </Link>
              <Link
                to="/signup"
                style={{
                  fontSize: '1.125rem',
                  fontWeight: '500',
                  color: 'inherit',
                }}
              >
                Signup
              </Link>
            </>
          )}
          <Button onClick={toggleDarkMode}>
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </Nav>
      </Container>
    </HeaderWrapper>
  );
};

export default Header;
