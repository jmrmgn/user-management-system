import jwtDecode from 'jwt-decode';

const isAuthenticated = () => {
  try {
    const token = localStorage.getItem('token');
    jwtDecode(token);
  } catch (err) {
    return false;
  }
  return true;
};

const signOut = () => {
  localStorage.removeItem('token');
};

export { isAuthenticated, signOut };
