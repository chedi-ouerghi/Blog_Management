import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogDetails, updateBlog } from '../features/blogs/blogSlice';
import { toast, ToastContainer } from 'react-toastify';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.background};
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
  margin-bottom: 2rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563; /* Gray */
  margin-bottom: 0.5rem;
  display: block;
`;

const Input = styled.input`
  width: 95%;
  padding: 0.75rem;
    background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};

  border: 1px solid #d1d5db; /* Light Gray */
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #2563eb; /* Blue */
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.3);
  }
`;

const Select = styled.select`
  width: 95%;
    background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};

  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.3);
  }
`;

const Textarea = styled.textarea`
  width: 95%;
    background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};

  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 1rem;
  min-height: 150px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.3);
  }
`;

const Button = styled.button`
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
 border: 1px solid #fff;
  font-size: 1.125rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color:rgb(122, 138, 182);
    color:#000;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.3);
  }
`;

const ImagePreview = styled.img`
  max-width: 200px;
  margin-bottom: 1rem;
  height:200px;
`;

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { blogDetails, loading, error } = useSelector((state) => state.blogs);
  const [title, setTitle] = useState(blogDetails?.title || '');
  const [content, setContent] = useState(blogDetails?.content || '');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [category, setCategory] = useState(blogDetails?.category || 'Scientific');
  const [tags, setTags] = useState(blogDetails?.tags.join(', ') || '');
  const [status, setStatus] = useState(blogDetails?.status || 'pending');
  const [existingImage, setExistingImage] = useState(blogDetails?.image || null);

  useEffect(() => {
    if (id) {
      dispatch(fetchBlogDetails(id)); 
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (blogDetails) {
      setTitle(blogDetails.title);
      setCategory(blogDetails.category);
      setTags(blogDetails.tags.join(', '));
      setStatus(blogDetails.status);
      setContent(blogDetails.content);
      setExistingImage(blogDetails.image);
    }
  }, [blogDetails]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', category);

    const tagsArray = tags.split(',').map((tag) => tag.trim()).filter(tag => tag);
    tagsArray.forEach((tag) => formData.append('tags[]', tag));

    formData.append('status', status);

    if (image) {
      formData.append('image', image);
    }

    try {
      await dispatch(updateBlog({ id, formData }));
      toast.success('Blog updated successfully!'); 
      setTimeout(() => {
        navigate('/'); 
      }, 3005); 
    } catch (error) {
      console.error('Error submitting blog:', error.response ? error.response.data : error.message);
      toast.error('An error occurred. Please try again.'); 
    }
  };

  return (
    <Container>
            <ToastContainer position="top-right" autoClose={3000} />

      <form onSubmit={handleSubmit}>
        <Title>Edit Blog</Title>

        <div>
          <Label>Title</Label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <Label>Category</Label>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Scientific">Scientific</option>
            <option value="IT">IT</option>
          </Select>
        </div>

        {existingImage && (
          <div>
            <Label>Current Image</Label>
            <ImagePreview src={`http://localhost:6505${existingImage}`} alt="Current BlogImage" />
            <p>Note: You cannot upload a new image.</p>
          </div>
        )}

        <div>
          <Label>Upload New Image (Optional)</Label>
          <Input
            type="file"
            accept="image/jpeg, image/png"
            onChange={(e) => {
              const file = e.target.files[0];
              setImage(file);
              setImagePreview(URL.createObjectURL(file));
            }}
          />
        </div>

        {imagePreview && <ImagePreview src={imagePreview} alt="Preview" />}

        <div>
          <Label>Tags</Label>
          <Input
            type="text"
            placeholder="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <div>
          <Label>Content</Label>
          <Textarea
            hidden
            placeholder="Enter the content here"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <p>Edit the content in the text area above to update the blog post details.</p>
        </div>

        <div>
          <Button type="submit">Update Blog</Button>
        </div>
      </form>
    </Container>
  );
};

export default EditBlog;

