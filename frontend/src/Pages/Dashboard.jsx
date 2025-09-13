import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom";
import { 
  Stethoscope, 
  Search, 
  BarChart3,
  Shield,
  Globe,
  Award
} from "lucide-react"

export default function Dashboard() {
  const navigate = useNavigate();
  return (
    <div className="space-y-12 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12 bg-gradient-to-r from-gray-50 to-gray-50 rounded-lg">
        <div className="flex justify-center">
          <img 
            src="/ayush.png" 
            alt="Government of India Emblem" 
            className="h-32 w-104 object-contain"
          />
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-green-700">
          National Healthcare EMR
        </h1>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
          Government of India's Integrated Electronic Medical Records System
        </p>
        <p className="text-lg text-gray-500 max-w-3xl mx-auto">
          Empowering healthcare through standardized terminology management and dual coding compliance
        </p>
        
        <div className="flex flex-wrap justify-center gap-3">
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 px-3 py-1">NAMASTE Compliant</Badge>
          <Badge variant="secondary" className="bg-teal-50 text-teal-700 px-3 py-1">WHO Ayurveda</Badge>
          <Badge variant="secondary" className="bg-green-50 text-green-700 px-3 py-1">ICD-11 TM2</Badge>
          <Badge variant="secondary" className="bg-gray-100 text-gray-600 px-3 py-1">ABHA Integrated</Badge>
        </div>
      </div>

      {/* Government Features */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="text-center hover-scale space-y-6 py-12 bg-gradient-to-r from-blue-50 to-blue-50">
          <CardHeader>
            <Shield className="h-12 w-12 mx-auto text-blue-600" />
            <CardTitle className="text-blue-700">Secure & Compliant</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              ABHA authentication with full compliance to India's EHR Standards 2016
            </p>
          </CardContent>
        </Card>
        
        <Card className="text-center hover-scale space-y-6 py-12 bg-gradient-to-r from-green-50 to-green-50">
          <CardHeader>
            <Globe className="h-12 w-12 mx-auto text-teal-600" />
            <CardTitle className="text-teal-700">International Standards</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              WHO-compliant terminology integration with traditional medicine systems
            </p>
          </CardContent>
        </Card>
        
        <Card className="text-center hover-scale space-y-6 py-12 bg-gradient-to-r from-red-50 to-red-50">
          <CardHeader>
            <Award className="h-12 w-12 mx-auto text-green-600" />
            <CardTitle className="text-green-700">Digital India Initiative</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Part of Digital India's healthcare transformation mission
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-green-700 font-bold text-xl">Healthcare Services</CardTitle>
          <CardDescription className="text-gray-600">Access core EMR functionality</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 bg-gradient-to-r from-gray-50 to-gray-50">
            <Button className="h-auto p-6 flex flex-col gap-3" variant="outline" size="lg" onClick={() => navigate('/patients')}>
              <Search className="h-8 w-8 text-blue-600" />
              <div className="text-center">
                <div className="font-medium text-blue-700">Patient Search</div>
                <div className="text-sm text-gray-500">Search by ABHA ID</div>
              </div>
            </Button>
            <Button className="h-auto p-6 flex flex-col gap-3" variant="outline" size="lg" onClick={() => navigate('/diagnosis')}>
              <Stethoscope className="h-8 w-8 text-teal-600" />
              <div className="text-center">
                <div className="font-medium text-teal-700">Diagnosis Entry</div>
                <div className="text-sm text-gray-500">Multi-terminology coding</div>
              </div>
            </Button>
            <Button className="h-auto p-6 flex flex-col gap-3" variant="outline" size="lg" onClick={() => navigate('/analytics')}>
              <BarChart3 className="h-8 w-8 text-green-600" />
              <div className="text-center">
                <div className="font-medium text-green-700">Analytics</div>
                <div className="text-sm text-gray-500">Health insights</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

   <footer className="mt-16 w-full bg-white/20 backdrop-blur-xl border-t border-gray-200 shadow-inner">
  <div className="max-w-7xl mx-auto px-6 py-10 lg:py-14 grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
    
    {/* Branding */}
    <div className="flex flex-col items-center md:items-start text-center md:text-left">
      <h3 className="text-2xl font-extrabold text-green-700 tracking-tight">
        National EMR System
      </h3>
      <p className="text-gray-600 text-sm mt-2 max-w-sm">
        Version 2.1 | Empowering healthcare professionals with secure and efficient digital records. 
        Powered by Digital India Initiative.
      </p>
    </div>

    {/* Quick Links */}
    <div className="flex flex-col items-center md:items-center">
      <h4 className="text-gray-800 font-semibold text-lg mb-3">Quick Links</h4>
      <ul className="text-gray-500 text-sm space-y-2">
        <li><a href="/" className="hover:text-green-700 transition-colors"> Home</a></li>
        <li><a href="/patients" className="hover:text-green-700 transition-colors"> Patient Search</a></li>
        <li><a href="/analytics" className="hover:text-green-700 transition-colors"> Analytics</a></li>
        <li><a href="/support" className="hover:text-green-700 transition-colors">Support</a></li>
      </ul>
    </div>

    {/* Contact & Social */}
    <div className="flex flex-col items-center md:items-end text-center md:text-right">
      <h4 className="text-gray-800 font-semibold text-lg mb-3">Connect with Us</h4>
      <div className="flex gap-4 mb-4">
        <a href="#" aria-label="Twitter" className="text-green-700 hover:text-blue-700 transition-colors">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 4.56c-.89.39-1.85.65-2.85.77 1.02-.61 1.8-1.57 2.17-2.72-.96.57-2.03.98-3.17 1.2a5.05 5.05 0 0 0-8.61 4.61A14.32 14.32 0 0 1 1.64 3.16a5.02 5.02 0 0 0 1.56 6.74c-.81-.03-1.57-.25-2.23-.61v.06a5.06 5.06 0 0 0 4.05 4.95c-.78.21-1.61.21-2.39.08a5.06 5.06 0 0 0 4.73 3.51A10.12 10.12 0 0 1 0 19.54 14.29 14.29 0 0 0 7.75 21c9.3 0 14.39-7.71 14.39-14.39 0-.22 0-.43-.01-.64A10.18 10.18 0 0 0 24 4.56z"/>
          </svg>
        </a>
        <a href="#" aria-label="Facebook" className="text-green-700 hover:text-blue-900 transition-colors">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.04c-5.5 0-9.96 4.46-9.96 9.96 0 4.41 3.6 8.06 8.06 8.96v-6.33h-2.42v-2.63h2.42V9.41c0-2.4 1.43-3.72 3.61-3.72 1.05 0 2.14.18 2.14.18v2.36h-1.21c-1.19 0-1.56.74-1.56 1.5v1.79h2.65l-.42 2.63h-2.23v6.33c4.46-.9 8.06-4.55 8.06-8.96 0-5.5-4.46-9.96-9.96-9.96z"/>
          </svg>
        </a>
      </div>
      <p className="text-gray-500 text-xs leading-relaxed">
        © 2024 Government of India<br />
        Ministry of Health and Family Welfare
      </p>
    </div>
  </div>
</footer>

    </div>
  )
}
