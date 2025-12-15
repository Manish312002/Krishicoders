import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Get all fields
export const getFields = createAsyncThunk('fields/getAll', async (_, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        if (!userInfo || !userInfo.token) return rejectWithValue('Not authenticated');
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.get(`${API_URL}/api/fields`, config);
        return data;
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        );
    }
});

// Create new field
export const createField = createAsyncThunk('fields/create', async (fieldData, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        if (!userInfo || !userInfo.token) return rejectWithValue('Not authenticated');
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.post(`${API_URL}/api/fields`, fieldData, config);
        return data;
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        );
    }
});

// Update field
export const updateField = createAsyncThunk('fields/update', async ({ id, updates }, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        if (!userInfo || !userInfo.token) return rejectWithValue('Not authenticated');
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.put(`${API_URL}/api/fields/${id}`, updates, config);
        return data;
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        );
    }
});

// Delete field
export const deleteField = createAsyncThunk('fields/delete', async (id, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        if (!userInfo || !userInfo.token) return rejectWithValue('Not authenticated');
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        await axios.delete(`${API_URL}/api/fields/${id}`, config);
        return id;
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        );
    }
});

const fieldSlice = createSlice({
    name: 'fields',
    initialState: {
        fields: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getFields.pending, (state) => {
                state.loading = true;
            })
            .addCase(getFields.fulfilled, (state, action) => {
                state.loading = false;
                state.fields = action.payload;
            })
            .addCase(getFields.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createField.pending, (state) => {
                state.loading = true;
            })
            .addCase(createField.fulfilled, (state, action) => {
                state.loading = false;
                state.fields.push(action.payload);
            })
            .addCase(createField.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Update field
        builder
            .addCase(updateField.fulfilled, (state, action) => {
                const idx = state.fields.findIndex(f => f._id === action.payload._id);
                if (idx !== -1) state.fields[idx] = action.payload;
            })
            .addCase(updateField.rejected, (state, action) => {
                state.error = action.payload;
            })
            // Delete field
            .addCase(deleteField.fulfilled, (state, action) => {
                state.fields = state.fields.filter(f => f._id !== action.payload);
            })
            .addCase(deleteField.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export default fieldSlice.reducer;
