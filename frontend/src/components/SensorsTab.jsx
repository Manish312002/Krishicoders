import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSensorsByField, createSensor, addReading } from "../slices/sensorSlice";
import { toast } from "sonner";
import { useLanguage } from "../contexts/LanguageContext";

export function SensorsTab() {
    const dispatch = useDispatch();
    const { t } = useLanguage();

    const sensorsState = useSelector((state) => state.sensors) || {};
    const sensors = sensorsState.sensors || [];
    const loading = sensorsState.loading;

    const fieldsState = useSelector((state) => state.fields) || {};
    const fields = fieldsState.fields || [];

    // Select the first field by default to show sensors for
    const [selectedFieldId, setSelectedFieldId] = useState(fields.length > 0 ? fields[0]._id : null);

    useEffect(() => {
        if (selectedFieldId) {
            dispatch(getSensorsByField(selectedFieldId));
        }
    }, [dispatch, selectedFieldId]);

    const handleSimulateData = async () => {
        if (sensors.length === 0) {
            toast.error("No sensors to simulate data for.");
            return;
        }

        // Simulate reading for the first sensor
        const sensor = sensors[0];
        const newValue = Math.floor(Math.random() * 100);

        try {
            await dispatch(addReading({
                sensorId: sensor._id,
                value: newValue,
                unit: sensor.type === 'Temperature' ? '°C' : '%',
                sensorType: sensor.type
            })).unwrap();
            toast.success(`New reading received: ${newValue} for ${sensor.type}`);
        } catch (error) {
            toast.error("Failed to simulate data");
        }
    };

    const handleAddSensor = async () => {
        if (!selectedFieldId) return;

        const types = ["Moisture", "Temperature", "Humidity"];
        const type = types[Math.floor(Math.random() * types.length)];

        try {
            await dispatch(createSensor({
                fieldId: selectedFieldId,
                sensorId: `S-${Math.floor(Math.random() * 1000)}`,
                type: type,
                location: { lat: 0, lng: 0 }
            })).unwrap();
            toast.success("New sensor paired successfully!");
        } catch (error) {
            toast.error("Failed to add sensor");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "normal": return "text-green-600 bg-green-100";
            case "low": return "text-yellow-600 bg-yellow-100";
            case "high": return "text-red-600 bg-red-100";
            default: return "text-green-600 bg-green-100";
        }
    };

    const getSensorIcon = (type) => {
        switch (type) {
            case "Moisture": return "💧";
            case "Temperature": return "🌡️";
            case "Humidity": return "💨";
            default: return "📡";
        }
    };

    if (!selectedFieldId) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">Please add a field first to view sensors.</p>
            </div>
        )
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">{t("sensors")}</h2>
                    <div className="flex items-center space-x-2 mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-600">Live Data for: {fields.find(f => f._id === selectedFieldId)?.name}</span>
                    </div>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={handleSimulateData}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
                    >
                        Simulate Data
                    </button>
                    <button
                        onClick={handleAddSensor}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm font-medium"
                    >
                        + Pair Sensor
                    </button>
                </div>
            </div>

            {/* Sensor Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sensors.map((sensor) => (
                    <div key={sensor._id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <span className="text-2xl">{getSensorIcon(sensor.type)}</span>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{sensor.type}</h3>
                                    <p className="text-sm text-gray-500">ID: {sensor.sensorId}</p>
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor('normal')}`}>
                                Active
                            </span>
                        </div>

                        <div className="mb-4">
                            <div className="flex items-baseline space-x-2">
                                <span className="text-3xl font-bold text-gray-900">
                                    {sensor.lastReading ? sensor.lastReading.value : '--'}
                                </span>
                                <span className="text-lg text-gray-600">
                                    {sensor.lastReading ? sensor.lastReading.unit : ''}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center text-sm text-gray-500">
                            <span>Last reading</span>
                            <span>
                                {sensor.lastReading
                                    ? new Date(sensor.lastReading.timestamp).toLocaleTimeString()
                                    : 'Never'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {sensors.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    No sensors paired to this field yet.
                </div>
            )}

            {/* Sensor History Chart Placeholder */}
            <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sensor Trends (Last 24 Hours)</h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-4xl mb-2">📊</div>
                        <p className="text-gray-600">Sensor trend charts will be displayed here</p>
                        <p className="text-sm text-gray-500">Real-time data visualization coming soon</p>
                    </div>
                </div>
            </div>

            {/* Sensor Management */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                    <span className="text-blue-600">ℹ️</span>
                    <h4 className="font-medium text-blue-900">IoT Sensor Integration</h4>
                </div>
                <p className="text-blue-800 text-sm">
                    Connect your IoT sensors to automatically receive real-time data.
                    Sensors will send data via WiFi/LoRaWAN to our cloud platform for instant monitoring and alerts.
                </p>
            </div>
        </div>
    );
}
