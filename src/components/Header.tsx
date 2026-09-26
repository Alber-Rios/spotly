import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Building2,
  ShieldCheck,
  UserCheck,
  Bell,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Search,
  KeyRound,
  FileText,
  Briefcase,
  LogIn,
  UserPlus,
  LogOut,
  User,
  Calendar,
  Menu,
  ChevronRight,
  X,
} from 'lucide-react';
import { formatRut } from '../utils/formatters.ts';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenOwnerUpgrade: () => void;
  onOpenAuth: (mode: 'login' | 'register', notice?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenOwnerUpgrade,
  onOpenAuth,
}) => {
  const {
    currentUser,
    allUsers,
    switchUser,
    logout,
    notifications,
    markAllNotificationsRead,
    dismissNotification,
  } = useApp();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const unreadNotifications = notifications.filter((n) => !n.read);
  const mobileNavigation = [
    { label: 'Explorar Espacios', view: 'home', icon: Search },
    ...(currentUser?.role === 'tenant'
      ? [{ label: 'Mis Arriendos', view: 'my-bookings', icon: FileText }]
      : []),
    ...(currentUser?.role === 'owner' || currentUser?.ownerTermsAccepted
      ? [{ label: 'Panel Propietario', view: 'owner', icon: Briefcase }]
      : []),
    ...(currentUser?.role === 'admin'
      ? [{ label: 'Gobierno y Procesos', view: 'admin', icon: ShieldCheck }]
      : []),
    ...(currentUser
      ? [{
          label: currentUser.verificationStatus === 'pending_review'
            ? 'Revisión en Proceso'
            : currentUser.verificationStatus === 'verified'
            ? 'Verificación OK'
            : 'Verificar Mi Cuenta',
          view: 'onboarding',
          icon: UserCheck,
        }]
      : []),
    ...(currentUser ? [{ label: 'Mi Cuenta', view: 'profile', icon: User }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Marca */}
          <div className="flex items-center gap-8">
            <button
              id="brand-logo-btn"
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 text-left group transition"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 block leading-tight">
                  Spotly
                </span>
                <span className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase block">
                  Espacios Chile
                </span>
              </div>
            </button>

      </div>

          {/* Acciones Derecha: Según esté registrado o no */}
          <div className="flex items-center gap-3">
            {/* CASO 1: USUARIO NO REGISTRADO (Visitante) */}
            {!currentUser ? (
              <div className="flex items-center gap-2">

                <button
                  id="header-login-btn"
                  onClick={() => onNavigate('login')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-slate-500" />
                  <span>Iniciar Sesión</span>
                </button>

                <button
                  id="header-register-btn"
                  onClick={() => onNavigate('register')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition transform active:scale-95 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Registrarte</span>
                </button>
              </div>
            ) : (
              <>

                {/* Campana de Notificaciones */}
                <div className="relative">
                  <button
                    id="notifications-bell-btn"
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowUserMenu(false);
                      setShowMobileMenu(false);
                    }}
                    className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
                    aria-label="Notificaciones"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadNotifications.length > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-600 rounded-full ring-2 ring-white"></span>
                    )}
                  </button>

                  {showNotifications && (
                    <>
                      <div
                        className="fixed inset-0 z-40 bg-black/5"
                        onClick={() => setShowNotifications(false)}
                      />
                      <div className="fixed inset-x-4 top-16 w-auto max-w-md max-h-[calc(100dvh-5rem)] bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-fadeIn sm:absolute sm:inset-x-auto sm:top-auto sm:right-0 sm:mt-2 sm:w-[min(24rem,calc(100vw-2rem))]">
                        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-4 pb-2 border-b border-slate-100">
                          <span className="text-sm font-semibold text-slate-900">
                            Notificaciones ({unreadNotifications.length})
                          </span>
                          {unreadNotifications.length > 0 && (
                            <button
                              onClick={markAllNotificationsRead}
                              className="text-xs text-rose-600 hover:text-rose-700 font-medium"
                            >
                              Marcar leídas
                            </button>
                          )}
                        </div>
                        <div className="max-h-[min(18rem,calc(100dvh-9rem))] overflow-y-auto overscroll-contain divide-y divide-slate-100">
                          {notifications.length === 0 ? (
                            <p className="text-xs text-slate-400 py-6 text-center">No hay notificaciones</p>
                          ) : (
                            notifications.map((n) => (
                              <div
                                key={n.id}
                                className={`p-3.5 hover:bg-slate-50 transition flex items-start justify-between gap-3 ${
                                  !n.read ? 'bg-rose-50/40' : ''
                                }`}
                              >
                                <div className="min-w-0 flex-1 space-y-1">
                                  <p className="break-words text-xs font-semibold text-slate-900">{n.title}</p>
                                  <p className="break-words text-xs text-slate-600 leading-relaxed">{n.message}</p>
                                  <span className="text-[10px] text-slate-400 block">
                                    {new Date(n.timestamp).toLocaleTimeString('es-CL', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                </div>
                                <button
                                  onClick={() => dismissNotification(n.id)}
                                  className="shrink-0 text-slate-400 hover:text-slate-600 text-xs p-1"
                                >
                                  ×
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Selector de Perfil */}
                <div className="relative">
                  <button
                    id="user-profile-menu-btn"
                    onClick={() => {
                      setShowUserMenu(!showUserMenu);
                      setShowNotifications(false);
                      setShowMobileMenu(false);
                    }}
                    className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-full border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition shadow-xs"
                  >
                    <div className="text-left hidden lg:block">
                      <div className="text-xs font-bold text-slate-900 leading-tight">
                        {currentUser.fullName.split(' ')[0]}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                        {currentUser.role === 'admin' ? (
                          <span className="text-indigo-600 font-bold">Admin Gobierno</span>
                        ) : currentUser.role === 'owner' ? (
                          <span className="text-amber-700 font-bold">Propietario</span>
                        ) : (
                          <span className="text-emerald-600 font-bold">Arrendatario</span>
                        )}
                      </div>
                    </div>
                    <div className="relative">
                      <img
                        src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                        alt={currentUser.fullName}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-white"
                      />
                      {currentUser.verificationStatus === 'verified' && (
                        <span className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 text-white rounded-full p-0.5" title="Verificado">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Menú Dropdown estilo MercadoLibre */}
                  {showUserMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowUserMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 animate-fadeIn overflow-hidden">

                        {/* Cabecera: avatar + nombre + Mi perfil */}
                        <div className="bg-slate-50 px-5 py-4 flex items-center gap-3 border-b border-slate-100">
                          <div className="relative shrink-0">
                            <img
                              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                              alt={currentUser.fullName}
                              className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow"
                            />
                            {currentUser.verificationStatus === 'verified' && (
                              <span className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 text-white rounded-full p-0.5">
                                <CheckCircle2 className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-slate-900 truncate">{currentUser.fullName}</p>
                            <button
                              onClick={() => { setShowUserMenu(false); onNavigate('profile'); }}
                              className="flex items-center gap-0.5 text-xs text-rose-600 hover:text-rose-700 font-semibold mt-0.5 transition"
                            >
                              Mi perfil
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Banner de acción destacada */}
                        {currentUser.role === 'tenant' && !currentUser.ownerTermsAccepted ? (
                          <button
                            onClick={() => { setShowUserMenu(false); onOpenOwnerUpgrade(); }}
                            className="w-full flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-700 hover:to-amber-600 text-white transition"
                          >
                            <span className="flex items-center gap-2.5 text-sm font-bold">
                              <Sparkles className="w-4 h-4 text-amber-200 shrink-0" />
                              Publica tu espacio en Spotly
                            </span>
                            <ChevronRight className="w-4 h-4 shrink-0 opacity-80" />
                          </button>
                        ) : (currentUser.role === 'owner' || currentUser.ownerTermsAccepted) ? (
                          <button
                            onClick={() => { setShowUserMenu(false); onNavigate('owner'); }}
                            className="w-full flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-700 hover:to-amber-600 text-white transition"
                          >
                            <span className="flex items-center gap-2.5 text-sm font-bold">
                              <Briefcase className="w-4 h-4 text-amber-200 shrink-0" />
                              Panel Propietario
                            </span>
                            <ChevronRight className="w-4 h-4 shrink-0 opacity-80" />
                          </button>
                        ) : currentUser.role === 'admin' ? (
                          <button
                            onClick={() => { setShowUserMenu(false); onNavigate('admin'); }}
                            className="w-full flex items-center justify-between px-5 py-3.5 bg-indigo-700 hover:bg-indigo-800 text-white transition"
                          >
                            <span className="flex items-center gap-2.5 text-sm font-bold">
                              <ShieldCheck className="w-4 h-4 text-indigo-200 shrink-0" />
                              Panel Administrador
                            </span>
                            <ChevronRight className="w-4 h-4 shrink-0 opacity-60" />
                          </button>
                        ) : null}

                        {/* Lista vertical de navegación */}
                        <div className="divide-y divide-slate-50">
                          <button
                            onClick={() => { setShowUserMenu(false); onNavigate('home'); }}
                            className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition group"
                          >
                            <Search className="w-5 h-5 text-slate-400 group-hover:text-rose-500 shrink-0 transition" />
                            <span className="flex-1 text-sm font-medium text-slate-700 text-left">Explorar Espacios</span>
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-400 shrink-0 transition" />
                          </button>

                          <button
                            onClick={() => { setShowUserMenu(false); onNavigate('my-bookings'); }}
                            className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition group"
                          >
                            <FileText className="w-5 h-5 text-slate-400 group-hover:text-rose-500 shrink-0 transition" />
                            <span className="flex-1 text-sm font-medium text-slate-700 text-left">Mis Reservas</span>
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-400 shrink-0 transition" />
                          </button>

                          <button
                            onClick={() => { setShowUserMenu(false); onNavigate('onboarding'); }}
                            className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition group"
                          >
                            <UserCheck className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 shrink-0 transition" />
                            <span className="flex-1 text-sm font-medium text-slate-700 text-left">
                              {currentUser.verificationStatus === 'verified' ? 'Verificación OK' : 'Verificar Mi Cuenta'}
                            </span>
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-400 shrink-0 transition" />
                          </button>
                        </div>

                        {/* Sección demo multi-rol */}
                        <div className="border-t border-slate-100">
                          <details className="group">
                            <summary className="flex items-center justify-between px-5 py-3 text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer select-none hover:bg-slate-50 transition list-none">
                              <span>Simular usuario (Demo)</span>
                              <ChevronDown className="w-3.5 h-3.5 group-open:rotate-180 transition-transform" />
                            </summary>
                            <div className="pb-1 space-y-0.5 px-3">
                              {allUsers.map((u) => (
                                <button
                                  key={u.id}
                                  onClick={() => {
                                    switchUser(u.id);
                                    setShowUserMenu(false);
                                    if (u.role === 'admin') onNavigate('admin');
                                    else if (u.role === 'owner') onNavigate('owner');
                                    else onNavigate('home');
                                  }}
                                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition ${
                                    u.id === currentUser.id
                                      ? 'bg-rose-50 text-rose-800 font-bold'
                                      : 'text-slate-600 hover:bg-slate-100'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    <img src={u.avatarUrl} alt="" className="w-5 h-5 rounded-full object-cover shrink-0" />
                                    <span className="truncate">{u.fullName}</span>
                                  </div>
                                  <span className="text-[10px] text-slate-400 capitalize shrink-0 ml-1">{u.role}</span>
                                </button>
                              ))}
                            </div>
                          </details>
                        </div>

                        {/* Cerrar sesión */}
                        <div className="border-t border-slate-100">
                          <button
                            onClick={() => { logout(); setShowUserMenu(false); onNavigate('home'); }}
                            className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-rose-50 transition group"
                          >
                            <LogOut className="w-5 h-5 text-rose-400 shrink-0" />
                            <span className="flex-1 text-sm font-semibold text-rose-600 text-left">Cerrar Sesión</span>
                          </button>
                        </div>

                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
