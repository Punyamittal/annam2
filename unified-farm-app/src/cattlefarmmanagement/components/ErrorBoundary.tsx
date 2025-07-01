// src/components/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { ErrorContext } from '../contexts/ErrorContext';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };
  static contextType = ErrorContext;
  declare context: React.ContextType<typeof ErrorContext>;

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    this.context.setError({
      message: error.message,
      severity: 'error',
      timestamp: Date.now()
    });
  }

  private handleRetry = () => {
    this.setState({ hasError: false });
    this.context.clearError();
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[200px] flex items-center justify-center">
          <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg max-w-lg">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-6 w-6 text-red-500" />
              <h2 className="text-lg font-semibold text-red-700">Something went wrong</h2>
            </div>
            <p className="mt-2 text-sm text-red-600">{this.state.error?.message}</p>
            <button
              onClick={this.handleRetry}
              className="mt-4 flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;