import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { registerUser } from '../features/auth/authSlice';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.background};
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const FormContainer = styled.div`
  background-color: ${({ theme }) => theme.background};
  border-radius: 12px;
  padding: 3rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h2`
  text-align: center;
  color: ${({ theme }) => theme.text};
  font-size: 2rem;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const Input = styled.input`
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 1rem;
  width: 100%;
  transition: all 0.3s ease;

  &:focus {
    border-color: #2575fc;
    outline: none;
    box-shadow: 0 0 5px rgba(37, 117, 252, 0.3);
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 1rem;
  width: 50%;
  transition: all 0.3s ease;

  &:focus {
    border-color: #2575fc;
    outline: none;
    box-shadow: 0 0 5px rgba(37, 117, 252, 0.3);
  }
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const ToggleButton = styled.span`
position: absolute;
    right: 0;
    top: 60%;
    transform: translateY(-50%);
    font-size: 1.5rem;
    cursor: pointer;
  color: #666;

  &:hover {
    color: #2575fc;
  }
`;
const Button = styled.button`
  padding: 0.75rem;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  border: none;
  border-radius: 8px;
  font-size: 1.125rem;
  width: 100%;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color:rgb(20, 42, 129);
    color:#fff;
      }

  &:disabled {
    background-color: #a1a1a1;
    cursor: not-allowed;
  }
`;


const SignupPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    if (!name) {
      toast.error('Please enter your name.');
      return false;
    }
    if (!email) {
      toast.error('Please enter your email.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.');
      return false;
    }
    if (!password) {
      toast.error('Please enter your password.');
      return false;
    }
    if (password.length < 6) {
      toast.error('The password must be at least 6 characters long.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (!validateForm()) {
      return;
    }

    try {
      const action = await dispatch(registerUser({ name, email, password, role }));
      if (action.type === 'auth/register/fulfilled') {
        toast.success('Registration successful!');
        navigate('/login'); 
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <Container>
      <ToastContainer position="top-right" autoClose={3000} />
      <FormContainer>
        <Title>Sign Up</Title>
        <Form onSubmit={handleSubmit}>
          <InputWrapper>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              required
            />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <ToggleButton onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </ToggleButton>

            <Select value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </Select>
          </InputWrapper>
          <Button type="submit">Submit</Button>
        </Form>
      </FormContainer>
    </Container>
  );
};

export default SignupPage;

