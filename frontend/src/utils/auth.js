import jwtDecode from 'jwt-decode';

const decodeToken = () => {
  const token = localStorage.getItem('token');
  return jwtDecode(token);
};

const isAuthenticated = () => {
  try {
    decodeToken();
  } catch (err) {
    return false;
  }
  return true;
};

const currentUser = () => {
  try {
    const { id } = decodeToken();
    return id;
  } catch (err) {
    return null;
  }
};

const signOut = client => {
  localStorage.removeItem('token');
  client.cache.reset();
};

export { isAuthenticated, signOut, currentUser };
