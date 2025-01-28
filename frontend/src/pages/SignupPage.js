import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { registerUser } from '../features/auth/authSlice';

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


const SignupPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Default role is user

  const validateForm = () => {
    if (!name) {
      toast.error('Veuillez entrer votre nom.');
      return false;
    }
    if (!email) {
      toast.error('Veuillez entrer votre email.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Veuillez entrer un email valide.');
      return false;
    }
    if (!password) {
      toast.error('Veuillez entrer votre mot de passe.');
      return false;
    }
    if (password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validating form data before submission
    if (!validateForm()) {
      return;
    }

    try {
      const action = await dispatch(registerUser({ name, email, password, role }));
      if (action.type === 'auth/register/fulfilled') {
        toast.success('Inscription réussie!');
        navigate('/login'); // Redirect to login page after successful signup
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Une erreur est survenue');
    }
  };

  return (
    <Container>
      <ToastContainer position="top-right" autoClose={3000} />
      <FormContainer>
        <Title>Inscription</Title>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom"
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
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            required
          />
          <Select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="user">Utilisateur</option>
            <option value="admin">Admin</option>
          </Select>
          <Button type="submit">S'inscrire</Button>
        </Form>
      </FormContainer>
    </Container>
  );
};

export default SignupPage;
