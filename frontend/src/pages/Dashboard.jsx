import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, FileText } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Card from "../components/common/Card";
import LoadingSpinner from "../components/common/LoadingSpinner";
import historyService from "../services/historyService";
import userService from "../services/userService";

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState(null);
  const [globalStats, setGlobalStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [profileRes, globalRes] = await Promise.all([
        userService.getProfile(),
        historyService.getGlobalStats(),
      ]);

      if (profileRes.success) {
        setStats(profileRes.data.stats);
      }

      if (globalRes.success) {
        setGlobalStats(globalRes.data.stats);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
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
              Please sign in to view your dashboard
            </p>
            <a
              href="/login"
              className="inline-block px-6 py-3 bg-primary-700 text-white rounded-lg font-medium hover:bg-primary-800 transition-colors"
            >
              Sign In
            </a>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-gray-50 to-stone-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card variant="depth" className="py-12">
            <LoadingSpinner text="Loading dashboard..." />
          </Card>
        </div>
      </div>
    );
  }

  const userStatCards = [
    {
      title: "Total Analyses",
      value: stats?.total_analyses || 0,
      icon: FileText,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-100",
      textColor: "text-blue-700",
    },
    {
      title: "Fake Detected",
      value: stats?.fake_count || 0,
      icon: TrendingUp,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-100",
      textColor: "text-red-700",
    },
    {
      title: "True Verified",
      value: stats?.true_count || 0,
      icon: BarChart3,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-100",
      textColor: "text-green-700",
    },
    {
      title: "Avg Confidence",
      value: stats?.avg_confidence
        ? `${parseFloat(stats.avg_confidence).toFixed(1)}%`
        : "0%",
      icon: Users,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-100",
      textColor: "text-purple-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-gray-50 to-stone-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-zinc-900 mb-3">
            Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Track your analysis statistics and insights
          </p>
        </div>

        {/* User Stats */}
        <div className="mb-8">
          <h2 className="text-2xl font-serif font-bold text-zinc-900 mb-4">
            Your Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {userStatCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={index}
                  variant="glass"
                  className="hover:shadow-soft-xl transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}
                    >
                      <Icon className={`w-6 h-6 ${stat.textColor}`} />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-zinc-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.title}</div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Distribution Chart */}
        {stats && (stats.fake_count > 0 || stats.true_count > 0) && (
          <Card variant="glass" className="mb-8">
            <h3 className="text-xl font-serif font-bold text-zinc-900 mb-6">
              Your Analysis Distribution
            </h3>
            <div className="space-y-4">
              {/* Fake Bar */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">
                    Fake News Detected
                  </span>
                  <span className="font-semibold text-danger-700">
                    {stats.fake_count} (
                    {((stats.fake_count / stats.total_analyses) * 100).toFixed(
                      1
                    )}
                    %)
                  </span>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-danger-500 to-danger-600 transition-all duration-500"
                    style={{
                      width: `${
                        (stats.fake_count / stats.total_analyses) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* True Bar */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">
                    True News Verified
                  </span>
                  <span className="font-semibold text-success-700">
                    {stats.true_count} (
                    {((stats.true_count / stats.total_analyses) * 100).toFixed(
                      1
                    )}
                    %)
                  </span>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-success-500 to-success-600 transition-all duration-500"
                    style={{
                      width: `${
                        (stats.true_count / stats.total_analyses) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Global Stats */}
        {globalStats && (
          <div>
            <h2 className="text-2xl font-serif font-bold text-zinc-900 mb-4">
              Global Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card variant="glass">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-700 mb-2">
                    {globalStats.total_analyses?.toLocaleString() || 0}
                  </div>
                  <div className="text-sm text-gray-600">Total Analyses</div>
                </div>
              </Card>

              <Card variant="glass">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-700 mb-2">
                    {globalStats.unique_users?.toLocaleString() || 0}
                  </div>
                  <div className="text-sm text-gray-600">Active Users</div>
                </div>
              </Card>

              <Card variant="glass">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-700 mb-2">
                    {globalStats.unique_articles?.toLocaleString() || 0}
                  </div>
                  <div className="text-sm text-gray-600">Unique Articles</div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Empty State */}
        {stats && stats.total_analyses === 0 && (
          <Card variant="depth" className="text-center py-12 mt-8">
            <h3 className="text-xl font-semibold text-zinc-900 mb-2">
              No Data Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start analyzing articles to see your statistics
            </p>
            <a
              href="/analyze"
              className="inline-block px-6 py-3 bg-primary-700 text-white rounded-lg font-medium hover:bg-primary-800 transition-colors"
            >
              Analyze Your First Article
            </a>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
