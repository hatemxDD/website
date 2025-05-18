import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Common/Navbar";
import AppRoutes from "./routes";
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import { ThemeProvider } from "./contexts/ThemeContext";

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppProvider>
            <ToastProvider>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <Navbar />
                <main className="pt-16">
                  <AppRoutes />
                </main>
              </div>
            </ToastProvider>
          </AppProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
