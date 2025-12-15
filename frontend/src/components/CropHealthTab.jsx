import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { analyzeCropImage, resetAnalysis } from "../slices/cropHealthSlice";
import { toast } from "sonner";
import axios from "axios";
import { useLanguage } from "../contexts/LanguageContext";

export function CropHealthTab() {
    const [history, setHistory] = useState([]);

    const { t } = useLanguage();
    const dispatch = useDispatch();
    const fieldsState = useSelector((state) => state.fields) || {};
    const fields = fieldsState.fields || [];
    const { analysisResult, loading, error } = useSelector((state) => state.cropHealth);
    const { userInfo } = useSelector((state) => state.auth);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const [selectedFieldId, setSelectedFieldId] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [notes, setNotes] = useState("");

    const fileInputRef = useRef(null);

    // Fetch history
    useEffect(() => {
        const fetchHistory = async () => {
            if (!selectedFieldId) return;
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get(`${API_URL}/api/ai/history/${selectedFieldId}`, config);
                setHistory(data);
            } catch (error) {
                console.error("Failed to fetch history", error);
            }
        };
        fetchHistory();
    }, [selectedFieldId, analysisResult, userInfo.token]);

    useEffect(() => {
        if (fields && fields.length > 0 && !selectedFieldId) {
            setSelectedFieldId(fields[0]._id);
        }
    }, [fields, selectedFieldId]);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setIsUploading(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data } = await axios.post(`${API_URL}/api/upload`, formData, config);
            setImageUrl(data.url);
            toast.success("Image uploaded successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload image");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFieldId || !imageUrl) {
            toast.error("Please select a field and provide an image");
            return;
        }

        try {
            await dispatch(analyzeCropImage({
                fieldId: selectedFieldId,
                imageUrl,
                notes
            })).unwrap();
            toast.success("Analysis complete!");
        } catch (err) {
            toast.error("Analysis failed. Please try again.");
        }
    };

    const handleReset = () => {
        dispatch(resetAnalysis());
        setImageUrl("");
        setNotes("");
    };

    const getHealthScoreColor = (score) => {
        if (score >= 80) return "text-green-600";
        if (score >= 60) return "text-yellow-600";
        return "text-red-600";
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">{t('cropHealth')}</h2>
                <select
                    value={selectedFieldId}
                    onChange={(e) => setSelectedFieldId(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <option value="">Select Field</option>
                    {fields.map(field => (
                        <option key={field._id} value={field._id}>{field.name}</option>
                    ))}
                </select>
            </div>

            {!selectedFieldId ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔬</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a field for crop health analysis</h3>
                    <p className="text-gray-600">Choose a field from the dropdown above to start monitoring</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Input Section */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Capture or Upload Crop Images</h3>

                        <div className="flex flex-col sm:flex-row gap-4 mb-4">
                            <button
                                disabled={true} // Camera not implemented
                                className="flex-1 bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 opacity-50 cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                <span>📸</span>
                                <span>Capture with Camera (Coming Soon)</span>
                            </button>
                            <div className="flex-1">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleFileUpload}
                                    accept="image/*"
                                />
                                <button
                                    onClick={() => fileInputRef.current.click()}
                                    disabled={isUploading}
                                    className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 flex items-center justify-center space-x-2"
                                >
                                    <span>📁</span>
                                    <span>{isUploading ? "Uploading..." : "Upload from Gallery"}</span>
                                </button>
                            </div>
                        </div>

                        {/* Analysis Trigger - Only show if image is uploaded but not analyzed yet */}
                        {imageUrl && !loading && !analysisResult && (
                            <div className="mb-4 p-4 bg-gray-50 rounded-lg flex flex-col md:flex-row items-center gap-4">
                                <img src={imageUrl} alt="Preview" className="h-24 w-24 object-cover rounded-lg" />
                                <div className="flex-1 w-full">
                                    <textarea
                                        rows="2"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        placeholder="Add notes (optional)..."
                                    />
                                </div>
                                <button
                                    onClick={handleSubmit}
                                    className="w-full md:w-auto bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700"
                                >
                                    Analyze Now
                                </button>
                            </div>
                        )}

                        {loading && (
                            <div className="text-center py-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
                                <p className="text-gray-600">Analyzing crop health...</p>
                            </div>
                        )}

                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="text-blue-600">💡</span>
                                <h4 className="font-medium text-blue-900">Tips for Best Results</h4>
                            </div>
                            <ul className="text-blue-800 text-sm space-y-1">
                                <li>• Take photos in good lighting conditions</li>
                                <li>• Focus on leaves, stems, and any visible issues</li>
                                <li>• Capture multiple angles of affected areas</li>
                            </ul>
                        </div>
                    </div>

                    {/* Analysis Results Gallery */}
                    {(history.length > 0 || analysisResult) && (
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis History</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Show current analysis result immediately if available */}
                                {analysisResult && (
                                    <div className="border border-green-200 bg-green-50 rounded-lg overflow-hidden relative">
                                        <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">New</div>
                                        <img src={imageUrl} alt="Current" className="w-full h-48 object-cover" />
                                        <div className="p-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm text-gray-500">Just now</span>
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Completed
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium">Health Score:</span>
                                                <span className={`font-bold ${getHealthScoreColor(analysisResult.analysisResults.healthScore)}`}>
                                                    {analysisResult.analysisResults.healthScore}/100
                                                </span>
                                            </div>
                                            {/* Only showing detection summary for brevity in card */}
                                            {analysisResult.analysisResults.diseaseDetected && (
                                                <div className="mt-2 text-xs text-red-700">
                                                    Disease Detected!
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {history.map((record) => (
                                    <div key={record._id} className="border border-gray-200 rounded-lg overflow-hidden">
                                        <img src={record.imageUrl} alt="Historical" className="w-full h-48 object-cover" />
                                        <div className="p-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm text-gray-500">{new Date(record.analysisDate).toLocaleDateString()}</span>
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Completed
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium">Health Score:</span>
                                                <span className={`font-bold ${getHealthScoreColor(record.analysisResults?.healthScore || 0)}`}>
                                                    {record.analysisResults?.healthScore || 0}/100
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
