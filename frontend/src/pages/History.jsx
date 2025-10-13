import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink,
  Search,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Alert from "../components/common/Alert";
import Button from "../components/common/Button";
import historyService from "../services/historyService";

const History = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      fetchHistory();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await historyService.getMyHistory(20, 0);

      if (response.success) {
        setHistory(response.data.history || []);
      } else {
        setError("Failed to load history");
      }
    } catch (err) {
      console.error("History fetch error:", err);
      setError(
        err.response?.data?.error || err.message || "Failed to load history"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-gray-50 to-stone-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card variant="depth" className="text-center py-12">
            <h2 className="text-2xl font-serif font-bold text-zinc-900 mb-4">
              Sign In Required
            </h2>
            <p className="text-gray-600 mb-6">
              Please sign in to view your analysis history
            </p>
            <Button variant="primary" onClick={() => navigate("/login")}>
              Sign In
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-gray-50 to-stone-100 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card variant="depth" className="py-12">
            <LoadingSpinner text="Loading history..." />
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-gray-50 to-stone-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-zinc-900 mb-3">
            Analysis History
          </h1>
          <p className="text-lg text-gray-600">
            View your past article analyses and results
          </p>
        </div>

        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError("")}
            className="mb-6"
          />
        )}

        {history.length === 0 ? (
          <Card variant="depth" className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-900 mb-2">
              No History Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start analyzing articles to build your history
            </p>
            <Button
              variant="primary"
              onClick={() => navigate("/analyze")}
              icon={Search}
            >
              Analyze Article
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <Card
                key={item.id}
                variant="glass"
                hover
                className={`border-l-4 ${
                  item.prediction === "TRUE"
                    ? "border-success-500"
                    : "border-danger-500"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Icon & Badge */}
                  <div className="flex items-center gap-3 lg:w-48 flex-shrink-0">
                    {item.prediction === "TRUE" ? (
                      <>
                        <CheckCircle className="w-6 h-6 text-success-600 flex-shrink-0" />
                        <Badge variant="success">TRUE</Badge>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6 text-danger-600 flex-shrink-0" />
                        <Badge variant="danger">FAKE</Badge>
                      </>
                    )}
                  </div>

                  {/* Article Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-zinc-900 mb-1 truncate">
                      {item.title || "User provided text"}
                    </h3>
                    {item.source_domain && (
                      <p className="text-sm text-gray-600">
                        Source: {item.source_domain}
                      </p>
                    )}
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-700 hover:underline inline-flex items-center gap-1 mt-1"
                      >
                        View original
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 text-sm flex-shrink-0">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-700">
                        {!isNaN(Number(item.confidence))
                          ? Number(item.confidence).toFixed(1)
                          : "0"}
                        %
                      </div>
                      <div className="text-gray-600 text-xs">Confidence</div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span className="whitespace-nowrap">
                          {new Date(item.analyzed_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
