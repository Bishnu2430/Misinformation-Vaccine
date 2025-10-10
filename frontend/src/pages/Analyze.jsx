import React, { useState } from "react";
import {
  Link2,
  FileText,
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import Alert from "../components/common/Alert";
import analyzeService from "../services/analyzeService";

const Analyze = () => {
  const [inputType, setInputType] = useState("url"); // 'url' or 'text'
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      let response;

      if (inputType === "url") {
        if (!url.trim()) {
          setError("Please enter a URL");
          setLoading(false);
          return;
        }
        response = await analyzeService.analyzeUrl(url);
      } else {
        if (!text.trim() || text.trim().length < 50) {
          setError("Please enter at least 50 characters of text");
          setLoading(false);
          return;
        }
        response = await analyzeService.analyzeText(text, title);
      }

      if (response.success) {
        setResult(response.data);
      } else {
        setError(response.error || "Analysis failed");
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUrl("");
    setText("");
    setTitle("");
    setResult(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-gray-50 to-stone-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-zinc-900 mb-3">
            Analyze News Article
          </h1>
          <p className="text-lg text-gray-600">
            Enter a URL or paste article text to verify its credibility
          </p>
        </div>

        {/* Input Card */}
        <Card variant="glass" className="backdrop-blur-xl mb-6">
          {/* Input Type Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setInputType("url")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
                inputType === "url"
                  ? "bg-primary-700 text-white shadow-soft"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Link2 className="w-4 h-4" />
              URL
            </button>
            <button
              onClick={() => setInputType("text")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
                inputType === "text"
                  ? "bg-primary-700 text-white shadow-soft"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FileText className="w-4 h-4" />
              Text
            </button>
          </div>

          {error && (
            <Alert
              type="error"
              message={error}
              onClose={() => setError("")}
              className="mb-6"
            />
          )}

          {/* URL Input */}
          {inputType === "url" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Article URL
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/article"
                  className="input w-full"
                  disabled={loading}
                />
                <p className="mt-2 text-sm text-gray-500">
                  Paste the full URL of the article you want to analyze
                </p>
              </div>
            </div>
          )}

          {/* Text Input */}
          {inputType === "text" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Article Title (Optional)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter article title"
                  className="input w-full"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Article Text
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste the article text here (minimum 50 characters)"
                  rows={10}
                  className="input w-full resize-none"
                  disabled={loading}
                />
                <p className="mt-2 text-sm text-gray-500">
                  {text.length} characters (minimum 50 required)
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleAnalyze}
              loading={loading}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Analyze Article"}
            </Button>
            {(url || text || result) && (
              <Button variant="ghost" onClick={handleReset} disabled={loading}>
                Reset
              </Button>
            )}
          </div>
        </Card>

        {/* Loading State */}
        {loading && (
          <Card variant="depth" className="text-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-primary-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-zinc-900 mb-2">
              Analyzing Article...
            </h3>
            <p className="text-gray-600">
              Our AI is processing the content. This may take a few seconds.
            </p>
          </Card>
        )}

        {/* Results */}
        {result && !loading && (
          <div className="space-y-6 animate-slide-up">
            {/* Main Result Card */}
            <Card
              variant="depth"
              className={`border-l-4 ${
                result.prediction.prediction === "TRUE"
                  ? "border-success-500"
                  : "border-danger-500"
              }`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {result.prediction.prediction === "TRUE" ? (
                      <>
                        <CheckCircle className="w-8 h-8 text-success-600" />
                        <Badge
                          variant="success"
                          className="text-base px-4 py-1.5"
                        >
                          LIKELY TRUE
                        </Badge>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-8 h-8 text-danger-600" />
                        <Badge
                          variant="danger"
                          className="text-base px-4 py-1.5"
                        >
                          LIKELY FAKE
                        </Badge>
                      </>
                    )}
                  </div>

                  <h2 className="text-2xl font-serif font-bold text-zinc-900 mb-2">
                    {result.article.title}
                  </h2>

                  {result.article.source && (
                    <p className="text-sm text-gray-600">
                      Source:{" "}
                      <span className="font-medium">
                        {result.article.source}
                      </span>
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <div className="text-4xl font-bold text-primary-700">
                    {result.prediction.confidence.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Confidence</div>
                </div>
              </div>

              {/* Probability Breakdown */}
              <div className="space-y-3">
                <h3 className="font-semibold text-zinc-900">
                  Probability Breakdown
                </h3>

                {/* True Probability Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-success-700 font-medium">
                      True News
                    </span>
                    <span className="text-success-700 font-semibold">
                      {result.prediction.probabilities.true.toFixed(2)}%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-success-500 to-success-600 rounded-full transition-all duration-500"
                      style={{
                        width: `${result.prediction.probabilities.true}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Fake Probability Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-danger-700 font-medium">
                      Fake News
                    </span>
                    <span className="text-danger-700 font-semibold">
                      {result.prediction.probabilities.fake.toFixed(2)}%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-danger-500 to-danger-600 rounded-full transition-all duration-500"
                      style={{
                        width: `${result.prediction.probabilities.fake}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Article Metadata */}
            {result.article && (
              <Card variant="glass">
                <h3 className="font-semibold text-zinc-900 mb-4">
                  Article Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  {result.article.url && (
                    <div>
                      <span className="text-gray-600">URL:</span>
                      <a
                        href={result.article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-primary-700 hover:underline truncate"
                      >
                        {result.article.url}
                      </a>
                    </div>
                  )}

                  {result.article.word_count && (
                    <div>
                      <span className="text-gray-600">Word Count:</span>
                      <span className="block font-medium text-zinc-900">
                        {result.article.word_count} words
                      </span>
                    </div>
                  )}

                  {result.article.authors &&
                    result.article.authors.length > 0 && (
                      <div>
                        <span className="text-gray-600">Authors:</span>
                        <span className="block font-medium text-zinc-900">
                          {result.article.authors.join(", ")}
                        </span>
                      </div>
                    )}

                  {result.article.publish_date && (
                    <div>
                      <span className="text-gray-600">Published:</span>
                      <span className="block font-medium text-zinc-900">
                        {new Date(
                          result.article.publish_date
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Warning Message */}
            <Alert
              type="warning"
              title="Important Notice"
              message="This analysis is provided by AI and should be used as a guide. Always verify information from multiple reliable sources before drawing conclusions."
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Analyze;
