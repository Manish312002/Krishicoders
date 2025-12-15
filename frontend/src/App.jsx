import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { SignInForm } from './SignInForm'
import { Toaster } from 'sonner'
import { Dashboard } from './components/Dashboard'
import { FarmerOnboarding } from './components/FarmerOnboarding'
import { LanguageProvider } from './contexts/LanguageContext'
import { logout } from './slices/authSlice'
import { LogOut } from 'lucide-react'

const PrivateRoute = ({ children }) => {
    const { userInfo } = useSelector((state) => state.auth)
    return userInfo ? children : <Navigate to="/login" />
}

// Layout Component with Header
const Layout = ({ children }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4">
                <h2 className="text-xl font-semibold text-green-600">🌾 Krishicoders AI</h2>
                {userInfo && (
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                    >
                        <LogOut size={18} />
                        <span className="text-sm font-medium">Sign Out</span>
                    </button>
                )}
            </header>
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
};

function App() {
    return (
        <LanguageProvider>
            <Router>
                <Toaster position="top-center" />
                <Routes>
                    <Route path="/login" element={
                        <Layout>
                            <div className="flex items-center justify-center min-h-[600px] p-8">
                                <div className="w-full max-w-md mx-auto">
                                    <div className="text-center mb-8">
                                        <h1 className="text-4xl font-bold text-green-600 mb-4">
                                            🌾 Krishicoders AI
                                        </h1>
                                        <p className="text-xl text-gray-600">
                                            Advanced AI-powered crop monitoring system for Indian farmers
                                        </p>
                                        <p className="text-lg text-gray-500 mt-2">
                                            Monitor crops • Detect diseases • Smart irrigation • Multi-language support
                                        </p>
                                    </div>
                                    <SignInForm />
                                </div>
                            </div>
                        </Layout>
                    } />
                    <Route path="/" element={
                        <PrivateRoute>
                            <Layout>
                                <Dashboard />
                            </Layout>
                        </PrivateRoute>
                    } />
                    <Route path="/onboarding" element={
                        <PrivateRoute>
                            <Layout>
                                <FarmerOnboarding />
                            </Layout>
                        </PrivateRoute>
                    } />
                </Routes>
            </Router>
        </LanguageProvider>
    )
}

export default App
