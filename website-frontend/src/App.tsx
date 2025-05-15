import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Common/Navbar";
import AppRoutes from "./routes";
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ApiStatus } from "./components/ApiStatus";

const App: React.FC = () => {
  const [showDebug, setShowDebug] = useState(false);

  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppProvider>
            <ToastProvider>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <Navbar />
                <main className="pt-16">
                  {/* Debug Panel Toggle */}
                  <div className="fixed bottom-4 right-4 z-50">
                    <button
                      onClick={() => setShowDebug(!showDebug)}
                      className="bg-gray-800 dark:bg-gray-700 text-white px-3 py-1 rounded-md text-sm"
                    >
                      {showDebug ? "Hide Debug" : "Show Debug"}
                    </button>
                  </div>

                  {/* Debug Panel */}
                  {showDebug && (
                    <div className="fixed bottom-16 right-4 w-80 bg-white dark:bg-gray-800 p-4 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto dark:text-white">
                      <h2 className="font-bold text-lg mb-2">API Status</h2>
                      <ApiStatus />
                    </div>
                  )}

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
