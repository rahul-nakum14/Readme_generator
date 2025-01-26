"use client"
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface LogEntry {
  ip: string;
  userAgent: string;
  country: string;
  region: string;
  city: string;
  latitude: number;
  longitude: number;
  timezone: string;
  isp: string;
  pageUrl: string;
  referrer: string;
  deviceType: string;
  browserName: string;
  osName: string;
  screenResolution: string;
  language: string;
  timestamp: string;
}

export default function AdminPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("https://readme-generator-z7oj.onrender.com/view-logs", {
          headers: {
            Accept: "application/json",
          },
          credentials: "omit", // Since we're using public API
        });

        if (!response.ok) {
          if (response.status === 404) {
            // Handle 404 gracefully
            setLogs([]);
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new TypeError("Received non-JSON response from server");
        }

        const data = await response.json();
        setLogs(data);
      } catch (error) {
        console.error("Failed to fetch logs:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch logs");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchLogs, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p>Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Analytics Logs</h1>
      {logs.length === 0 ? (
        <p className="text-muted-foreground">No analytics data available yet.</p>
      ) : (
        <div className="space-y-4">
          {logs.map((log, index) => (
            <Card key={index} className="p-4">
              <h2 className="text-lg font-semibold mb-2">Visit {index + 1}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p>
                  <strong>IP:</strong> {log.ip}
                </p>
                <p>
                  <strong>Location:</strong> {log.city}, {log.region}, {log.country}
                </p>
                <p>
                  <strong>Coordinates:</strong> {log.latitude}, {log.longitude}
                </p>
                <p>
                  <strong>Timezone:</strong> {log.timezone}
                </p>
                <p>
                  <strong>ISP:</strong> {log.isp}
                </p>
                <p>
                  <strong>Device Type:</strong> {log.deviceType}
                </p>
                <p>
                  <strong>Browser:</strong> {log.browserName}
                </p>
                <p>
                  <strong>OS:</strong> {log.osName}
                </p>
                <p>
                  <strong>Screen Resolution:</strong> {log.screenResolution}
                </p>
                <p>
                  <strong>Language:</strong> {log.language}
                </p>
                <p>
                  <strong>Page URL:</strong> {log.pageUrl}
                </p>
                <p>
                  <strong>Referrer:</strong> {log.referrer}
                </p>
                <p className="col-span-2">
                  <strong>Timestamp:</strong> {new Date(log.timestamp).toLocaleString()}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
