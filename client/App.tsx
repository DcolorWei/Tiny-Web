import './App.css';

import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import DemoPage from './pages/demo/DemoPage';
import { useEffect } from 'react';

const Main = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/demo")
  }, []);
  return (
    <div>
    </div>
  );
}


const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Main />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
