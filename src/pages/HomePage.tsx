
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard as main page
    navigate('/dashboard');
  }, [navigate]);

  return null;
};

export default HomePage;
