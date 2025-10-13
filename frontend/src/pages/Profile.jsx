import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Calendar,
  BarChart3,
  TrendingUp,
  Award,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Badge from "../components/common/Badge";
import userService from "../services/userService";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await userService.getProfile();

      if (response.success) {
        setProfileData(response.data);
      }
    } catch (err) {
      setError("Failed to load profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-gray-50 to-stone-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card variant="depth" className="py-12">
            <LoadingSpinner text="Loading profile..." />
          </Card>
        </div>
      </div>
    );
  }

  const stats = profileData?.stats || {};
  const userInfo = profileData?.user || user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-gray-50 to-stone-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-zinc-900 mb-3">
            Profile
          </h1>
          <p className="text-lg text-gray-600">
            Manage your account and view your statistics
          </p>
        </div>

        {/* Profile Card */}
        <Card variant="glass" className="backdrop-blur-xl mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-700 to-accent-600 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-serif font-bold text-zinc-900 mb-2">
                {userInfo.username}
              </h2>

              <div className="space-y-2 text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{userInfo.email}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Member since{" "}
                    {new Date(userInfo.created_at).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="success">Active Member</Badge>
                {stats.total_analyses >= 10 && (
                  <Badge variant="warning">
                    <Award className="w-3 h-3" />
                    Analyzer
                  </Badge>
                )}
                {stats.total_analyses >= 50 && (
                  <Badge variant="default">
                    <TrendingUp className="w-3 h-3" />
                    Expert
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Statistics */}
        <Card variant="glass" className="mb-6">
          <h3 className="text-xl font-serif font-bold text-zinc-900 mb-6">
            Your Statistics
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-3xl font-bold text-primary-700 mb-1">
                {stats.total_analyses || 0}
              </div>
              <div className="text-sm text-gray-600">Total Analyses</div>
            </div>

            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-3xl font-bold text-danger-600 mb-1">
                {stats.fake_count || 0}
              </div>
              <div className="text-sm text-gray-600">Fake Detected</div>
            </div>

            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-3xl font-bold text-success-600 mb-1">
                {stats.true_count || 0}
              </div>
              <div className="text-sm text-gray-600">True Verified</div>
            </div>

            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-3xl font-bold text-accent-600 mb-1">
                {stats.avg_confidence
                  ? parseFloat(stats.avg_confidence).toFixed(0)
                  : 0}
                %
              </div>
              <div className="text-sm text-gray-600">Avg Confidence</div>
            </div>
          </div>
        </Card>

        {/* Analysis Distribution */}
        {stats.total_analyses > 0 && (
          <Card variant="glass" className="mb-6">
            <h3 className="text-xl font-serif font-bold text-zinc-900 mb-6">
              Analysis Distribution
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">Fake News</span>
                  <span className="font-semibold text-danger-700">
                    {((stats.fake_count / stats.total_analyses) * 100).toFixed(
                      1
                    )}
                    %
                  </span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
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

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">True News</span>
                  <span className="font-semibold text-success-700">
                    {((stats.true_count / stats.total_analyses) * 100).toFixed(
                      1
                    )}
                    %
                  </span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
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

        {/* Quick Actions */}
        <Card variant="glass">
          <h3 className="text-xl font-serif font-bold text-zinc-900 mb-4">
            Quick Actions
          </h3>

          <div className="grid md:grid-cols-3 gap-3">
            <Button
              variant="primary"
              className="w-full"
              onClick={() => navigate("/analyze")}
            >
              Analyze Article
            </Button>

            <Button
              variant="secondary"
              className="w-full"
              onClick={() => navigate("/history")}
            >
              View History
            </Button>

            <Button
              variant="secondary"
              className="w-full"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </Button>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button variant="danger" className="w-full" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
