import React from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Shield,
  TrendingUp,
  Users,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import Button from "../components/common/Button";
import Card from "../components/common/Card";

const Home = () => {
  const features = [
    {
      icon: Shield,
      title: "AI-Powered Detection",
      description:
        "Advanced machine learning model with 99.95% accuracy to identify fake news",
    },
    {
      icon: Search,
      title: "URL & Text Analysis",
      description:
        "Analyze articles from any source - paste a URL or the article text directly",
    },
    {
      icon: TrendingUp,
      title: "Real-time Results",
      description:
        "Get instant credibility scores and detailed analysis in seconds",
    },
    {
      icon: Users,
      title: "Community Insights",
      description: "View trending sources and see what others are verifying",
    },
  ];

  const stats = [
    { label: "Accuracy Rate", value: "99.95%" },
    { label: "Articles Analyzed", value: "10K+" },
    { label: "Active Users", value: "500+" },
    { label: "Trusted Sources", value: "100+" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-primary-200 mb-6">
              <CheckCircle className="w-4 h-4 text-success-600" />
              <span className="text-sm font-medium text-primary-800">
                99.95% Accuracy
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-primary-900 mb-6">
              Detect Fake News with
              <span className="text-gradient block mt-2">
                AI-Powered Precision
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Combat misinformation with our advanced fact-checking system.
              Verify article credibility in seconds using state-of-the-art AI
              technology.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/analyze">
                <Button variant="primary" size="lg" icon={Search}>
                  Start Analyzing
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="secondary" size="lg" icon={ArrowRight}>
                  Sign Up Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary-700 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our advanced AI analyzes articles using multiple factors to
              determine credibility
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  variant="glass"
                  className="text-center hover:shadow-soft-xl transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary-700" />
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-900 mb-4">
                Simple 3-Step Process
              </h2>
            </div>

            <div className="space-y-8">
              {[
                {
                  step: "01",
                  title: "Paste Article URL or Text",
                  description:
                    "Copy the link to the article you want to verify, or paste the article text directly.",
                },
                {
                  step: "02",
                  title: "AI Analysis",
                  description:
                    "Our advanced DistilBERT model analyzes the content, structure, and patterns to determine credibility.",
                },
                {
                  step: "03",
                  title: "Get Results",
                  description:
                    "Receive a detailed credibility score with confidence levels and save to your history.",
                },
              ].map((item, index) => (
                <div key={index} className="flex gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-700 to-accent-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {item.step}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-zinc-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-6">
            Ready to Start Verifying News?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users fighting misinformation with AI-powered
            fact-checking
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/analyze">
              <Button variant="accent" size="lg" icon={Search}>
                Analyze Your First Article
              </Button>
            </Link>
            <Link to="/register">
              <button className="px-6 py-3 text-lg font-medium text-white border-2 border-white rounded-lg hover:bg-white/10 transition-colors">
                Create Free Account
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
