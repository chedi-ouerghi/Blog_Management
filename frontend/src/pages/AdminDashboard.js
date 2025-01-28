import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchBlogs, approveBlog, rejectBlog, deleteBlog } from '../features/blogs/blogSlice';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 3rem;
  font-family: 'Roboto', sans-serif;
  color: ${({ theme }) => theme.text};
  background-color: ${({ theme }) => theme.background};
  height: 100%;

  @media (min-width: 768px) {
    flex-direction: row;
    height: 75vh;
  }
`;

const Sidebar = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.background};
  padding: 1rem;
  border-right: none;
  margin-bottom: 1rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;

  @media (min-width: 768px) {
    width: 230px;
    margin-right: 1rem;
    border-right: 1px solid #ddd;
  }
`;

const SidebarTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.text};
`;

const SidebarField = styled.p`
  margin-bottom: 0.5rem;
  font-size: 1rem;
  color: ${({ theme }) => theme.text};
  padding: 10px;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  font-style: italic;
  font-weight: 600;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  text-align: center;
  color: ${({ theme }) => theme.text};
  font-weight: bold;

  @media (min-width: 768px) {
    font-size: 2rem;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  background-color: ${({ theme }) => theme.background};
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.thead`
  background-color: ${({ theme }) => theme.background};

  th {
    padding: 1rem;
    text-align: left;
    font-weight: bold;
    border-bottom: 2px solid #ddd;
    border-top: 2px solid #ddd;
    font-size: 0.9rem;

    @media (min-width: 768px) {
      font-size: 1rem;
    }
  }
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: ${({ theme }) => theme.background};
  }

  &:hover {
    background-color: ${({ theme }) => theme.background};
    transition: background-color 0.3s ease;
    cursor: pointer;
    border: 2px solid #ddd;
  }
`;

const TableCell = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #ddd;
  color: ${({ theme }) => theme.text};
  font-size: 0.85rem;

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const ActionButton = styled.button`
  padding: 0.5rem 0.8rem;
  margin-right: 0.5rem;
  background-color: ${(props) =>
    props.variant === 'approve'
      ? '#4caf50'
      : props.variant === 'reject'
      ? '#f44336'
      : '#ff9800'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.9;
  }

  @media (min-width: 768px) {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
  }
`;

const LoadingMessage = styled.div`
  font-size: 1.2rem;
  text-align: center;
  margin-top: 2rem;
  color: ${({ theme }) => theme.text};
`;

function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { blogs, loading, error } = useSelector((state) => state.blogs);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found, please log in.');
      navigate('/login');
    } else {
      dispatch(fetchBlogs());
    }
  }, [dispatch, navigate]);

  if (loading) {
    return <LoadingMessage>Loading...</LoadingMessage>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
   <DashboardContainer>
      <Sidebar>
        <SidebarTitle>Dashboard Overview</SidebarTitle>
        <SidebarField>Total Blogs: {blogs.length}</SidebarField>
        <SidebarField>Pending Blogs: {blogs.filter(blog => blog.status === 'pending').length}</SidebarField>
        <SidebarField>Approved Blogs: {blogs.filter(blog => blog.status === 'approved').length}</SidebarField>
        <SidebarField>Rejected Blogs: {blogs.filter(blog => blog.status === 'rejected').length}</SidebarField>
      </Sidebar>
      <div style={{ flex: 1 }}>
        <Title>Admin Dashboard</Title>
        <Table>
          <TableHeader>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </TableHeader>
          <tbody>
            {blogs.map((blog) => (
              <TableRow key={blog._id}>
                <TableCell>{blog.title}</TableCell>
                <TableCell>{blog.category}</TableCell>
                <TableCell>{blog.status}</TableCell>
                <TableCell>
                  {blog.status === 'pending' && (
                    <>
                      <ActionButton variant="approve" onClick={() => dispatch(approveBlog(blog._id))}>
                        Approve
                      </ActionButton>
                      <ActionButton variant="reject" onClick={() => dispatch(rejectBlog(blog._id))}>
                        Reject
                      </ActionButton>
                    </>
                  )}
                  <ActionButton variant="delete" onClick={() => dispatch(deleteBlog(blog._id))}>
                    Delete
                  </ActionButton>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </div>
    </DashboardContainer>
  );
}

export default AdminDashboard;