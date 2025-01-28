import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPaginatedBlogs } from '../features/blogs/blogSlice';

const BlogListWrapper = styled.div`
  padding: 16px;
  background-color: ${({ theme }) => theme.background};
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 24px;
  color: ${({ theme }) => theme.text};
  text-align: center;
`;




const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  width: 100%;
  max-width: 1200px;
  margin: 32px auto;
`;

const BlogItem = styled.div`
  background-color: ${({ theme }) => theme.background};
  border-radius: 16px;
  padding: 20px;
  box-shadow: ${({ theme }) => theme.boxShadow}; 
  overflow: hidden;
`;


const SectionTitle = styled.h4`
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 24px;
    color: #1f2937;
    cursor: pointer;
    position: relative;
    display: flex
;
    justify-content: center;
    width: 100%;
`;

const BlogImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: contain;
  border-bottom: 4px solid ${({ theme }) => theme.borderColor};
`;

const BlogContent = styled.div`
padding: 16px;
    display: flex
;
    flex-direction: column;
    align-items: flex-start;
`;



const BlogInfo = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text};
  margin-bottom: 8px;
`;

const PublishedDate = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text};
  background-color: ${({ theme }) => theme.background};
  display: inline-block;
  padding: 0;
  border-radius: 8px;
  text-align: center;
`;

const BlogLink = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 16px;
  padding: 8px 16px;
  border-radius: 8px;
  background-color:rgb(16, 22, 185);
  color: white;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    background-color:rgb(78, 95, 155);
      color: ${({ theme }) => theme.text};

  }
`;

const PageControl = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  width: 80%;
  max-width: 600px;
`;

const PageNumber = styled.p`
  font-weight: bold;
  color: ${({ theme }) => theme.text};
  margin: 0 16px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  margin-top: 24px;
`;

const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  margin-top: 24px;
`;

const Button = styled.button`
position:relative;
bottom:0%;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  background-color: ${(props) =>
    props.primary ? '#10b981' : props.disabled ? '#d1d5db' : '#ef4444'};
  color: white;
  &:hover {
    background-color: ${(props) =>
      props.primary ? '#059669' : props.disabled ? '#d1d5db' : '#dc2626'};
  }
  &:disabled {
    cursor: not-allowed;
  }
`;
const NoBlogsMessage = styled.p`
  text-align: center;
  background-color: #fef3c7;
  padding: 16px;
  border-radius: 8px;
  color: ${({ theme }) => theme.text};
  margin-bottom: 24px;
`;


const BlogList = () => {
  const dispatch = useDispatch();
  const { blogs, totalPages, loading, error } = useSelector((state) => state.blogs);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchPaginatedBlogs({ page, limit: 5 }));
  }, [dispatch, page]);

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <BlogListWrapper>
      <Title>Blogs</Title>
      {loading ? (
        <LoadingMessage>Loading blogs...</LoadingMessage>
      ) : error ? (
        <ErrorMessage>Error: {error}</ErrorMessage>
      ) : blogs.length === 0 ? (
        <NoBlogsMessage>No blogs available.</NoBlogsMessage>
      ) : (
        <BlogGrid>
          {blogs.map((blog) => (
            <BlogItem key={blog._id}>
              {blog.image && <BlogImage src={`http://localhost:6505${blog.image}`} alt={blog.title} />}
              <BlogContent>
                  <SectionTitle >{blog.title}</SectionTitle>
                <PublishedDate>
                  <span style={{ color: '#ec4899', fontWeight: 'bold' }}>Published on : </span>{new Date(blog.createdAt).toLocaleDateString()}
                </PublishedDate>
                <BlogInfo>
                  <div dangerouslySetInnerHTML={{ __html: blog.content.length > 100 ? `${blog.content.substring(0, 100)}...` : blog.content }} />
                </BlogInfo>
                <BlogInfo>
                  <span style={{ color: '#ec4899', fontWeight: 'bold' }}>Category:</span> {blog.category}
                </BlogInfo>
              
                
                <BlogLink to={`/blogs/${blog._id}`}>View Details</BlogLink>
              </BlogContent>
            </BlogItem>
          ))}
        </BlogGrid>
      )}

      <PageControl>
        <Button disabled={page === 1} onClick={handlePreviousPage}>
          Previous
        </Button>
        <PageNumber>
          Page {page} of {totalPages}
        </PageNumber>
        <Button disabled={page === totalPages} onClick={handleNextPage}>
          Next
        </Button>
      </PageControl>
    </BlogListWrapper>
  );
};

export default BlogList;
