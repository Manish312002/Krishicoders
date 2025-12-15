import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Get alerts
export const getAlerts = createAsyncThunk('alerts/getAll', async (_, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.get(`${API_URL}/api/alerts`, config);
        return data;
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        );
    }
});

// Create Alert (Manual)
export const createAlert = createAsyncThunk('alerts/create', async (alertData, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.post(`${API_URL}/api/alerts`, alertData, config);
        return data;
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        );
    }
});

// Resolve Alert
export const resolveAlert = createAsyncThunk('alerts/resolve', async (alertId, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.put(`${API_URL}/api/alerts/${alertId}/resolve`, {}, config);
        return data;
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        );
    }
});

const alertSlice = createSlice({
    name: 'alerts',
    initialState: {
        alerts: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAlerts.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAlerts.fulfilled, (state, action) => {
                state.loading = false;
                state.alerts = action.payload;
            })
            .addCase(getAlerts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(resolveAlert.fulfilled, (state, action) => {
                const index = state.alerts.findIndex(a => a._id === action.payload._id);
                if (index !== -1) {
                    state.alerts[index] = action.payload;
                }
            })
            .addCase(createAlert.fulfilled, (state, action) => {
                state.alerts.unshift(action.payload);
            });
    },
});

export default alertSlice.reducer;
