import { useState } from "react";

export const useFormValidation = (schema) => {
    const [errors, setErrors] = useState({});
    
    // Quand l'utilisateur quitte un champ → valider
    const validateField = (fieldName, value) => {
        try {
            schema.shape[fieldName].parse(value); // on demande à zod de vérifier uniquement la règle associée à ce champs 
            setErrors((prev) => ({ ...prev, [fieldName]: null }));
        } catch (error) {
            // Chercher le message dans toutes les erreurs Zod
            const message = error.issues?.[0]?.message || 'Valeur invalide';
            
            console.log('message extrait:', message);

            setErrors(prev => ({
                ...prev,
                [fieldName]: message
            }));
        }
    };
    
    // Quand l'utilisateur retape → effacer l'erreur
    const clearError = (fieldName) => {
        setErrors((prev) => ({ ...prev, [fieldName]: null }));
    };
    // Quand l'utilisateur clique sur "Suivant" → tout valider
    const validateAll = (data) => {
        try {
            schema.parse(data);
            setErrors({});
            return true;
        } catch (error) {
            const newErrors = {};
            error.issues?.forEach((err) => {
                const field = issue.path[0];
                newErrors[field] = issue.message;
            });
            setErrors(newErrors);
            return false;
        }
    };
    return { errors, validateField, clearError, validateAll };
};
