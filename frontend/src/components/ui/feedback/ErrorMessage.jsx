const ErrorMessage = ({ error }) => {
    if (!error) return null;
    
    return (
    <span style={{
        color: '#DC2626',
        fontSize: '0.8rem',
        marginTop: '4px',
        display: 'block'
        }}>
        ⚠️ {error}
        </span>
        );
};

export default ErrorMessage;