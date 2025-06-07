// frontend/src/pages/HomePage.js
import React, { useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import '../styles/HomePage.css';

function HomePage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const featureRefs = useRef([]);
    const stepRefs = useRef([]);

    const handleDeclareLoss = () => {
        if (user) {
            navigate('/declaration/new');
        } else {
            navigate('/auth');
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.1 }
        );

        featureRefs.current.forEach((ref) => observer.observe(ref));
        stepRefs.current.forEach((ref) => observer.observe(ref));

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        // Si l'utilisateur est connecté et qu'il y a un message de bienvenue
        if (user && location.state?.message) {
            toast.success(location.state.message);
        }
    }, [user, location.state, navigate]);

    const renderHeroContent = () => {
        if (user?.role === 'commissariat_agent') {
            return (
                <div className="hero-content">
                    <h1>Bienvenue Agent {user.firstName}</h1>
                    <p>Vous êtes connecté au commissariat de {user.commissariat?.name || 'votre commissariat'}. Gérez et suivez les déclarations de perte en temps réel.</p>
                    <div className="hero-buttons">
                        <Link to="/commissariat-dashboard" className="hero-btn primary-btn">
                            Gérer les déclarations
                        </Link>
                        <Link to="/commissariat-dashboard/statistics" className="hero-btn secondary-btn">
                            Voir les statistiques
                        </Link>
                    </div>
                </div>
            );
        }

        if (user?.role === 'admin') {
            return (
                <div className="hero-content">
                    <h1>Bienvenue Administrateur {user.firstName}</h1>
                    <p>Vous avez accès au panneau d'administration. Gérez les commissariats, les agents et les utilisateurs de la plateforme.</p>
                    <div className="hero-buttons">
                        <Link to="/admin-dashboard" className="hero-btn primary-btn">
                            Accéder au panneau d'administration
                        </Link>
                    </div>
                </div>
            );
        }

        if (user) {
            return (
                <div className="hero-content">
                    <h1>Bienvenue {user.firstName}</h1>
                    <p>Vous êtes connecté à votre espace personnel. Déclarez une perte ou consultez vos déclarations existantes en quelques clics.</p>
                    <div className="hero-buttons">
                        <button 
                            onClick={handleDeclareLoss}
                            className="hero-btn primary-btn"
                        >
                            Déclarer une perte
                        </button>
                        <Link to="/user-dashboard" className="hero-btn secondary-btn">
                            Accéder à mon tableau de bord
                        </Link>
                    </div>
                </div>
            );
        }

        // Page d'accueil pour les visiteurs non connectés
        return (
            <div className="hero-content">
                <h1>Déclaration de Perte en Ligne</h1>
                <p>Simplifiez vos démarches administratives. Déclarez vos objets perdus ou personnes disparues en quelques clics et suivez l'avancement de votre dossier en temps réel.</p>
                <div className="hero-buttons">
                    <button 
                        onClick={handleDeclareLoss}
                        className="hero-btn primary-btn"
                    >
                        Déclarer une perte
                    </button>
                    <Link to="/auth" className="hero-btn secondary-btn">
                        Se connecter
                    </Link>
                    <Link to="/auth?mode=register" className="hero-btn secondary-btn">
                        S'inscrire
                    </Link>
                </div>
            </div>
        );
    };

    return (
        <>
            <section className="hero-section">
                {renderHeroContent()}
            </section>

            {!user || user.role === 'user' ? (
                <>
                    <section className="features-section">
                        <div className="features-grid">
                            <div className="feature-card" ref={el => featureRefs.current[0] = el}>
                                <div className="feature-icon">📝</div>
                                <h3>Déclaration Simple</h3>
                                <p>Créez facilement une déclaration de perte en quelques minutes avec notre formulaire intuitif.</p>
                            </div>
                            <div className="feature-card" ref={el => featureRefs.current[1] = el}>
                                <div className="feature-icon">🔍</div>
                                <h3>Suivi en Temps Réel</h3>
                                <p>Suivez l'état de votre déclaration et recevez des notifications sur son avancement.</p>
                            </div>
                            <div className="feature-card" ref={el => featureRefs.current[2] = el}>
                                <div className="feature-icon">📱</div>
                                <h3>Accessible Partout</h3>
                                <p>Accédez à votre espace personnel depuis n'importe quel appareil, à tout moment.</p>
                            </div>
                        </div>
                    </section>

                    <section className="how-it-works">
                        <div className="steps-container">
                            <div className="step" ref={el => stepRefs.current[0] = el}>
                                <div className="step-number">1</div>
                                <div className="step-content">
                                    <h3>Créez votre compte</h3>
                                    <p>Inscrivez-vous gratuitement en quelques clics pour accéder à toutes les fonctionnalités.</p>
                                </div>
                            </div>
                            <div className="step" ref={el => stepRefs.current[1] = el}>
                                <div className="step-number">2</div>
                                <div className="step-content">
                                    <h3>Remplissez la déclaration</h3>
                                    <p>Décrivez votre perte ou la disparition en détail avec notre formulaire simple et complet.</p>
                                </div>
                            </div>
                            <div className="step" ref={el => stepRefs.current[2] = el}>
                                <div className="step-number">3</div>
                                <div className="step-content">
                                    <h3>Suivez l'avancement</h3>
                                    <p>Consultez régulièrement l'état de votre déclaration et recevez des mises à jour.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            ) : null}
        </>
    );
}

export default HomePage;