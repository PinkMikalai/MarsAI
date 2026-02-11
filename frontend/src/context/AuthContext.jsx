import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../service/authService";

//systéme d'authentification global : les infos de connexions sont accaessibles partourt dans l'appli

const AuthContext = createContext(); // initialisation d'un systéme d'authenfication vide 

// AuthProvider : stocke les infos user, gére le login et le logout, fourni les infos à toute l'appli
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    // au chargement de l'application :
    useEffect(() => { 
        // verification de l'état de connction du user
        const checkAuth = async () => {
            try {
                // récupération des données dans le localstorage
                const token = localStorage.getItem('token');
                const user = localStorage.getItem('user');
                // on vérifie la présence et la validité du token pour actualiser les infos du user
                if (token && user) {
                    // les infos user (string ) sont converties en objet
                    setUser(JSON.parse(user));
                    try {
                        const data = await authService.profile();
                        setUser(data.result || data);
                    } catch (error) {
                        console.error("Server error")
                    }
                }
            // en cas d'erreur grave : le localstorage est vidé
            } catch (error) {
                console.error("Failure during connecting", error.message);
                localStorage.removeItem('token');
                localStorage.removeItem('user');

            } finally {
                setLoading(false);

            }
        }; checkAuth()
    }, []);


    const login = (token, userData) => {
        console.log("Context - Début du stockage", { token, userData });
        // nettoyage du token 
        const cleanToken = typeof token === 'object' ? (token.token || token.access_token) : token;
        // stockage token et user dans le local storage
        localStorage.setItem('token', cleanToken);
        if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
        }
        // actulisation du user
        setUser(userData);
        
    }
    // Logout: supprime les données stockèe dans le localstorage et déconnecte le user
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    }
    // toutes les données fournies, réutilisables partout
    const userValue = {
        user, login, logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'Admin',
        isSuperAdmin: user?.role === 'Super_admin',
        isSelector: user?.role === 'Selector'

    }
    // Gestion du loading du chargement des données
    if (loading) {
        return (
            <div className="loader-container">
                <div className="loader-spinner"></div>
                <p className="loader-text">Loading...</p>
            </div>
        )
    }

    // Le context est déployé sur toute l'application
    return (
        <AuthContext.Provider value={userValue}>
            {children}
        </AuthContext.Provider>
    );

}
// utilisation facilitée du contexte
export const useAuth = () => {
const context = useContext(AuthContext);
if (!context) {
    throw new Error("useAuth must be used into AuthProvider");
}
return context;
}
    