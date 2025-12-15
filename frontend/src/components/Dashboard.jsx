import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getFarmerProfile } from '../slices/farmerSlice'
import { getFields } from '../slices/fieldSlice'
import { Link, useNavigate } from 'react-router-dom'
import { LogOut, LayoutDashboard, CloudRain, Activity, Droplets, Bell } from 'lucide-react'
import { logout } from '../slices/authSlice'
import { FieldsTab } from './FieldsTab'
import { SensorsTab } from './SensorsTab'
import { CropHealthTab } from './CropHealthTab'
import { IrrigationTab } from './IrrigationTab'
import { AlertsTab } from './AlertsTab'
import { useLanguage } from '../contexts/LanguageContext'
import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
import { Droplet, Wind, Thermometer } from 'lucide-react'

function WeatherWidget() {
    const [weather, setWeather] = React.useState(null);
    const { userInfo } = useSelector((state) => state.auth);

    React.useEffect(() => {
        const fetchWeather = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get(`${API_URL}/api/weather`, config);
                setWeather(data);
            } catch (error) {
                console.error("Failed to fetch weather", error);
            }
        };
        if (userInfo) fetchWeather();
    }, [userInfo]);

    if (!weather) return <div className="h-48 bg-gray-100 rounded-lg animate-pulse"></div>;

    return (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-blue-100 font-medium mb-1">{weather.location.city}, {weather.location.state}</h3>
                    <div className="flex items-center space-x-4">
                        <span className="text-5xl font-bold">{weather.current.temp_c}°C</span>
                        <div className="flex flex-col">
                            <span className="font-medium">{weather.current.condition.text}</span>
                            <span className="text-sm text-blue-100">AQI: {weather.current.air_quality.pm2_5} (Good)</span>
                        </div>
                    </div>
                </div>
                <div className="text-right space-y-2">
                    <div className="flex items-center justify-end space-x-2">
                        <Wind size={18} className="text-blue-200" />
                        <span>{weather.current.wind_kph} km/h</span>
                    </div>
                    <div className="flex items-center justify-end space-x-2">
                        <Droplet size={18} className="text-blue-200" />
                        <span>{weather.current.humidity}% Humidity</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function Dashboard() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { farmer: farmerProfile, loading, error } = useSelector((state) => state.farmer)
    const { fields } = useSelector((state) => state.fields)
    const { userInfo } = useSelector((state) => state.auth)
    const [activeTab, setActiveTab] = React.useState('dashboard')
    const { t, setLanguage, currentLanguage } = useLanguage();

    useEffect(() => {
        dispatch(getFarmerProfile())
    }, [dispatch])

    // Load fields from backend once the farmer profile is available
    useEffect(() => {
        if (farmerProfile) {
            dispatch(getFields());
        }
    }, [dispatch, farmerProfile]);

    useEffect(() => {
        if (!loading && error === 'Farmer profile not found') {
            navigate('/onboarding')
        }
    }, [loading, error, navigate])

    const handleLogout = () => {
        dispatch(logout())
        navigate('/login')
    }


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        )
    }

    // Redirect if no profile found
    if (!farmerProfile && !loading) {
        if (error === 'Farmer profile not found') {
            navigate('/onboarding');
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <p className="text-xl text-gray-600">Redirecting to onboarding...</p>
                </div>
            );
        }
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:block fixed h-full">
                {/* <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl">🌾</span>
                        <h1 className="text-xl font-bold text-gray-900">AgriSmart AI</h1>
                    </div>
                </div> */}

                <nav className="p-4 space-y-1">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <LayoutDashboard size={20} />
                        <span className="font-medium">{t('dashboard')}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('fields')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'fields' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <CloudRain size={20} />
                        <span className="font-medium">{t('fields')}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('sensors')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'sensors' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Activity size={20} />
                        <span className="font-medium">{t('sensors')}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('cropHealth')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'cropHealth' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <span className="text-xl">🔬</span>
                        <span className="font-medium">{t('cropHealth')}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('irrigation')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'irrigation' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Droplets size={20} />
                        <span className="font-medium">{t('irrigation')}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('alerts')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'alerts' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Bell size={20} />
                        <span className="font-medium">{t('alerts')}</span>
                    </button>
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-gray-600">
                            Language:
                        </div>
                        <select
                            value={currentLanguage}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="bg-white border rounded px-2 py-1 text-sm font-medium text-gray-700"
                        >
                            <option value="en">English</option>
                            <option value="hi">Hindi</option>
                        </select>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center space-x-2 text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    >
                        <LogOut size={18} />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {t('dashboard')}
                        </h2>
                        <p className="text-gray-500">Welcome back, {farmerProfile?.name}</p>
                        <p className="text-gray-600">
                            {farmerProfile?.location?.village}, {farmerProfile?.location?.district}, {farmerProfile?.location?.state}
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="bg-white p-2 rounded-full shadow-sm border border-gray-200">
                            <span className="text-xl">👤</span>
                        </div>
                    </div>
                </header>

                {/* Tab Content */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[500px] p-6">
                    {activeTab === 'dashboard' && (
                        <div className="space-y-6">
                            {/* Weather Widget */}
                            <WeatherWidget />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Link to="#" onClick={() => setActiveTab('fields')} className="block">
                                    <div className="bg-green-50 p-6 rounded-lg border border-green-100 hover:border-green-300 transition-colors cursor-pointer">
                                        <h3 className="font-medium text-green-900 mb-2">My Fields</h3>
                                        <p className="text-3xl font-bold text-green-700">{fields?.length || 0}</p>
                                    </div>
                                </Link>
                                <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                                    <h3 className="font-medium text-blue-900 mb-2">Active Sensors</h3>
                                    <p className="text-3xl font-bold text-blue-700">12</p>
                                </div>
                                <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
                                    <h3 className="font-medium text-purple-900 mb-2">Pending Alerts</h3>
                                    <p className="text-3xl font-bold text-purple-700">3</p>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'fields' && <FieldsTab />}
                    {activeTab === 'sensors' && <SensorsTab />}
                    {activeTab === 'cropHealth' && <CropHealthTab />}
                    {activeTab === 'irrigation' && <IrrigationTab />}
                    {activeTab === 'alerts' && <AlertsTab />}
                </div>
            </main>
        </div>
    )
}
