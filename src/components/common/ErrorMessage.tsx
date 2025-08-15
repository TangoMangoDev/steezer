
import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div style={{
      padding: '20px',
      border: '1px solid #dc2626',
      borderRadius: '8px',
      backgroundColor: '#fef2f2',
      color: '#dc2626',
      textAlign: 'center',
      margin: '20px 0'
    }}>
      <h3>Error</h3>
      <p>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
