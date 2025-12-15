import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Get irrigation systems
export const getIrrigationSystems = createAsyncThunk('irrigation/getSystems', async (fieldId, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        if (!userInfo || !userInfo.token) return rejectWithValue('Not authenticated');
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.get(`${API_URL}/api/irrigation/systems/${fieldId}`, config);
        return data;
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        );
    }
});

// Control irrigation (Start/Stop)
export const controlIrrigation = createAsyncThunk('irrigation/control', async ({ systemId, action, duration }, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        if (!userInfo || !userInfo.token) return rejectWithValue('Not authenticated');
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.post(`${API_URL}/api/irrigation/control`, { systemId, action, duration }, config);
        return data; // returns { message, system }
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        );
    }
});

// Get logs
export const getIrrigationLogs = createAsyncThunk('irrigation/getLogs', async (fieldId, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        if (!userInfo || !userInfo.token) return rejectWithValue('Not authenticated');
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.get(`${API_URL}/api/irrigation/logs/${fieldId}`, config);
        return data;
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        );
    }
});

// Create system (for demo purposes)
export const createIrrigationSystem = createAsyncThunk('irrigation/createSystem', async (systemData, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        if (!userInfo || !userInfo.token) return rejectWithValue('Not authenticated');
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.post(`${API_URL}/api/irrigation/systems`, systemData, config);
        return data;
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        );
    }
});

const irrigationSlice = createSlice({
    name: 'irrigation',
    initialState: {
        systems: [],
        logs: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Get Systems
            .addCase(getIrrigationSystems.pending, (state) => {
                state.loading = true;
            })
            .addCase(getIrrigationSystems.fulfilled, (state, action) => {
                state.loading = false;
                state.systems = action.payload;
            })
            .addCase(getIrrigationSystems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Control
            .addCase(controlIrrigation.fulfilled, (state, action) => {
                // Update the system status in the list
                const index = state.systems.findIndex(s => s._id === action.payload.system._id);
                if (index !== -1) {
                    state.systems[index] = action.payload.system;
                }
            })
            // Logs
            .addCase(getIrrigationLogs.fulfilled, (state, action) => {
                state.logs = action.payload;
            })
            // Create
            .addCase(createIrrigationSystem.fulfilled, (state, action) => {
                state.systems.push(action.payload);
            });
    },
});

export default irrigationSlice.reducer;
