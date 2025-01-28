import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { fetchBlogDetails, deleteBlog, updateBlog } from '../features/blogs/blogSlice';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [content, setContent] = useState("");

  const { blogDetails: blog, loading, error } = useSelector((state) => state.blogs);
  const user = JSON.parse(localStorage.getItem('user'));

  const isLoggedIn = user !== null;
  const isAdmin = user && user.role === 'admin';
  const isOwner = blog && user && blog.user._id === user._id;

  useEffect(() => {
    dispatch(fetchBlogDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (blog) setContent(blog.content || "");
  }, [blog]);

  const handleEdit = () => {
    navigate(`/edit-blog/${id}`);
  };

  const handleUpdate = async () => {
    const formData = { ...blog, content };
    try {
      await dispatch(updateBlog({ id, formData })).unwrap();
      alert("Blog updated successfully");
      navigate(`/blogs/${id}`);
    } catch (err) {
      console.error("Error updating blog:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteBlog(id)).unwrap();
      alert('Blog deleted successfully');
      navigate('/blogs');
    } catch (err) {
      console.error('Error deleting blog:', err);
    }
  };

  if (loading) return <Loading>Loading...</Loading>;
  if (error) return <Error>Error: {error}</Error>;
  if (!blog) return <NoBlog>No blog found.</NoBlog>;

  return (
    <Container>
      
              <ContentHeaderSection>

      <Title>{blog.title}</Title>

        <Section>
            <DateText>{new Date(blog.createdAt).toLocaleString()}</DateText>
      </Section>
      
      </ContentHeaderSection>
      
        <BlogContentContainer>
        {blog.image ? (
<BlogImage src={`http://localhost:6505${blog.image}`} alt={`Image for ${blog.title}`} />
        ) : (
          <p className="text-gray-500 italic mb-4">No image available</p>
        )}

        <ContentSection>
          <Section>
            <SectionTitle>Content :</SectionTitle>
            <ContentContainer>
              <ReactQuill
                value={content}
                onChange={setContent}
                readOnly={!isOwner}
                theme="snow"
                modules={{
                  toolbar: isOwner
                    ? [
                        [{ header: "1" }, { header: "2" }, { font: [] }],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["bold", "italic", "underline"],
                        [{ align: [] }],
                        ["link", "image"],
                        ["clean"],
                      ]
                    : false,
                }}
              />
            </ContentContainer>
            {isOwner && (
              <ButtonGroup>
                <SaveButton onClick={handleUpdate}>Save</SaveButton>
              </ButtonGroup>
            )}
          </Section>

                      <ContentFlexContainer>

          <Section>
            <SectionTitle>Category :</SectionTitle>
            <Category>{blog.category}</Category>
          </Section>

          <Section>
            <SectionTitle>Tags :</SectionTitle>
            <TagsList>
              {blog.tags.map((tag, index) => (
                <Tag key={index}>{tag}</Tag>
              ))}
            </TagsList>
          </Section>
</ContentFlexContainer>
        

          {isLoggedIn && (isOwner || isAdmin) && (
            <ButtonGroup>
              <EditButton onClick={handleEdit}>Edit</EditButton>
              <DeleteButton onClick={handleDelete}>Delete</DeleteButton>
            </ButtonGroup>
          )}
        </ContentSection>
      </BlogContentContainer>
    </Container>
  );
};

export default BlogDetails;

const Container = styled.div`
  padding: 40px;
  background-color: ${({ theme }) => theme.background};
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 1200px;
  margin: 25px auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border:1px solid #fff
`;

const ContentHeaderSection = styled.div`
  display: flex;
  justify-content:space-between;
  gap: 30px;
   align-items: center;

`;

const Title = styled.h2`
  font-size: 2.8rem;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
  ${'' /* margin-bottom: 20px; */}
  ${'' /* text-align: center; */}
`;

const BlogContentContainer = styled.div`
  display: flex;
  gap: 30px;
  margin-top: 20px;
`;

const BlogImage = styled.img`
  width: 400px;
  height: 500px;
  object-fit: contain;
  border-radius: 8px;
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Section = styled.div`
  margin-top: 30px;
`;

const SectionTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.secondary};
  margin-bottom: 12px;
`;

const ContentContainer = styled.div`
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;


const ContentFlexContainer = styled.div`
display: flex
;
    justify-content: flex-start;
    gap: 60px;
    align-items: flex-start;

`;


const Category = styled.p`
    font-size: 1.2rem;
  color: ${({ theme }) => theme.text};
    text-decoration: underline;
    cursor: pointer;
    text-decoration-style: inherit;
`;

const TagsList = styled.ul`
        display: flex
;
    flex-direction: column;
    margin: 0 -15px;
`;

const Tag = styled.li`
  background-color: ${({ theme }) => theme.tagBackground};
  color: ${({ theme }) => theme.tagColor};
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

`;

const DateText = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.text};
  ${'' /* margin-top: 8px; */}
  position:relative;
  right:10px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 30px;
`;

const Button = styled.button`
  padding: 12px 24px;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;

  &:hover {
    opacity: 0.8;
  }
`;

const SaveButton = styled(Button)`
  background-color: ${({ theme }) => theme.primary};
  color: white;

  &:hover {
    background-color: ${({ theme }) => theme.primaryDark};
  }
`;

const EditButton = styled(Button)`
  background-color: #4c51bf;
  color: white;

  &:hover {
    background-color: #434190;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #e53e3e;
  color: white;

  &:hover {
    background-color: #c53030;
  }
`;

const Loading = styled.div`
  text-align: center;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.primary};
`;

const Error = styled.div`
  text-align: center;
  font-size: 1.5rem;
  color: red;
`;

const NoBlog = styled.div`
  text-align: center;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.secondary};
`;
