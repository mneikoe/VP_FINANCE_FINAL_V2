import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/feature/auth/authThunx";
import {
  FiGrid,
  FiLayers,
  FiUsers,
  FiBriefcase,
  FiHome,
  FiMessageSquare,
  FiCheckSquare,
  FiFileText,
  FiChevronDown,
  FiMenu,
  FiLogOut,
  FiX,
  FiUser,
  FiBell,
  FiTrendingUp,
  FiDollarSign,
  FiAward,
  FiShoppingCart,
} from "react-icons/fi";
import { Landmark } from "lucide-react";

const UnifiedNavbar = ({ role, menuConfig }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const navbarRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotification, setShowNotification] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [notifications, setNotifications] = useState([
    { id: 1, text: "New lead assigned", read: false },
    { id: 2, text: "Monthly report ready", read: false },
    { id: 3, text: "System update tonight", read: true },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.clear();
    navigate("/auth/login");
  };

  const isPathActive = (paths = []) =>
    paths.some((path) =>
      path === "/" ? location.pathname === "/" : location.pathname.startsWith(path)
    );

  const handleDropdownClick = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const closeAllDropdowns = () => {
    setOpenDropdown(null);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setOpenDropdown(null);
        setShowNotification(false);
        setShowProfileCard(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    setOpenDropdown(null);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // components
  const NavItem = ({ to, icon: Icon, label, active, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className={`
        relative flex h-14 min-w-[70px] lg:min-w-[80px] cursor-pointer flex-col items-center justify-center 
        rounded-xl px-2 transition-all duration-300 group
        ${active ? "bg-orange-50 text-orange-600" : "text-slate-600 hover:bg-slate-50 hover:text-orange-600"}
      `}
    >
      <Icon className={`text-lg transition-transform group-hover:scale-110 ${active ? "scale-110" : ""}`} />
      <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-center">{label}</span>
      {active && (
        <span className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(242,116,5,0.5)]" />
      )}
    </Link>
  );

  const DropdownContainer = ({ name, icon: Icon, label, width = "600px", children }) => {
    const isOpen = openDropdown === name;
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => handleDropdownClick(name)}
          className={`
            relative flex h-14 min-w-[70px] lg:min-w-[80px] cursor-pointer flex-col items-center justify-center 
            rounded-xl px-2 transition-all duration-300 group
            ${isOpen ? "bg-orange-50 text-orange-600" : "text-slate-600 hover:bg-slate-50 hover:text-orange-600"}
          `}
        >
          <Icon className={`text-lg transition-transform group-hover:scale-110 ${isOpen ? "scale-110" : ""}`} />
          <div className="flex items-center mt-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider">{label}</span>
            <FiChevronDown className={`ml-1 text-[10px] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
          </div>
          {isOpen && (
            <span className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(242,116,5,0.5)]" />
          )}
        </button>

        {isOpen && (
          <div
            className="absolute top-full left-1/2 z-[10000] mt-2 -translate-x-1/2 max-h-[70vh] overflow-y-auto rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-200"
            style={{ width: `min(${width}, 94vw)` }}
          >
            {children}
          </div>
        )}
      </div>
    );
  };

  const MenuSection = ({ title, items }) => (
    <div className="space-y-3">
      <h6 className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400 border-b border-slate-50 pb-2">
        {title}
      </h6>
      <div className="grid gap-1">
        {items.map((item, idx) => (
          <Link
            key={idx}
            to={item.to}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-600 transition-all hover:bg-orange-50 hover:text-orange-600 hover:translate-x-1"
            onClick={closeAllDropdowns}
          >
            {item.icon && <item.icon className="text-sm opacity-70" />}
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <div ref={navbarRef} className="relative z-[9999] w-full font-outfit">
      {/* Top Banner Accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600" />

      <nav
        className={`
          sticky top-0 w-full transition-all duration-300 border-b z-[9999]
          ${scrolled ? "bg-white/90 backdrop-blur-md shadow-lg py-1" : "bg-white py-2 border-slate-100"}
        `}
      >
        <div className="mx-auto max-w-[1920px] px-4 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Logo Section */}
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden rounded-xl bg-slate-50 p-2.5 text-slate-600 transition-colors hover:bg-orange-50 hover:text-orange-600"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>

              <Link to="/" onClick={closeAllDropdowns} className="flex items-center gap-3 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl orange-gradient shadow-lg shadow-orange-200 group-hover:scale-105 transition-transform">
                  <span className="text-lg font-bold text-white tracking-tighter">VP</span>
                </div>
                <div className="hidden sm:block">
                  <div className="text-lg font-extrabold leading-none tracking-tight text-slate-900">
                    VP <span className="text-orange-600">FINANCIAL</span>
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Nest Dashboard
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden flex-1 lg:flex items-center justify-center">
              <div className="flex items-center gap-1 rounded-2xl bg-slate-50/50 p-1 ring-1 ring-slate-100">
                <NavItem
                  to={role === "HR" ? "/dashboard" : role === "Telecaller" ? "/telecaller/dashboard" : "/"}
                  icon={FiGrid}
                  label="Dashboard"
                  active={location.pathname.endsWith("/dashboard") || location.pathname === "/"}
                  onClick={closeAllDropdowns}
                />

                {Object.entries(menuConfig || {}).map(([key, menu]) => (
                  <DropdownContainer
                    key={key}
                    name={key}
                    icon={menu.icon || FiLayers}
                    label={menu.label}
                    width={menu.width}
                  >
                    <div
                      className="grid gap-8"
                      style={{
                        gridTemplateColumns: `repeat(${
                          menu.sections.length === 1 ? 1 : menu.sections.length === 2 ? 2 : 3
                        }, minmax(0, 1fr))`,
                      }}
                    >
                      {menu.sections.map((section, idx) => (
                        <MenuSection key={idx} title={section.title} items={section.items} />
                      ))}
                    </div>
                  </DropdownContainer>
                ))}
              </div>
            </div>

            {/* Actions Section */}
            <div className="flex items-center gap-2 lg:gap-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotification(!showNotification)}
                  className={`relative rounded-xl p-2.5 transition-all duration-300 ${
                    showNotification ? "bg-orange-50 text-orange-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <FiBell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-orange-600 text-[10px] font-bold text-white ring-2 ring-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotification && (
                  <div className="absolute right-0 top-14 z-50 w-80 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                    <div className="border-b border-slate-50 bg-slate-50/50 p-4">
                      <h4 className="text-sm font-bold text-slate-900">Notifications</h4>
                    </div>
                    <div className="max-h-[350px] overflow-y-auto p-2">
                      {notifications.map((item) => (
                        <div
                          key={item.id}
                          className={`flex gap-3 rounded-xl p-3 transition-colors ${
                            item.read ? "opacity-60" : "bg-orange-50/50"
                          }`}
                        >
                          <div className={`h-2 w-2 mt-1.5 shrink-0 rounded-full ${item.read ? "bg-slate-300" : "bg-orange-500"}`} />
                          <p className="text-[13px] leading-relaxed text-slate-700">{item.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileCard(!showProfileCard)}
                  className={`flex items-center gap-2 rounded-xl border p-1.5 transition-all duration-300 ${
                    showProfileCard ? "bg-slate-900 border-slate-900" : "bg-white border-slate-200 hover:border-orange-300 hover:bg-orange-50/30"
                  }`}
                >
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-sm font-bold ${showProfileCard ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-600"}`}>
                    {loggedInUser.username?.charAt(0) || loggedInUser.name?.charAt(0) || "U"}
                  </div>
                  <FiChevronDown className={`mr-1 transition-transform ${showProfileCard ? "rotate-180 text-white" : "text-slate-400"}`} />
                </button>

                {showProfileCard && (
                  <div className="absolute right-0 top-14 z-50 w-72 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                    <div className="navy-gradient p-6 text-white">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl font-bold">
                           {loggedInUser.username?.charAt(0) || "U"}
                        </div>
                        <div>
                          <h4 className="font-bold tracking-tight">{loggedInUser.username || loggedInUser.name || "User"}</h4>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400">{role || loggedInUser.role}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 space-y-1">
                       <div className="px-3 py-2 text-[12px] text-slate-500 font-medium border-b border-slate-50 mb-2">
                        {loggedInUser.email || "no-email@example.com"}
                       </div>
                       <button
                        onClick={() => navigate(role === "HR" ? "/dashboard/home" : "/")}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-orange-600"
                       >
                         <FiUser className="opacity-50" /> Profile Settings
                       </button>
                       <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                       >
                         <FiLogOut className="opacity-50" /> Sign Out
                       </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`
          fixed inset-0 z-[100] transform transition-transform duration-300 lg:hidden
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="h-full w-4/5 bg-white shadow-2xl overflow-y-auto">
          <div className="navy-gradient p-8 text-white">
             <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                  <span className="text-xl font-bold">VP</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
                  <FiX size={24} />
                </button>
             </div>
             <div className="mt-6">
                <h3 className="text-lg font-bold">{loggedInUser.name || "Welcome!"}</h3>
                <p className="text-xs text-orange-400 font-bold uppercase tracking-widest">{role}</p>
             </div>
          </div>

          <div className="p-6 space-y-6">
            <Link to="/" className="flex items-center gap-3 text-lg font-bold text-slate-900" onClick={closeAllDropdowns}>
               <FiGrid className="text-orange-500" /> Dashboard
            </Link>

            {Object.entries(menuConfig || {}).map(([key, menu]) => (
              <div key={key} className="space-y-3">
                <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">{menu.label}</h4>
                <div className="space-y-1">
                  {menu.sections.flatMap(s => s.items).map((item, i) => (
                    <Link
                      key={i}
                      to={item.to}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600"
                      onClick={closeAllDropdowns}
                    >
                      {item.icon && <item.icon />}
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="h-full w-1/5 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
      </div>
    </div>
  );
};

export default UnifiedNavbar;
