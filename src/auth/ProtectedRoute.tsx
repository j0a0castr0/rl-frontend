import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

type Props = {
    children: React.ReactNode;
  };
  
  const ProtectedRoute: React.FC<Props> = ({ children }) => {
    const { accessToken } = useAuth();
  
    if (!accessToken) {
      return <Navigate to="/login" replace />;
    }
  
    return <>{children}</>;
  };
  
  export default ProtectedRoute;