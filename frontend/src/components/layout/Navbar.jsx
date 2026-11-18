import { useState, useEffect } from "react"
import { NavLink, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  BarChart3,
  Menu,
  X,
  Activity,
  ShieldCheck,
  LogOut,
  UserCircle,
  Code2Icon,
  ClipboardCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useNavigate } from "react-router-dom";

const navigationItems = [
  { title: "Home", url: "/", icon: LayoutDashboard },
  { title: "Patient Search", url: "/patients", icon: Users },
  { title: "Diagnosis Search", url: "/diagnosis", icon: Stethoscope },
   { title: "API Docs", url: "/api", icon: Code2Icon },
  { title: "Review Queue", url: "/terminology-review", icon: ClipboardCheck },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
 
]

export function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Optional: clear any auth tokens or state here
    navigate("/login"); // redirect to login page
  };
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (path) => currentPath === path
  const getNavClasses = (path) =>
    isActive(path)
      ? "text-green-700 border-b-2 border-[#138808] font-semibold"
      : "text-[#4A4A4A] hover:text-[#0A3D62] transition-colors"

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  
  return (
    <nav className="sticky top-0 z-50 w-full border-b shadow-sm backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo + Branding */}
        <div className="flex items-center gap-3 ml-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-700 text-white shadow-sm">
            <Activity className="h-5 w-5" />
          </div>
          <div>
    <h1 
  className="text-2xl font-black tracking-widest text-green-700"
  style={{ fontFamily: "'Montserrat', sans-serif" }}
>
  MEDNAMA
</h1>


            <p className="text-xs text-[#6B7280] hidden sm:block">
              Ministry of Health & Family Welfare
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden ml-10 md:flex items-center space-x-8 flex-1">
          {navigationItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm transition-colors",
                getNavClasses(item.url)
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </NavLink>
          ))}
        </div>

        {/* Status + Profile (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <Badge
            variant="secondary"
            className="bg-[#138808]/10 text-[#138808] px-2 py-1 border border-[#138808]/30"
          >
            <ShieldCheck className="h-3 w-3 mr-1" /> ABHA Integrated
          </Badge>
          <div className="flex items-center gap-2">
            <UserCircle className="h-6 w-6 text-[#4A4A4A]" />
            <span className="text-sm font-medium text-[#0A3D62]">
              Dr. Jhatka
            </span>
            <Button
              variant="outline"
              size="sm"
              className="ml-2 flex gap-1 border-green-700 text-green-700 hover:bg-green-500 hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 text-green-700" /> Logout
            </Button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden text-[#0A3D62]"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="container py-4 space-y-2">
            {navigationItems.map((item) => (
              <NavLink
                key={item.title}
                to={item.url}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors",
                  isActive(item.url)
                    ? "bg-[#0A3D62] text-white"
                    : "text-[#4A4A4A] hover:bg-gray-100"
                )}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </NavLink>
            ))}
            <div className="pt-4 border-t mt-4 space-y-3">
              <Badge
                variant="secondary"
                className="bg-[#138808]/10 text-[#138808] px-2 py-1 border border-[#138808]/30"
              >
                <ShieldCheck className="h-3 w-3 mr-1" /> ABHA Integrated
              </Badge>
              <div className="flex items-center gap-2 px-3 text-[#0A3D62]">
                <UserCircle className="h-5 w-5" />
                <span className="text-sm">Dr. Jhatka</span>
              </div>
             <Button
      variant="outline"
      size="sm"
      className="mx-3 flex gap-1 w-full border-[#0A3D62] text-[#0A3D62] hover:bg-[#0A3D62] hover:text-white"
      onClick={handleLogout}
    >
      <LogOut className="h-4 w-4" /> Logout
    </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
