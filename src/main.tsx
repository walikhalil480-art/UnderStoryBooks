import React, { StrictMode, Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class RootErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('eBaro Uncaught Application Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FBF9F5',
            padding: '2rem',
            textAlign: 'center',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              padding: '2.5rem',
              borderRadius: '20px',
              maxWidth: '520px',
              border: '2px solid #E2E8F0',
              boxShadow: '0 14px 35px rgba(15, 23, 42, 0.08)'
            }}
          >
            <h1
              style={{
                fontFamily: 'serif',
                fontSize: '1.85rem',
                color: '#0F172A',
                marginBottom: '0.75rem'
              }}
            >
              eBaro Digital Library
            </h1>
            <p style={{ color: '#64748B', lineHeight: 1.6, marginBottom: '1.75rem' }}>
              We encountered a temporary display issue loading this page. Click below to refresh the
              library.
            </p>
            <button
              type="button"
              onClick={() => {
                window.location.reload();
              }}
              style={{
                backgroundColor: '#059669',
                color: '#FFFFFF',
                border: 'none',
                padding: '0.85rem 2rem',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Refresh Library
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </StrictMode>
);
