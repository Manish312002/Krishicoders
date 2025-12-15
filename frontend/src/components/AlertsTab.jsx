import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAlerts, resolveAlert, createAlert } from "../slices/alertSlice";
import { toast } from "sonner";

export function AlertsTab() {
    const dispatch = useDispatch();
    const { alerts, loading } = useSelector((state) => state.alerts);
    const { fields } = useSelector((state) => state.fields);

    useEffect(() => {
        dispatch(getAlerts());
    }, [dispatch]);

    const handleResolve = async (alertId) => {
        try {
            await dispatch(resolveAlert(alertId)).unwrap();
            toast.success("Alert marked as resolved");
        } catch (error) {
            toast.error("Failed to resolve alert");
        }
    };

    const handleSimulateAlert = async () => {
        if (fields.length === 0) {
            toast.error("Need fields to create alerts");
            return;
        }

        const severities = ['low', 'medium', 'high', 'critical'];
        const types = ['pest', 'disease', 'water', 'weather'];
        const messages = [
            "Moisture levels dropped below 20%",
            "Potential pest infestation detected",
            "Forecast implies heavy rain tomorrow",
            "NPK values critical low"
        ];

        try {
            await dispatch(createAlert({
                fieldId: fields[0]._id, // Attach to first field for demo
                type: types[Math.floor(Math.random() * types.length)],
                severity: severities[Math.floor(Math.random() * severities.length)],
                title: "System Alert",
                message: messages[Math.floor(Math.random() * messages.length)]
            })).unwrap();
            toast.success("New alert simulated");
        } catch (error) {
            toast.error("Failed to simulate alert");
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical': return 'bg-red-100 text-red-800 border-red-200';
            case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Alerts & Notifications</h2>
                <button
                    onClick={handleSimulateAlert}
                    className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900"
                >
                    🔔 Simulate Alert
                </button>
            </div>

            <div className="space-y-4">
                {alerts.map(alert => (
                    <div
                        key={alert._id}
                        className={`p-4 rounded-lg border flex justify-between items-start ${alert.isResolved ? 'bg-gray-50 opacity-60' : 'bg-white shadow-sm'}`}
                    >
                        <div className="flex items-start space-x-4">
                            <div className={`mt-1 w-3 h-3 rounded-full ${alert.isResolved ? 'bg-gray-400' : 'bg-red-500 animate-pulse'}`}></div>
                            <div>
                                <div className="flex items-center space-x-2">
                                    <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                                    <span className={`px-2 py-0.5 rounded text-xs border ${getSeverityColor(alert.severity)}`}>
                                        {alert.severity.toUpperCase()}
                                    </span>
                                </div>
                                <p className="text-gray-600 mt-1">{alert.message}</p>
                                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                    <span>Field: {alert.fieldId ? alert.fieldId.name : 'Unknown'}</span>
                                    <span>{new Date(alert.createdAt).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {!alert.isResolved && (
                            <button
                                onClick={() => handleResolve(alert._id)}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Mark Resolved
                            </button>
                        )}
                        {alert.isResolved && (
                            <span className="text-sm text-green-600 flex items-center">
                                ✓ Resolved
                            </span>
                        )}
                    </div>
                ))}

                {alerts.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <span className="text-4xl block mb-2">✅</span>
                        No active alerts. Everything looks good!
                    </div>
                )}
            </div>
        </div>
    );
}
