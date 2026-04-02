import React, { useEffect, useState, Component, ErrorInfo, ReactNode } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Programs } from './pages/Programs';
import { Coaches } from './pages/Coaches';
import { Membership } from './pages/Membership';
import { Blog } from './pages/Blog';
import { BlogPostViewer } from './pages/BlogPostViewer';
import { Testimonials } from './pages/Testimonials';
import { PersonalizedPlans } from './pages/PersonalizedPlans';
import { Counseling } from './pages/Counseling';
import { LegalViewer } from './pages/LegalViewer';
import { StorageService } from './services/storage';
import { auth } from './firebase';

// Admin Pages
import { AdminLogin } from './admin/AdminLogin';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminPrograms } from './admin/AdminPrograms';
import { AdminLayout } from './admin/AdminLayout';
import { AdminLeads } from './admin/AdminLeads';
import { AdminCoaches } from './admin/AdminCoaches';
import { AdminBlogs } from './admin/AdminBlogs';
import { AdminOffers } from './admin/AdminOffers';
import { AdminSettings } from './admin/AdminSettings';
import { AdminMemberships } from './admin/AdminMemberships';
import { AdminTestimonials } from './admin/AdminTestimonials';
import { AdminPlanInquiries } from './admin/AdminPlanInquiries';
import { AdminLegalPages } from './admin/AdminLegalPages';
import { AdminCounseling } from './admin/AdminCounseling';
import { AdminFreeResources } from './admin/AdminFreeResources';

// Error Boundary
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean, error: any }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">The application encountered an error. Please try refreshing the page.</p>
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-40">
              {this.state.error?.message || String(this.state.error)}
            </pre>
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 w-full bg-black text-white py-2 rounded font-bold hover:bg-gray-800"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // Since we are using Anonymous Login for Admin, we just check if a user exists
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  return <AdminLayout>{children}</AdminLayout>;
};

const App: React.FC = () => {
  useEffect(() => {
    StorageService.init();
  }, []);

  return (
    <ErrorBoundary>
      <HashRouter>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/programs" element={<ProtectedRoute><AdminPrograms /></ProtectedRoute>} />
          <Route path="/admin/coaches" element={<ProtectedRoute><AdminCoaches /></ProtectedRoute>} />
          <Route path="/admin/leads" element={<ProtectedRoute><AdminLeads /></ProtectedRoute>} />
          <Route path="/admin/blogs" element={<ProtectedRoute><AdminBlogs /></ProtectedRoute>} />
          <Route path="/admin/offers" element={<ProtectedRoute><AdminOffers /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
          <Route path="/admin/memberships" element={<ProtectedRoute><AdminMemberships /></ProtectedRoute>} />
          <Route path="/admin/testimonials" element={<ProtectedRoute><AdminTestimonials /></ProtectedRoute>} />
          <Route path="/admin/plan-inquiries" element={<ProtectedRoute><AdminPlanInquiries /></ProtectedRoute>} />
          <Route path="/admin/free-resources" element={<ProtectedRoute><AdminFreeResources /></ProtectedRoute>} />
          <Route path="/admin/legal-pages" element={<ProtectedRoute><AdminLegalPages /></ProtectedRoute>} />
          <Route path="/admin/counseling" element={<ProtectedRoute><AdminCounseling /></ProtectedRoute>} />

          {/* Public Routes */}
          <Route
            path="*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/programs" element={<Programs />} />
                  <Route path="/coaches" element={<Coaches />} />
                  <Route path="/membership" element={<Membership />} />
                  <Route path="/testimonials" element={<Testimonials />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPostViewer />} />
                  <Route path="/personalized-plans" element={<PersonalizedPlans />} />
                  <Route path="/counseling" element={<Counseling />} />
                  <Route path="/legal/:slug" element={<LegalViewer />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </HashRouter>
    </ErrorBoundary>
  );
};


export default App;
