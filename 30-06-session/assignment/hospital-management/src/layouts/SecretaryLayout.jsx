import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Hospital, LayoutDashboard, Users, Calendar, LogOut, Menu, X } from 'lucide-react';
import { logout } from '../store/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import SystemClock from '../components/SystemClock';

export default function SecretaryLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const confirmLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="layout-wrapper">
      {/* Sidebar */}
      <aside className="layout-sidebar">
        <div className="layout-sidebar-header">
          <Hospital className="sidebar-logo-icon" />
          <span className="layout-sidebar-title">Özel Yedikule Hastanesi</span>
        </div>
        
        <div className="layout-sidebar-profile">
          <p className="layout-sidebar-role">Tıbbi Sekreter</p>
          <p className="layout-sidebar-name">{user?.name || "Ayşe Yılmaz"}</p>
        </div>

        <nav className="layout-sidebar-nav">
          <NavLink
            to="/secretary"
            end
            className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link-inactive'}
          >
            <LayoutDashboard className="nav-icon" />
            Ana Sayfa
          </NavLink>
          <NavLink
            to="/secretary/patients"
            className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link-inactive'}
          >
            <Users className="nav-icon" />
            Hastalar
          </NavLink>
          <NavLink
            to="/secretary/appointments"
            className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link-inactive'}
          >
            <Calendar className="nav-icon" />
            Randevular
          </NavLink>
        </nav>

        <div className="layout-sidebar-footer flex flex-col space-y-3">
          <SystemClock />
          <button 
            onClick={() => setIsLogoutOpen(true)} 
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50/50 hover:bg-red-100 border border-red-100 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
      )}

      {/* Mobile Sidebar */}
      <div className={`mobile-menu-panel ${isMobileMenuOpen ? 'mobile-menu-panel-open' : 'mobile-menu-panel-closed'}`}>
        <button className="mobile-menu-close-btn" onClick={closeMobileMenu}>
          <X className="w-5 h-5" />
        </button>
        <div className="layout-sidebar-header mt-2">
          <Hospital className="sidebar-logo-icon" />
          <span className="layout-sidebar-title text-sm">Özel Yedikule Hastanesi</span>
        </div>
        <div className="layout-sidebar-profile">
          <p className="layout-sidebar-role">Tıbbi Sekreter</p>
          <p className="layout-sidebar-name">{user?.name || "Ayşe Yılmaz"}</p>
        </div>
        <nav className="layout-sidebar-nav">
          <NavLink to="/secretary" end className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link-inactive'} onClick={closeMobileMenu}>
            <LayoutDashboard className="nav-icon" /> Ana Sayfa
          </NavLink>
          <NavLink to="/secretary/patients" className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link-inactive'} onClick={closeMobileMenu}>
            <Users className="nav-icon" /> Hastalar
          </NavLink>
          <NavLink to="/secretary/appointments" className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link-inactive'} onClick={closeMobileMenu}>
            <Calendar className="nav-icon" /> Randevular
          </NavLink>
        </nav>
        <div className="layout-sidebar-footer flex flex-col space-y-3">
          <SystemClock />
          <button onClick={() => { closeMobileMenu(); setIsLogoutOpen(true); }} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50/50 hover:bg-red-100 border border-red-100 rounded-lg transition-colors">
            <LogOut className="w-4 h-4" /> Çıkış Yap
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {isLogoutOpen && (
        <Dialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
          <DialogContent className="modal-content-sm">
            <DialogHeader>
              <DialogTitle>Çıkış Yap</DialogTitle>
              <DialogDescription>
                Sistemden çıkış yapmak istediğinize emin misiniz?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsLogoutOpen(false)}>İptal</Button>
              <Button variant="destructive" onClick={confirmLogout}>Çıkış Yap</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Main Content */}
      <main className="layout-main">
        {/* Topbar */}
        <header className="layout-topbar">
          <div className="layout-topbar-left">
            <button className="hamburger-btn" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-slate-800 hidden sm:block tracking-wide">
              Hastahane Takip Sistemi
            </h1>
          </div>
          <div className="layout-topbar-right relative">
            <button 
              className="layout-topbar-avatar cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 transition-all hover:ring-2"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              {(user?.name || "Ayşe Yılmaz")
                .split(' ')
                .map(n => n[0])
                .join('')
                .substring(0, 2)
                .toUpperCase()}
            </button>
            
            {isProfileOpen && (
              <div className="absolute top-12 right-0 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 border-b border-slate-100 pb-2 mb-2">
                  <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Tıbbi Sekreter</p>
                </div>
                <div className="px-2">
                  <button onClick={() => setIsLogoutOpen(true)} className="w-full text-left px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center">
                    <LogOut className="w-4 h-4 mr-2" />
                    Çıkış Yap
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div className="layout-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
