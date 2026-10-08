import { useState, createContext, useContext, useEffect } from "react";
import { BrowserRouter, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Detect from "./pages/Detect";
import Reports from "./pages/Reports";
import ReportDetail from "./pages/ReportDetail";
import MapPage from "./pages/MapPage";
import About from "./pages/About";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";

const PAGE_PATHS = {
  home: "/",
  detect: "/detect",
  reports: "/reports",
  "report-detail": "/report-detail",
  map: "/map",
  about: "/about",
  login: "/login",
  register: "/register",
  "forgot-password": "/forgot-password",
  "reset-password": "/reset-password",
  admin: "/admin",
  profile: "/profile",
};

export const RouterContext = createContext({
  page: "home",
  params: {},
  navigate: () => {},
});

export const AuthContext = createContext({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
});

export const useRouter = () => useContext(RouterContext);

const HIDE_FOOTER = ["login", "register", "forgot-password", "reset-password", "admin"];
const HIDE_NAVBAR = ["login", "register", "forgot-password", "reset-password", "admin"];

const getPageFromPath = (pathname) => {
  const normalized = pathname || "/";
  const match = Object.entries(PAGE_PATHS).find(([, routePath]) => routePath === normalized);
  return match ? match[0] : "home";
};

function AppContent() {
  const location = useLocation();
  const routerNavigate = useNavigate();
  const [page, setPage] = useState(() => getPageFromPath(location.pathname));
  const [params, setParams] = useState({});
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("gg_token") || sessionStorage.getItem("gg_token");
    const storedUser = localStorage.getItem("gg_user") || sessionStorage.getItem("gg_user");
    if (storedToken) setToken(storedToken);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse saved user", e);
      }
    }
  }, []);

  useEffect(() => {
    const nextPage = getPageFromPath(location.pathname);
    setPage(nextPage);
    const searchParams = new URLSearchParams(location.search);
    const nextParams = Object.fromEntries(searchParams.entries());
    setParams(nextParams);
  }, [location.pathname, location.search]);

  const login = (u, t, rememberFlag) => {
    setUser(u);
    setToken(t);
    try {
      if (rememberFlag) {
        localStorage.setItem("gg_token", t);
        localStorage.setItem("gg_user", JSON.stringify(u));
      } else {
        sessionStorage.setItem("gg_token", t);
        sessionStorage.setItem("gg_user", JSON.stringify(u));
      }
    } catch (e) {
      console.error("Failed to persist auth", e);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem("gg_token");
      localStorage.removeItem("gg_user");
      sessionStorage.removeItem("gg_token");
      sessionStorage.removeItem("gg_user");
    } catch (e) {
      console.error("Failed to clear auth", e);
    }
    setPage("home");
    routerNavigate(PAGE_PATHS.home);
  };

  const navigate = (newPage, newParams = {}) => {
    const routePath = PAGE_PATHS[newPage] || PAGE_PATHS.home;
    const query = new URLSearchParams(newParams).toString();
    const targetPath = query ? `${routePath}?${query}` : routePath;
    setPage(newPage);
    setParams(newParams);
    routerNavigate(targetPath);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPage = () => {
    switch (page) {
      case "home":
        return <Home />;
      case "detect":
        return <Detect />;
      case "reports":
        return <Reports />;
      case "report-detail":
        return <ReportDetail />;
      case "map":
        return <MapPage />;
      case "about":
        return <About />;
      case "login":
        return <Login mode="login" />;
      case "register":
        return <Login mode="register" />;
      case "forgot-password":
        return <Login mode="forgot" />;
      case "reset-password":
        return <ResetPassword />;
      case "admin":
        return <Admin />;
      case "profile":
        return <Profile />;
      default:
        return <Home />;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      <RouterContext.Provider value={{ page, navigate, params }}>
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f5f3ee" }}>
          {!HIDE_NAVBAR.includes(page) && <Navbar />}
          <main className="flex-1">{renderPage()}</main>
          {!HIDE_FOOTER.includes(page) && <Footer />}
        </div>
      </RouterContext.Provider>
    </AuthContext.Provider>
  );
}

export default function App() {
  return <BrowserRouter><AppContent /></BrowserRouter>;
}
