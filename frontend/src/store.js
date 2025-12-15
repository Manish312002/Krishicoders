import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import farmerReducer from './slices/farmerSlice';
import fieldReducer from './slices/fieldSlice';
import sensorReducer from './slices/sensorSlice';
import cropHealthReducer from './slices/cropHealthSlice';
import irrigationReducer from './slices/irrigationSlice';
import alertReducer from './slices/alertSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        farmer: farmerReducer,
        fields: fieldReducer,
        sensors: sensorReducer,
        cropHealth: cropHealthReducer,
        irrigation: irrigationReducer,
        alerts: alertReducer,
    },
});

export default store;
