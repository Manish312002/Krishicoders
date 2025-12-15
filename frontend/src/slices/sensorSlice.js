import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Get sensors for a field
export const getSensorsByField = createAsyncThunk('sensors/getByField', async (fieldId, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        if (!userInfo || !userInfo.token) return rejectWithValue('Not authenticated');
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.get(`${API_URL}/api/sensors/${fieldId}`, config);
        return data;
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        );
    }
});

// Create new sensor
export const createSensor = createAsyncThunk('sensors/create', async (sensorData, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        if (!userInfo || !userInfo.token) return rejectWithValue('Not authenticated');
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.post(`${API_URL}/api/sensors`, sensorData, config);
        return data;
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        );
    }
});

// Add reading (Mocking simulation)
export const addReading = createAsyncThunk('sensors/addReading', async (readingData, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        if (!userInfo || !userInfo.token) return rejectWithValue('Not authenticated');
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.post(`${API_URL}/api/sensors/reading`, readingData, config);
        return data;
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        );
    }
});

const sensorSlice = createSlice({
    name: 'sensors',
    initialState: {
        sensors: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getSensorsByField.pending, (state) => {
                state.loading = true;
            })
            .addCase(getSensorsByField.fulfilled, (state, action) => {
                state.loading = false;
                state.sensors = action.payload;
            })
            .addCase(getSensorsByField.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createSensor.fulfilled, (state, action) => {
                state.sensors.push(action.payload);
            })
            .addCase(addReading.fulfilled, (state, action) => {
                // Update the sensor's last reading in the state
                const index = state.sensors.findIndex(s => s._id === action.payload.sensorId);
                if (index !== -1) {
                    state.sensors[index].lastReading = {
                        value: action.payload.value,
                        unit: action.payload.unit,
                        timestamp: action.payload.timestamp
                    };
                }
            });
    },
});

export default sensorSlice.reducer;
