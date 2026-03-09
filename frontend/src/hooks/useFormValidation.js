import { useState } from "react";

export const useFormValidation = (schema) => {
    const [errors, setErrors] = useState({});

    const validateField = (fieldName, value) => {
        try {
            schema.shape[fieldName].parse(value);
            setErrors((prev) => ({ ...prev, [fieldName]: null }));
        } catch (error) {
            const message = error.issues?.[0]?.message || 'err_invalid';
            setErrors(prev => ({ ...prev, [fieldName]: message }));
        }
    };

    const clearError = (fieldName) => {
        setErrors((prev) => ({ ...prev, [fieldName]: null }));
    };

    const validateAll = (data) => {
        try {
            schema.parse(data);
            setErrors({});
            return true;
        } catch (error) {
            const newErrors = {};
            error.issues?.forEach((err) => {
                const field = err.path[0];
                newErrors[field] = err.message;
            });
            setErrors(newErrors);
            return false;
        }
    };

    return { errors, validateField, clearError, validateAll };
};
