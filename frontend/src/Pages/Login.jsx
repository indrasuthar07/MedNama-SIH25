import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ React Router
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Check, Activity } from "lucide-react";

export default function Login() {
  const navigate = useNavigate(); // ✅ React Router navigate
  const [abhaId, setAbhaId] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (abhaId.length !== 14 || !consent) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/"); // ✅ Navigate to home page
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-200 to-green-200 p-6">
      <div className="w-full max-w-3xl space-y-8">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white/30 backdrop-blur-xl shadow-lg hover:scale-110 transition-transform">
              <Activity className="h-12 w-12 text-green-600 animate-spin-slow" />
            </div>
          </div>
          <h1 className="text-5xl font-extrabold text-gray-800 drop-shadow-sm">Healthcare EMR</h1>
          <p className="text-gray-700 mt-2 text-lg">Terminology Management System</p>
          <Badge variant="secondary" className="mt-4 px-6 py-2 text-base rounded-full shadow-md">
            ABHA OAuth 2.0 Authentication
          </Badge>
        </div>

        {/* Login Card */}
        <Card className="bg-white/40 backdrop-blur-xl border border-white/30 shadow-xl rounded-2xl p-8 hover:shadow-2xl transition-all min-h-[500px]">
          <CardHeader className="text-center mb-6">
            <CardTitle className="flex items-center justify-center gap-3 text-gray-800 text-2xl md:text-3xl">
              <Shield className="h-6 w-6 text-green-700" />
              Secure Login
            </CardTitle>
            <CardDescription className="text-gray-600 text-base md:text-lg">
              Sign in with your ABHA ID to access the healthcare terminology system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* ABHA ID Input */}
            <div className="space-y-2">
              <Label htmlFor="abha-id" className="text-gray-700 font-semibold text-lg">ABHA ID</Label>
              <Input
                id="abha-id"
                type="text"
                placeholder="Enter your 14-digit ABHA ID"
                value={abhaId}
                maxLength={14}
                onChange={(e) => setAbhaId(e.target.value.replace(/\D/g, ""))}
                className="h-14 text-lg border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-300 transition-all rounded-lg shadow-sm"
              />
            </div>

            {/* Consent Checkbox */}
            <div className="flex items-start space-x-3">
              <Checkbox
                id="consent"
                checked={consent}
                onCheckedChange={(checked) => setConsent(!!checked)}
                className="h-6 w-6 border-gray-300 focus:ring-2 focus:ring-green-300 transition"
              />
              <div className="grid gap-1 leading-none">
                <Label htmlFor="consent" className="text-base font-medium text-gray-700">
                  I consent to data processing
                </Label>
                <p className="text-sm text-gray-500">
                  I agree to the processing of my health data in accordance with India's EHR Standards 2016
                  and consent to terminology mapping between NAMASTE, WHO Ayurveda, and ICD-11 systems.
                </p>
              </div>
            </div>

            {/* Login Buttons */}
            <div className="space-y-4">
              <Button
                variant="hero"
                size="lg"
                className={`w-full flex items-center justify-center gap-3 transition-all rounded-lg text-lg md:text-xl ${
                  abhaId.length !== 14 || !consent ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                }`}
                disabled={abhaId.length !== 14 || !consent || loading}
                onClick={handleLogin}
              >
                {loading ? "Signing in..." : abhaId.length === 14 && consent ? <Check className="h-5 w-5 text-green-600" /> : <Lock className="h-5 w-5" />}
                {loading ? "Signing in..." : "Sign in with ABHA OAuth 2.0"}
              </Button>

              <Button variant="outline" size="lg" className="w-full hover:scale-105 transition-transform rounded-lg text-lg md:text-xl">
                Register New ABHA ID
              </Button>
            </div>

            {/* Role Preview */}
            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm md:text-base text-gray-500 text-center mb-2">
                Available roles after authentication:
              </p>
              <div className="flex gap-3 justify-center">
                <Badge variant="outline" className="text-base text-green-700">Clinician</Badge>
                <Badge variant="outline" className="text-base text-green-700">Admin</Badge>
                <Badge variant="outline" className="text-base text-green-700">Researcher</Badge>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-gray-600 text-sm md:text-base">
          <p>Powered by FHIR R4 • Compliant with India EHR Standards 2016</p>
          <p className="mt-1">Integrating NAMASTE, WHO Ayurveda & ICD-11 TM2 + Biomedicine</p>
        </div>
      </div>
    </div>
  );
}
