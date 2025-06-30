import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import Link from "next/link";

export default function Dashboard() {
  const { user } = useAuth();
  const [savedLocations, setSavedLocations] = useState([
    { id: "1", name: "Home", lat: 40.7128, lng: -74.006 },
    { id: "2", name: "Work", lat: 40.7484, lng: -73.9857 },
    { id: "3", name: "Farm", lat: 40.6782, lng: -73.9442 },
  ]);
  const [alerts, setAlerts] = useState([
    {
      id: "1",
      type: "air_quality",
      severity: "high",
      message: "Poor air quality detected in your area",
      location: "Home",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "2",
      type: "weather",
      severity: "medium",
      message: "Heavy rainfall expected in the next 24 hours",
      location: "Work",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
  ]);
  const [recentActivity, setRecentActivity] = useState([
    {
      id: "1",
      type: "location_added",
      details: "Added new location: Farm",
      timestamp: new Date(Date.now() - 259200000).toISOString(),
    },
    {
      id: "2",
      type: "report_generated",
      details: "Generated monthly environmental report",
      timestamp: new Date(Date.now() - 604800000).toISOString(),
    },
  ]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const getTimeSince = (dateString) => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date() - date) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";

    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";

    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <Layout title="GreenGuardian - Dashboard">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-green-700">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name || "User"}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main content area */}
        <div className="md:col-span-2 space-y-6">
          {/* Alerts section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-red-50 px-4 py-3 border-b border-red-100">
              <h2 className="text-lg font-medium text-red-800">
                Active Alerts
              </h2>
            </div>
            <div className="p-4">
              {alerts.length > 0 ? (
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-start p-3 border rounded-md"
                    >
                      <div
                        className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                          alert.severity === "high"
                            ? "bg-red-100 text-red-600"
                            : alert.severity === "medium"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {alert.type === "air_quality" ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {alert.message}
                          </p>
                          <p className="text-xs text-gray-500">
                            {getTimeSince(alert.timestamp)}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500">
                          Location: {alert.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No active alerts at this time.
                </p>
              )}
              <div className="mt-4 text-right">
                <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                  View all alerts
                </button>
              </div>
            </div>
          </div>

          {/* Environmental summary */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-green-50 px-4 py-3 border-b border-green-100">
              <h2 className="text-lg font-medium text-green-800">
                Environmental Summary
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-blue-50 rounded-md">
                  <h3 className="font-medium text-blue-800">Air Quality</h3>
                  <div className="mt-2 flex items-center">
                    <div className="text-2xl font-bold text-blue-700">72</div>
                    <div className="ml-2 text-sm text-blue-600">Moderate</div>
                  </div>
                  <p className="mt-1 text-xs text-blue-500">
                    15% better than yesterday
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-md">
                  <h3 className="font-medium text-yellow-800">Pollen Count</h3>
                  <div className="mt-2 flex items-center">
                    <div className="text-2xl font-bold text-yellow-700">
                      High
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-yellow-500">
                    Tree pollen is the main contributor
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-md">
                  <h3 className="font-medium text-purple-800">UV Index</h3>
                  <div className="mt-2 flex items-center">
                    <div className="text-2xl font-bold text-purple-700">6</div>
                    <div className="ml-2 text-sm text-purple-600">High</div>
                  </div>
                  <p className="mt-1 text-xs text-purple-500">
                    Sunscreen recommended
                  </p>
                </div>
              </div>
              <div className="mt-4 text-right">
                <Link
                  href="/"
                  className="text-green-600 hover:text-green-800 text-sm font-medium"
                >
                  View detailed report
                </Link>
              </div>
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
              <h2 className="text-lg font-medium text-gray-800">
                Recent Activity
              </h2>
            </div>
            <div className="p-4">
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                        {activity.type === "location_added" ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.details}
                          </p>
                          <p className="text-xs text-gray-500">
                            {getTimeSince(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No recent activity.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Saved locations */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-green-50 px-4 py-3 border-b border-green-100">
              <h2 className="text-lg font-medium text-green-800">
                Saved Locations
              </h2>
            </div>
            <div className="p-4">
              {savedLocations.length > 0 ? (
                <div className="space-y-2">
                  {savedLocations.map((location) => (
                    <div
                      key={location.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
                    >
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-green-600 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span>{location.name}</span>
                      </div>
                      <button className="text-green-600 hover:text-green-800">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No saved locations.
                </p>
              )}
              <div className="mt-4">
                <button className="w-full flex items-center justify-center px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add New Location
                </button>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-green-50 px-4 py-3 border-b border-green-100">
              <h2 className="text-lg font-medium text-green-800">
                Quick Links
              </h2>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                <Link
                  href="/trends"
                  className="flex items-center p-2 hover:bg-gray-50 rounded-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-600 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                    />
                  </svg>
                  <span>Environmental Trends</span>
                </Link>
                <Link
                  href="/"
                  className="flex items-center p-2 hover:bg-gray-50 rounded-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-600 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                  <span>Interactive Map</span>
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center p-2 hover:bg-gray-50 rounded-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-600 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>Profile Settings</span>
                </Link>
                <Link
                  href="/"
                  className="flex items-center p-2 hover:bg-gray-50 rounded-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-600 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Help & Support</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Weather forecast */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
              <h2 className="text-lg font-medium text-blue-800">
                Weather Forecast
              </h2>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">Today</p>
                  <p className="text-2xl font-bold">72°F</p>
                  <p className="text-sm text-gray-500">Sunny</p>
                </div>
                <div className="text-yellow-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2">
                  <p className="text-xs text-gray-500">Tue</p>
                  <p className="text-sm font-medium">75°F</p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mx-auto text-yellow-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div className="p-2">
                  <p className="text-xs text-gray-500">Wed</p>
                  <p className="text-sm font-medium">68°F</p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mx-auto text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                    />
                  </svg>
                </div>
                <div className="p-2">
                  <p className="text-xs text-gray-500">Thu</p>
                  <p className="text-sm font-medium">70°F</p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mx-auto text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
