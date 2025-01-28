import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authSlice';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

// donne moi le css du cette from
const Form = styled.form`
display: flex;
flex-direction: column;
align-items: center;
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
    background-color: #6a11cb;
  }

  &:disabled {
    background-color: #a1a1a1;
    cursor: not-allowed;
  }
`;


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state) => state.auth);

  const validateForm = () => {
    if (!email) {
      toast.error('Veuillez entrer votre email.');
      return false;
    }
    if (!password) {
      toast.error('Veuillez entrer votre mot de passe.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Veuillez entrer un email valide.');
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
        toast.error('Échec de la connexion. Vérifiez vos identifiants.');
      }
    });
  };


  return (
    <Container>
      <ToastContainer position="top-right" autoClose={3000} />
      <FormContainer>
        <Title>Connexion</Title>
        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Chargement...' : 'Se connecter'}
          </Button>
        </Form>
      </FormContainer>
    </Container>
  );
};


export default LoginPage;
