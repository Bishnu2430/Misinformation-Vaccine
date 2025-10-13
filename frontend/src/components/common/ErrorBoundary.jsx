import React from "react";
import Card from "./Card";
import Button from "./Button";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-stone-50 via-gray-50 to-stone-100 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card variant="depth" className="p-8">
              <h2 className="text-2xl font-serif font-bold text-danger-700 mb-4">
                Oops! Something went wrong
              </h2>
              <p className="text-gray-600 mb-4">
                The page encountered an error. Please try refreshing.
              </p>
              {this.state.error && (
                <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
                  <p className="text-sm text-red-800 font-mono">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  onClick={() => (window.location.href = "/")}
                >
                  Go Home
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => window.location.reload()}
                >
                  Refresh Page
                </Button>
              </div>
            </Card>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
