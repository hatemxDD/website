import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FaEnvelope, FaLock } from "react-icons/fa";
import "./Login.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      console.log("Attempting login with:", { email, password });
      const user = await login(email, password);
      console.log("Login successful, user:", user);

      // Navigate based on user role
      navigate(`/dashboard/${user.role}`);
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to login. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back</h2>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          <div className="input-group">
            <label htmlFor="email-address">Email address</label>
            <div className="input-icon">
              <FaEnvelope />
            </div>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="input-field"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-icon">
              <FaLock />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="input-field"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="submit-button"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>

          <div className="register-link">
            <Link to="/register">
              Don't have an account? Sign up
            </Link>
          </div>
        </form>

        <div className="test-credentials">
          <h3>Test Credentials</h3>
          <div className="credential-item">
            <span className="credential-label">LabLeader:</span>
            <span className="credential-value">sarah.johnson@university.edu / LabLeader123!</span>
          </div>
          <div className="credential-item">
            <span className="credential-label">TeamLeader:</span>
            <span className="credential-value">michael.chen@university.edu / TeamLead123!</span>
          </div>
          <div className="credential-item">
            <span className="credential-label">TeamMember:</span>
            <span className="credential-value">alex.thompson@university.edu / Member123!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
