export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};
