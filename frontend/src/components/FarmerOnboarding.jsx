import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createFarmerProfile, resetFarmerSuccess } from "../slices/farmerSlice";

const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const cropTypesList = [
    "Grapes", "Sugarcane", "Cotton", "Soybean", "Onion", "Pomegranate",
    "Banana", "Orange", "Sweet Lime", "Mango", "Jowar", "Bajra", "Wheat",
    "Rice", "Maize", "Tur", "Moong", "Urad", "Gram", "Groundnut",
    "Sunflower", "Mustard", "Barley", "Sesame", "Castor", "Safflower",
    "Linseed", "Niger", "Coconut", "Areca nut", "Cardamom", "Pepper",
    "Turmeric", "Ginger", "Coriander", "Chilli", "Garlic", "Tomato",
    "Potato", "Cabbage", "Cauliflower", "Brinjal", "Okra", "Cucumber",
    "Watermelon", "Papaya", "Guava", "Custard Apple", "Fig", "Jackfruit"
];

// Languages mock
const languages = [
    { code: 'en', nativeName: 'English', name: 'English' },
    { code: 'hi', nativeName: 'हिन्दी', name: 'Hindi' },
    { code: 'mr', nativeName: 'मराठी', name: 'Marathi' },
];

export function FarmerOnboarding() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, success } = useSelector((state) => state.farmer);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        state: "",
        district: "",
        village: "",
        lat: "",
        lng: "",
        preferredLanguage: "en",
        farmSize: "",
        cropTypes: [],
    });

    const [locationStatus, setLocationStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'

    useEffect(() => {
        if (success) {
            toast.success("Profile created successfully!");
            dispatch(resetFarmerSuccess());
            navigate("/");
        }
        if (error) {
            toast.error(error);
        }
    }, [success, error, dispatch, navigate]);

    useEffect(() => {
        requestLocationAccess();
    }, []);

    const requestLocationAccess = async () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by this browser");
            return;
        }

        setLocationStatus('loading');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setFormData(prev => ({
                    ...prev,
                    lat: latitude.toString(),
                    lng: longitude.toString(),
                }));
                setLocationStatus('success');
                toast.success("Location detected successfully!");
            },
            (error) => {
                console.error("Location error:", error);
                setLocationStatus('error');
                toast.error("Unable to get location. Please enter coordinates manually.");
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createFarmerProfile({
            name: formData.name,
            phone: formData.phone,
            location: {
                state: formData.state,
                district: formData.district,
                village: formData.village,
                coordinates: {
                    lat: parseFloat(formData.lat),
                    lng: parseFloat(formData.lng),
                },
            },
            preferredLanguage: formData.preferredLanguage,
            farmSize: parseFloat(formData.farmSize),
            cropTypes: formData.cropTypes,
        }));
    };

    const handleCropTypeChange = (cropType, checked) => {
        if (checked) {
            setFormData(prev => ({
                ...prev,
                cropTypes: [...prev.cropTypes, cropType]
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                cropTypes: prev.cropTypes.filter(ct => ct !== cropType)
            }));
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-green-600 mb-6 text-center">
                    Welcome to Krishicoders AI
                </h2>
                <p className="text-gray-600 mb-8 text-center">
                    Let's set up your farmer profile to get started with AI-powered crop monitoring
                </p>

                {/* Location Status */}
                <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="flex items-center space-x-2">
                        <span className="text-blue-600">📍</span>
                        <div>
                            <h4 className="font-medium text-blue-900">Location Access</h4>
                            <p className="text-blue-800 text-sm">
                                {locationStatus === 'loading' && "Detecting your location..."}
                                {locationStatus === 'success' && "Location detected successfully!"}
                                {locationStatus === 'error' && "Please enter your coordinates manually below."}
                                {locationStatus === 'idle' && "We'll help you detect your farm location."}
                            </p>
                        </div>
                    </div>
                    {locationStatus === 'error' && (
                        <button
                            onClick={requestLocationAccess}
                            className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
                        >
                            Try again
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                State *
                            </label>
                            <select
                                required
                                value={formData.state}
                                onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">Select State</option>
                                {indianStates.map(state => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                District *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.district}
                                onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Village *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.village}
                                onChange={(e) => setFormData(prev => ({ ...prev, village: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                    </div>

                    {/* Coordinates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Latitude * {locationStatus === 'success' && <span className="text-green-600 text-xs">(Auto-detected)</span>}
                            </label>
                            <input
                                type="number"
                                step="any"
                                required
                                value={formData.lat}
                                onChange={(e) => setFormData(prev => ({ ...prev, lat: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="e.g., 12.9716"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Longitude * {locationStatus === 'success' && <span className="text-green-600 text-xs">(Auto-detected)</span>}
                            </label>
                            <input
                                type="number"
                                step="any"
                                required
                                value={formData.lng}
                                onChange={(e) => setFormData(prev => ({ ...prev, lng: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="e.g., 77.5946"
                            />
                        </div>
                    </div>

                    {/* Language and Farm Size */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Preferred Language *
                            </label>
                            <select
                                required
                                value={formData.preferredLanguage}
                                onChange={(e) => setFormData(prev => ({ ...prev, preferredLanguage: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                {languages.map(lang => (
                                    <option key={lang.code} value={lang.code}>
                                        {lang.nativeName} ({lang.name})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Farm Size (acres) *
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                required
                                value={formData.farmSize}
                                onChange={(e) => setFormData(prev => ({ ...prev, farmSize: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                    </div>

                    {/* Crop Types */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Crop Types (select all that apply) *
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto border border-gray-300 rounded-md p-3">
                            {cropTypesList.map(cropType => (
                                <label key={cropType} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.cropTypes.includes(cropType)}
                                        onChange={(e) => handleCropTypeChange(cropType, e.target.checked)}
                                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                    />
                                    <span className="text-sm">{cropType}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || formData.cropTypes.length === 0}
                        className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Creating Profile..." : "Create Profile"}
                    </button>
                </form>
            </div>
        </div>
    );
}
