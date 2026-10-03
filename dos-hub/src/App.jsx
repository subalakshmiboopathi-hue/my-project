import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { PortalLandingPage } from './pages/PortalLandingPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { StudentLoginPage } from './pages/StudentLoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardLayout } from './layouts/DashboardLayout';

// Admin Pages
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminWorkshops } from './pages/AdminWorkshops';
import { AdminAttendance } from './pages/AdminAttendance';
import { AdminFeedback } from './pages/AdminFeedback';
import { AdminRegistrations } from './pages/AdminRegistrations';

// Student Pages
import { StudentDashboard } from './pages/StudentDashboard';
import { StudentWorkshops } from './pages/StudentWorkshops';
import { StudentMyWorkshops } from './pages/StudentMyWorkshops';
import { StudentAttendance } from './pages/StudentAttendance';
import { StudentCertificates } from './pages/StudentCertificates';
import { CertificateView } from './pages/CertificateView';

const MainRouter = () => {
  const { user, isAuthenticated, loading, isAdmin, isStudent, logout } = useAuth();
  
  // Helper to parse route from URL pathname OR hash
  const parseCurrentRoute = () => {
    const rawPath = (window.location.pathname + window.location.hash).toLowerCase();
    if (rawPath.includes('admin/login') || rawPath.includes('admin-login')) {
      return 'admin-login';
    }
    if (rawPath.includes('register')) {
      return 'register';
    }
    if (rawPath.includes('/login') || rawPath.includes('student/login') || rawPath.includes('student-login')) {
      return 'student-login';
    }
    if (rawPath.includes('portal') || rawPath === '/' || rawPath === '') {
      return 'portal';
    }
    return 'portal';
  };

  const [currentRoute, setCurrentRoute] = useState(parseCurrentRoute);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [activeWorkshopId, setActiveWorkshopId] = useState(null);
  const [activeCertificateId, setActiveCertificateId] = useState(null);
  const [isCreateWorkshopOpen, setIsCreateWorkshopOpen] = useState(false);

  // Navigate helper
  const navigateTo = (route, urlPath) => {
    setCurrentRoute(route);
    if (urlPath) {
      window.history.pushState({}, '', urlPath);
    }
  };

  // Listen to browser URL changes (back/forward and hash changes)
  useEffect(() => {
    const handleUrlChange = () => {
      setCurrentRoute(parseCurrentRoute());
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Update dashboard tab when logged in
  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        setCurrentTab('admin-dashboard');
      } else {
        setCurrentTab('student-dashboard');
      }
    }
  }, [isAuthenticated, isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-medium">Initializing DOS Club Portal...</p>
      </div>
    );
  }

  // Explicit Route Handling when user opens a specific login/register URL
  if (currentRoute === 'admin-login') {
    // If already logged in as student, clicking admin-login will allow fresh admin sign-in
    if (isAuthenticated && isStudent) {
      logout();
    }
    if (!isAuthenticated || !isAdmin) {
      return (
        <AdminLoginPage
          onNavigateStudentLogin={() => navigateTo('student-login', '/login')}
        />
      );
    }
  }

  if (currentRoute === 'student-login') {
    // If already logged in as admin, clicking student-login will allow fresh student sign-in
    if (isAuthenticated && isAdmin) {
      logout();
    }
    if (!isAuthenticated || !isStudent) {
      return (
        <StudentLoginPage
          onNavigateRegister={() => navigateTo('register', '/register')}
          onNavigateAdminLogin={() => navigateTo('admin-login', '/admin/login')}
        />
      );
    }
  }

  if (currentRoute === 'register') {
    return (
      <RegisterPage
        onNavigateLogin={() => navigateTo('student-login', '/login')}
      />
    );
  }

  // When visiting root '/' and NOT logged in, show Portal Choice Landing
  if (!isAuthenticated) {
    return (
      <PortalLandingPage
        onSelectAdmin={() => navigateTo('admin-login', '/admin/login')}
        onSelectStudent={() => navigateTo('student-login', '/login')}
        onSelectRegister={() => navigateTo('register', '/register')}
      />
    );
  }

  // Handlers for cross-page navigation
  const handleNavigateAttendance = (workshopId) => {
    setActiveWorkshopId(workshopId);
    setCurrentTab('admin-attendance');
  };

  const handleOpenCertificate = (certId) => {
    setActiveCertificateId(certId);
    setCurrentTab('view-certificate');
  };

  const handleOpenCreateModal = () => {
    setCurrentTab('admin-workshops');
    setIsCreateWorkshopOpen(true);
  };

  return (
    <DashboardLayout
      currentTab={currentTab}
      onSelectTab={(tab) => {
        setCurrentTab(tab);
        if (tab !== 'admin-attendance') {
          setActiveWorkshopId(null);
        }
      }}
    >
      {/* Certificate Viewer */}
      {currentTab === 'view-certificate' && (
        <CertificateView
          certificateId={activeCertificateId}
          onBack={() => setCurrentTab(isAdmin ? 'admin-dashboard' : 'student-certificates')}
        />
      )}

      {/* Admin Views */}
      {isAdmin && (
        <>
          {currentTab === 'admin-dashboard' && (
            <AdminDashboard
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onOpenCreateModal={handleOpenCreateModal}
            />
          )}

          {currentTab === 'admin-workshops' && (
            <AdminWorkshops
              onNavigateAttendance={handleNavigateAttendance}
              isCreateModalOpen={isCreateWorkshopOpen}
              onCloseCreateModal={() => setIsCreateWorkshopOpen(false)}
            />
          )}

          {currentTab === 'admin-attendance' && (
            <AdminAttendance initialWorkshopId={activeWorkshopId} />
          )}

          {currentTab === 'admin-feedback' && <AdminFeedback />}

          {currentTab === 'admin-registrations' && <AdminRegistrations />}
        </>
      )}

      {/* Student Views */}
      {isStudent && (
        <>
          {currentTab === 'student-dashboard' && (
            <StudentDashboard onNavigateTab={(tab) => setCurrentTab(tab)} />
          )}

          {currentTab === 'student-workshops' && (
            <StudentWorkshops onViewCertificate={handleOpenCertificate} />
          )}

          {currentTab === 'student-my-workshops' && (
            <StudentMyWorkshops onViewCertificate={handleOpenCertificate} />
          )}

          {currentTab === 'student-attendance' && (
            <StudentAttendance onViewCertificate={handleOpenCertificate} />
          )}

          {currentTab === 'student-certificates' && (
            <StudentCertificates onViewCertificate={handleOpenCertificate} />
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MainRouter />
      </AuthProvider>
    </ToastProvider>
  );
}
