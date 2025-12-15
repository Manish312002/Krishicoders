import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Analyze Image
export const analyzeCropImage = createAsyncThunk('cropHealth/analyze', async (analysisData, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.post(`${API_URL}/api/ai/analyze`, analysisData, config);
        return data;
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        );
    }
});

const cropHealthSlice = createSlice({
    name: 'cropHealth',
    initialState: {
        analysisResult: null,
        loading: false,
        error: null,
        history: []
    },
    reducers: {
        resetAnalysis: (state) => {
            state.analysisResult = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(analyzeCropImage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(analyzeCropImage.fulfilled, (state, action) => {
                state.loading = false;
                state.analysisResult = action.payload;
                state.history.unshift(action.payload);
            })
            .addCase(analyzeCropImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetAnalysis } = cropHealthSlice.actions;
export default cropHealthSlice.reducer;
