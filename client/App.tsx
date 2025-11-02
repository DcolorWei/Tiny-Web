import './App.css';

import DemoPage from './pages/demo/DemoPage';

import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ redirectPath = '/auth' }) => {
  // 检查 localStorage 中的 token
  const isAuthenticated = !!localStorage.getItem('token');

  return isAuthenticated ? <Outlet /> : <Navigate to={redirectPath} replace />;
};

const App = () => {
  const AuthPage = () => { return (<div></div>) }
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />

        <Route element={<PrivateRoute />}>
          <Route path="/demo" element={<DemoPage />} />
        </Route>
        <Route path="/" element={<Navigate to="/demo" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
