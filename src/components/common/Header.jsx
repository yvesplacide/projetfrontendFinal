// frontend/src/components/common/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { FaBars, FaTimes } from 'react-icons/fa';
import '../../styles/Header.css';

function Header() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth');
    toast.info('Déconnexion réussie');
    setIsMobileMenuOpen(false); // Fermer le menu mobile après déconnexion
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/" onClick={closeMobileMenu}>Déclaration de Perte</Link>
      </div>
      
      {/* Bouton hamburger pour mobile */}
      <button 
        className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={toggleMobileMenu}
        aria-label="Basculer le menu"
      >
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <nav className={`header-nav-flex ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        {user ? (
          <>
            {/* Liens spécifiques au rôle */}
            {user.role === 'user' && (
              <div className="nav-links-container">
                <Link to="/user-dashboard" onClick={closeMobileMenu}>Mon Tableau de Bord</Link>
                <Link to="/declaration/new" className="new-declaration-link" onClick={closeMobileMenu}>Nouvelle déclaration</Link>
                <span className="user-info">Bienvenue, {user.firstName} ({user.role})</span>
                <button onClick={handleLogout} className="btn text-btn header-logout-btn">Déconnexion</button>
              </div>
            )}
            {user.role === 'commissariat_agent' && (
              <div className="nav-links-container">
                <Link to="/commissariat-dashboard" onClick={closeMobileMenu}>Gérer les Déclarations</Link>
                <span className="user-info">Bienvenue, {user.firstName} ({user.role})</span>
                <button onClick={handleLogout} className="btn text-btn header-logout-btn">Déconnexion</button>
              </div>
            )}
            {user.role === 'admin' && (
              <div className="nav-links-container">
                <Link to="/admin-dashboard" onClick={closeMobileMenu}>Administration</Link>
                <span className="user-info">Bienvenue, {user.firstName} ({user.role})</span>
                <button onClick={handleLogout} className="btn text-btn header-logout-btn">Déconnexion</button>
              </div>
            )}

            {/* Informations utilisateur et bouton de déconnexion pour les autres rôles */}
            {user.role !== 'commissariat_agent' && user.role !== 'user' && user.role !== 'admin' && (
              <div className="nav-links-container">
                <span className="user-info">Bienvenue, {user.firstName} ({user.role})</span>
                <button onClick={handleLogout} className="btn text-btn header-logout-btn">Déconnexion</button>
              </div>
            )}
          </>
        ) : (
          // Liens séparés pour la connexion et l'inscription
          <div className="nav-links-container">
            <Link to="/auth?mode=login" className="auth-link login-link" onClick={closeMobileMenu}>Connexion</Link>
            <Link to="/auth?mode=register" className="auth-link register-link" onClick={closeMobileMenu}>Inscription</Link>
          </div>
        )}
      </nav>

      {/* Overlay pour fermer le menu mobile */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
      )}
    </header>
  );
}

export default Header;