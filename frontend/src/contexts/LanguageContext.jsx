import React, { createContext, useContext, useState } from "react";

const languages = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "hi", name: "Hindi", nativeName: "हिंदी" },
    { code: "te", name: "Telugu", nativeName: "తెలుగు" },
    { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
    { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
    { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
    { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
    { code: "mr", name: "Marathi", nativeName: "मराठी" },
    { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
    { code: "bn", name: "Bengali", nativeName: "বাংলা" },
    { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ" },
];

const translations = {
    en: {
        dashboard: "Dashboard",
        fields: "Fields",
        sensors: "Sensors",
        alerts: "Alerts",
        irrigation: "Irrigation",
        cropHealth: "Crop Health",
        addField: "Add Field",
        fieldName: "Field Name",
        cropType: "Crop Type",
        area: "Area (acres)",
        soilType: "Soil Type",
        irrigationType: "Irrigation Type",
        plantingDate: "Planting Date",
        harvestDate: "Expected Harvest Date",
        save: "Save",
        cancel: "Cancel",
        uploadImage: "Upload Crop Image",
        analyzing: "Analyzing...",
        diseaseDetected: "Disease Detected",
        healthy: "Healthy",
        needsAttention: "Needs Attention",
        startIrrigation: "Start Irrigation",
        stopIrrigation: "Stop Irrigation",
        duration: "Duration (minutes)",
        moistureLevel: "Moisture Level",
        temperature: "Temperature",
        humidity: "Humidity",
        notifications: "Notification",
        markAsRead: "Mark as Read",
        resolve: "Resolve",
    },
    hi: {
        dashboard: "डैशबोर्ड",
        fields: "खेत",
        sensors: "सेंसर",
        alerts: "अलर्ट",
        irrigation: "सिंचाई",
        cropHealth: "फसल स्वास्थ्य",
        addField: "खेत जोड़ें",
        fieldName: "खेत का नाम",
        cropType: "फसल का प्रकार",
        area: "क्षेत्रफल (एकड़)",
        soilType: "मिट्टी का प्रकार",
        irrigationType: "सिंचाई का प्रकार",
        plantingDate: "बुआई की तारीख",
        harvestDate: "अपेक्षित कटाई की तारीख",
        save: "सेव करें",
        cancel: "रद्द करें",
        uploadImage: "फसल की तस्वीर अपलोड करें",
        analyzing: "विश्लेषण कर रहे हैं...",
        diseaseDetected: "बीमारी का पता चला",
        healthy: "स्वस्थ",
        needsAttention: "ध्यान देने की जरूरत",
        startIrrigation: "सिंचाई शुरू करें",
        stopIrrigation: "सिंचाई बंद करें",
        duration: "अवधि (मिनट)",
        moistureLevel: "नमी का स्तर",
        temperature: "तापमान",
        humidity: "आर्द्रता",
        notifications: "सूचनाएं",
        markAsRead: "पढ़ा हुआ मार्क करें",
        resolve: "हल करें",
    },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [currentLanguage, setCurrentLanguage] = useState("en");

    const setLanguage = (code) => {
        setCurrentLanguage(code);
    };

    const t = (key) => {
        return translations[currentLanguage]?.[key] || translations.en[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ currentLanguage, setLanguage, t, languages }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
