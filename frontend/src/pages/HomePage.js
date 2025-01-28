import React from 'react';
import BlogList from '../components/BlogList';
import styled from 'styled-components';

const HomePageWrapper = styled.div`
  font-family: 'Arial', sans-serif;
  min-height: 100vh;
  padding: 20px;
`;

const HomePage = () => {
  return (
    <HomePageWrapper>
      <BlogList />
    </HomePageWrapper>
  );
};

export default HomePage;
