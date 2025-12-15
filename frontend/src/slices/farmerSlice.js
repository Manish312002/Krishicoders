import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Get current farmer profile
export const getFarmerProfile = createAsyncThunk('farmer/getProfile', async (_, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.get(`${API_URL}/api/farmers/profile`, config);
        return data;
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        );
    }
});

// Create or update farmer profile
export const createFarmerProfile = createAsyncThunk('farmer/createProfile', async (farmerData, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.post(`${API_URL}/api/farmers`, farmerData, config);
        return data;
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        );
    }
});

const farmerSlice = createSlice({
    name: 'farmer',
    initialState: {
        farmer: null,
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        resetFarmerSuccess: (state) => {
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getFarmerProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(getFarmerProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.farmer = action.payload;
            })
            .addCase(getFarmerProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createFarmerProfile.pending, (state) => {
                state.loading = true;
                state.success = false;
            })
            .addCase(createFarmerProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.farmer = action.payload;
            })
            .addCase(createFarmerProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            });
    },
});

export const { resetFarmerSuccess } = farmerSlice.actions;
export default farmerSlice.reducer;
