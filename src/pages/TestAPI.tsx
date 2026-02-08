import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { projectId, publicAnonKey } from "../utils/supabase/info";

export default function TestAPI() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testHealth = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c39e4079/health`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );
      const data = await response.json();
      setResult({ type: "health", data });
    } catch (error: any) {
      setResult({ type: "error", error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testGemini = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c39e4079/test-gemini`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );
      const data = await response.json();
      setResult({ type: "gemini", data });
    } catch (error: any) {
      setResult({ type: "error", error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="mb-8">API Diagnostics</h1>
        
        <div className="space-y-4 mb-8">
          <Button onClick={testHealth} disabled={loading}>
            Test Health Endpoint
          </Button>
          <Button onClick={testGemini} disabled={loading} className="ml-4">
            Test Gemini API
          </Button>
        </div>

        {result && (
          <Card className="p-6">
            <h2 className="mb-4">Result:</h2>
            <pre className="bg-muted p-4 rounded overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </Card>
        )}
      </div>
    </div>
  );
}
