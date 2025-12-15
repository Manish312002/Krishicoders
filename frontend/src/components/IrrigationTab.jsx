import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getIrrigationSystems,
    controlIrrigation,
    getIrrigationLogs,
    createIrrigationSystem
} from "../slices/irrigationSlice";
import { toast } from "sonner";

export function IrrigationTab() {
    const dispatch = useDispatch();
    const { fields } = useSelector((state) => state.fields);
    const { systems, logs, loading } = useSelector((state) => state.irrigation);

    const [selectedFieldId, setSelectedFieldId] = useState(fields.length > 0 ? fields[0]._id : null);

    useEffect(() => {
        if (selectedFieldId) {
            dispatch(getIrrigationSystems(selectedFieldId));
            dispatch(getIrrigationLogs(selectedFieldId));
        }
    }, [dispatch, selectedFieldId]);

    const handleStartIrrigation = async (systemId) => {
        try {
            await dispatch(controlIrrigation({
                systemId,
                action: 'start',
                duration: 30 // hardcoded 30 mins for demo
            })).unwrap();
            toast.success("Irrigation started for 30 minutes");
            // Refresh logs
            dispatch(getIrrigationLogs(selectedFieldId));
        } catch (error) {
            toast.error("Failed to start irrigation");
        }
    };

    const handleStopIrrigation = async (systemId) => {
        try {
            await dispatch(controlIrrigation({
                systemId,
                action: 'stop'
            })).unwrap();
            toast.success("Irrigation stopped");
            dispatch(getIrrigationLogs(selectedFieldId));
        } catch (error) {
            toast.error("Failed to stop irrigation");
        }
    };

    const handleCreateSystem = async () => {
        if (!selectedFieldId) return;
        try {
            await dispatch(createIrrigationSystem({
                fieldId: selectedFieldId,
                type: 'Drip',
                zoneId: `Zone-${Math.floor(Math.random() * 10)}`
            })).unwrap();
            toast.success("New irrigation system added");
        } catch (error) {
            toast.error("Failed to create system");
        }
    }

    if (!selectedFieldId) {
        return <div className="p-6 text-center text-gray-500">Please create a field first.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Irrigation Control</h2>
                    <p className="text-sm text-gray-500">Managing: {fields.find(f => f._id === selectedFieldId)?.name}</p>
                </div>
                <button
                    onClick={handleCreateSystem}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                    + Add System
                </button>
            </div>

            {/* Systems Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {systems.map(system => (
                    <div key={system._id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center space-x-2">
                                <span className="text-2xl">🚿</span>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{system.type} System</h3>
                                    <p className="text-sm text-gray-500">{system.zoneId}</p>
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${system.status === 'running'
                                    ? 'bg-blue-100 text-blue-800 animate-pulse'
                                    : 'bg-gray-100 text-gray-600'
                                }`}>
                                {system.status === 'running' ? 'Active' : 'Idle'}
                            </span>
                        </div>

                        <div className="flex space-x-3 mt-4">
                            {system.status === 'idle' ? (
                                <button
                                    onClick={() => handleStartIrrigation(system._id)}
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Start (30m)
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleStopIrrigation(system._id)}
                                    className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors"
                                >
                                    Stop
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                {systems.length === 0 && (
                    <div className="col-span-full text-center py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed">
                        No irrigation systems found. Add one to get started.
                    </div>
                )}
            </div>

            {/* Logs Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-medium text-gray-900">Recent Activity Logs</h3>
                </div>
                <div className="divide-y divide-gray-200">
                    {logs.length > 0 ? logs.map(log => (
                        <div key={log._id} className="px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className={`w-2 h-2 rounded-full ${log.status === 'running' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {log.status === 'running' ? 'Irrigation In Progress' : 'Irrigation Completed'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Started: {new Date(log.startTime).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">
                                    {log.waterAmount > 0 ? `${log.waterAmount} Liters` : '-'}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Duration: {log.duration} mins
                                </p>
                            </div>
                        </div>
                    )) : (
                        <div className="px-6 py-8 text-center text-sm text-gray-500">
                            No activity logs yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
