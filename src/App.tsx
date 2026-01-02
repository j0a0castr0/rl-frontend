import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './auth/ProtectedRoute';
import PublicBookingPage from './pages/PublicBookingPage';
import VisitsPage from './pages/VisitsPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/visits"
          element={
            <ProtectedRoute>
              <VisitsPage />
            </ProtectedRoute>
          }
        />

        <Route path="/public/:listingId" element={<PublicBookingPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;