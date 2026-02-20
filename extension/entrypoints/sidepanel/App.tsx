import React from 'react';
import { MemoryRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LinksManager from './LinksManager';
import Login from './Login';

// Componente para proteger rotas
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    // Redireciona para login, mas salva a localização que tentou acessar
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Componente para redirecionar se já estiver logado
const PublicRoute = ({ children }: { children: React.ReactElement }) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    return <Navigate to="/links" replace />;
  }

  return children;
};

export function App() {
  return (
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<Navigate to="/links" replace />} />
        
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        
        <Route path="/links" element={
          <ProtectedRoute>
            <LinksManager />
          </ProtectedRoute>
        } />
      </Routes>
    </MemoryRouter>
  );
}
