import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authSlice';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
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

const ToggleButton = styled.span`
  position: absolute;
  top: 40%;
  right: 0;
  transform: translateY(-50%);
  font-size: 1.25rem;
  cursor: pointer;
  user-select: none;
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

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state) => state.auth);

  const validateForm = () => {
    if (!email) {
      toast.error('Please enter your email.');
      return false;
    }
    if (!password) {
      toast.error('Please enter your password.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    dispatch(loginUser({ email, password })).then((action) => {
      if (!action.error) {
        const userRole = action.payload.role;
        if (userRole === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        toast.error('Login failed. Please check your credentials.');
      }
    });
  };

  return (
    <Container>
      <ToastContainer position="top-right" autoClose={3000} />
      <FormContainer>
        <Title>Login</Title>
        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputWrapper>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <ToggleButton onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </ToggleButton>
          </InputWrapper>
          <Button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Submit'}
          </Button>
        </Form>
      </FormContainer>
    </Container>
  );
};

export default LoginPage;
