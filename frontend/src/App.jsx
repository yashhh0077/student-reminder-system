import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Attendance from './pages/Attendance';
import Fees from './pages/Fees';
import Reminders from './pages/Reminders';
import Login from './pages/Login';
import Layout from './components/Layout';

function App() {
  const isAuthenticated = localStorage.getItem('token');

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Layout>
                <Dashboard />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/students"
          element={
            isAuthenticated ? (
              <Layout>
                <Students />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/attendance"
          element={
            isAuthenticated ? (
              <Layout>
                <Attendance />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/fees"
          element={
            isAuthenticated ? (
              <Layout>
                <Fees />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/reminders"
          element={
            isAuthenticated ? (
              <Layout>
                <Reminders />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;