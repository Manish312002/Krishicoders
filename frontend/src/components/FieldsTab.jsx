import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { createField, updateField, deleteField } from "../slices/fieldSlice";

const cropTypes = [
    "Rice", "Wheat", "Cotton", "Sugarcane", "Maize", "Soybean", "Groundnut",
    "Sunflower", "Mustard", "Barley", "Gram", "Tur", "Moong", "Urad"
];

const soilTypes = [
    "Alluvial", "Black Cotton", "Red", "Laterite", "Desert", "Mountain", "Saline"
];

const irrigationTypes = [
    "Drip", "Sprinkler", "Flood", "Furrow", "Basin", "Border Strip"
];

export function FieldsTab() {
    const dispatch = useDispatch();
    const fieldsState = useSelector((state) => state.fields) || {};
    const fields = fieldsState.fields || [];
    const loading = fieldsState.loading;

    const [showAddForm, setShowAddForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        area: "",
        cropType: "",
        plantingDate: "",
        expectedHarvestDate: "",
        lat: "",
        lng: "",
        soilType: "",
        irrigationType: "",
    });
    const [editingId, setEditingId] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const payload = {
                name: formData.name,
                area: parseFloat(formData.area),
                cropType: formData.cropType,
                plantingDate: new Date(formData.plantingDate).getTime(),
                expectedHarvestDate: new Date(formData.expectedHarvestDate).getTime(),
                coordinates: {
                    lat: parseFloat(formData.lat),
                    lng: parseFloat(formData.lng),
                },
                soilType: formData.soilType,
                irrigationType: formData.irrigationType,
            };

            if (editingId) {
                await dispatch(updateField({ id: editingId, updates: payload })).unwrap();
                toast.success('Field updated successfully!');
            } else {
                await dispatch(createField(payload)).unwrap();
                toast.success('Field added successfully!');
            }

            setShowAddForm(false);
            setEditingId(null);
            setFormData({
                name: "",
                area: "",
                cropType: "",
                plantingDate: "",
                expectedHarvestDate: "",
                lat: "",
                lng: "",
                soilType: "",
                irrigationType: "",
            });
        } catch (error) {
            toast.error(error || (editingId ? "Failed to update field." : "Failed to add field. Please try again."));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (field) => {
        setEditingId(field._id);
        setFormData({
            name: field.name || '',
            area: field.area || '',
            cropType: field.cropType || '',
            plantingDate: field.plantingDate ? new Date(field.plantingDate).toISOString().substr(0,10) : '',
            expectedHarvestDate: field.expectedHarvestDate ? new Date(field.expectedHarvestDate).toISOString().substr(0,10) : '',
            lat: field.coordinates?.lat ?? '',
            lng: field.coordinates?.lng ?? '',
            soilType: field.soilType || '',
            irrigationType: field.irrigationType || '',
        });
        setShowAddForm(true);
    };

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);

    const handleDelete = (id) => {
        setDeleteTargetId(id);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        try {
            await dispatch(deleteField(deleteTargetId)).unwrap();
            toast.success('Field deleted');
        } catch (err) {
            toast.error('Failed to delete field');
        } finally {
            setShowDeleteConfirm(false);
            setDeleteTargetId(null);
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
        setDeleteTargetId(null);
    };

    const formatDate = (timestamp) => {
        if (!timestamp && timestamp !== 0) return '—';
        const d = new Date(timestamp);
        return isNaN(d.getTime()) ? '—' : d.toLocaleDateString();
    };

    const getDaysUntilHarvest = (harvestDate) => {
        if (!harvestDate) return 0;
        const days = Math.ceil((harvestDate - Date.now()) / (1000 * 60 * 60 * 24));
        return days > 0 ? days : 0;
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Fields</h2>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    + Add Field
                </button>
            </div>

            {/* Add Field Form */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-4">Add New Field</h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Field Name *
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Area (acres) *
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        required
                                        value={formData.area}
                                        onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Crop Type *
                                    </label>
                                    <select
                                        required
                                        value={formData.cropType}
                                        onChange={(e) => setFormData(prev => ({ ...prev, cropType: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="">Select Crop</option>
                                        {cropTypes.map(crop => (
                                            <option key={crop} value={crop}>{crop}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Soil Type *
                                    </label>
                                    <select
                                        required
                                        value={formData.soilType}
                                        onChange={(e) => setFormData(prev => ({ ...prev, soilType: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="">Select Soil Type</option>
                                        {soilTypes.map(soil => (
                                            <option key={soil} value={soil}>{soil}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Irrigation Type *
                                    </label>
                                    <select
                                        required
                                        value={formData.irrigationType}
                                        onChange={(e) => setFormData(prev => ({ ...prev, irrigationType: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="">Select Irrigation Type</option>
                                        {irrigationTypes.map(irrigation => (
                                            <option key={irrigation} value={irrigation}>{irrigation}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Planting Date *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.plantingDate}
                                        onChange={(e) => setFormData(prev => ({ ...prev, plantingDate: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Expected Harvest Date *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.expectedHarvestDate}
                                        onChange={(e) => setFormData(prev => ({ ...prev, expectedHarvestDate: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Latitude *
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        required
                                        value={formData.lat}
                                        onChange={(e) => setFormData(prev => ({ ...prev, lat: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Longitude *
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        required
                                        value={formData.lng}
                                        onChange={(e) => setFormData(prev => ({ ...prev, lng: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                                >
                                    {isSubmitting ? "Saving..." : "Save Field"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
                        <p className="mb-4">Are you sure you want to delete this field? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-3">
                            <button onClick={cancelDelete} className="px-4 py-2 border rounded">Cancel</button>
                            <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fields.map((field) => (
                    <div key={field._id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">{field.name}</h3>
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                {field.cropType}
                            </span>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex justify-between">
                                <span>Area:</span>
                                <span className="font-medium">{field.area} acres</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Soil Type:</span>
                                <span className="font-medium">{field.soilType}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Irrigation:</span>
                                <span className="font-medium">{field.irrigationType}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Planted:</span>
                                <span className="font-medium">{formatDate(field.plantingDate)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Harvest in:</span>
                                <span className="font-medium text-green-600">
                                    {getDaysUntilHarvest(field.expectedHarvestDate)} days
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">Field Health</span>
                                <div className="flex items-center space-x-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm font-medium text-green-600">Healthy</span>
                                </div>
                            </div>
                            <div className="flex justify-end mt-3 space-x-2">
                                <button onClick={() => handleEdit(field)} className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded">Edit</button>
                                <button onClick={() => handleDelete(field._id)} className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded">Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {fields.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🌾</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No fields added yet</h3>
                    <p className="text-gray-600 mb-4">Start by adding your first field to monitor your crops</p>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                    >
                        + Add Field
                    </button>
                </div>
            )}
        </div>
    );
}
