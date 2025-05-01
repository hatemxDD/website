import { useState, useEffect } from "react";
import { api } from "../services/api";

interface ApiData {
  message: string;
  endpoints: string[];
}

export const ApiStatus = () => {
  const [status, setStatus] = useState<"loading" | "connected" | "error">(
    "loading"
  );
  const [apiData, setApiData] = useState<ApiData | null>(null);

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const data = await api.get<ApiData>("/");
        setApiData(data);
        setStatus("connected");
      } catch (error) {
        console.error("API connection error:", error);
        setStatus("error");
      }
    };

    checkApiStatus();
  }, []);

  if (status === "loading") {
    return (
      <div className="p-4 bg-blue-50 rounded-md">
        Checking API connection...
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        <h3 className="font-bold">API Connection Error</h3>
        <p>
          Could not connect to the backend API. Please ensure the backend server
          is running.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-50 text-green-700 rounded-md">
      <h3 className="font-bold">API Connected</h3>
      <p>{apiData?.message}</p>
      {apiData?.endpoints && (
        <div className="mt-2">
          <p className="font-semibold">Available Endpoints:</p>
          <ul className="list-disc list-inside">
            {apiData.endpoints.map((endpoint) => (
              <li key={endpoint}>{endpoint}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
