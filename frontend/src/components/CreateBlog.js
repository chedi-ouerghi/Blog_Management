import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { createBlog } from '../features/blogs/blogSlice';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; 





const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem;
  overflow-y: auto;
  height: 100vh;
  background-color: ${({ theme }) => theme.background};
`;

const FormWrapper = styled.div`
  background-color: ${({ theme }) => theme.background};
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Input = styled.input`
  padding: 1rem;
  border: 1px solid #ccc;
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
  border-radius: 6px;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  width: 95%;
    &:focus {
    outline: none;
    border-color: #2563eb; /* Blue */
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.3);
  }
`;

const Select = styled.select`
  padding: 1rem;
  border: 1px solid #ccc;
    background-color: ${({ theme }) => theme.background};
      color: ${({ theme }) => theme.text};
  border-radius: 6px;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  width: 100%;
    &:focus {
    outline: none;
    border-color: #2563eb; /* Blue */
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.3);
  }
`;

const Textarea = styled.textarea`
  padding: 1rem;
  border: 1px solid #ccc;
      background-color: ${({ theme }) => theme.background};
      color: ${({ theme }) => theme.text};
  border-radius: 6px;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  width: 95%;
  min-height: 150px;
    &:focus {
    outline: none;
    border-color: #2563eb; /* Blue */
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.3);
  }
`;

const Button = styled.button`
  padding: 1rem;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  border: 1px solid #fff;
  border-radius: 6px;
  font-size: 1rem;
  width: fit-content;
  cursor: pointer;
  
  &:hover {
    background-color: #0056b3;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ImagePreview = styled.img`
  max-width: 200px;
  margin-bottom: 1.5rem;
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

const CreateBlog = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.blogs);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [category, setCategory] = useState('Scientific');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('pending');

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? user._id : null;


  const [isSubmitting, setIsSubmitting] = useState(false);

   const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileName = file.name;
      
      const fileExtension = fileName.split('.').pop().toLowerCase();

      
      const validExtensions = ['jpeg', 'png'];
      if (validExtensions.includes(fileExtension)) {
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
        toast.success('Image validée avec succès!');
      } else {
        toast.error('Please upload a valid image in JPEG or PNG format.');
        e.target.value = null; 
        setImage(null); 
        setImagePreview(null); 
      }
    }
  };

const handleSubmit = (e) => {
  e.preventDefault();

  
  if (!image) {
    toast.error('Please upload an image before submitting.');
    return;
  }

  if (!userId) {
    toast.error('User is not logged in!');
    return;
  }

  const formData = new FormData();
  formData.append('title', title);
  formData.append('content', content);
  formData.append('category', category);

  const tagsArray = tags.split(',').map((tag) => tag.trim()).filter((tag) => tag);
  tagsArray.forEach((tag) => formData.append('tags[]', tag));

  formData.append('status', status);
  formData.append('user', userId);
  formData.append('image', image);

  setIsSubmitting(true);

  dispatch(createBlog(formData))
    .unwrap()
    .then((response) => {
      toast.success(response.message || 'Blog created successfully and is pending administrator approval.');
      setTimeout(() => navigate('/'), 3005); 
    })
    .catch((err) => {
      toast.error('An error occurred. Please try again.');
      setIsSubmitting(false); 
    });
};

  
  return (
    <Container>
      <ToastContainer position="top-right" autoClose={3000} />

      <FormWrapper>
        <Title>Add Blog</Title>

        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Scientific">Scientific</option>
            <option value="IT">IT</option>
          </Select>

  <Input
        type="file"
        accept="image/jpeg, image/png"
        onChange={handleImageChange}
      />

          {imagePreview && <ImagePreview src={imagePreview} alt="Preview" />}

          <Input
            type="text"
            placeholder="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />

          <Textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

         <Button type="submit" disabled={isSubmitting || loading}>
  {loading ? 'Submitting...' : 'Submit'}
</Button>

        </form>

        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      </FormWrapper>
    </Container>
  );
};

export default CreateBlog;
