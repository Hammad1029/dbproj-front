// types
import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
    stats: {},
    orders: [],
    suppliers: [],
    products: []
};

// ==============================|| SLICE - MENU ||============================== //

const user = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setStats(state, action) {
            state.stats = action.payload;
        },
        setOrders(state, action) {
            state.orders = action.payload;
        },
        setProducts(state, action) {
            state.products = action.payload;
        },
        setSuppliers(state, action) {
            state.suppliers = action.payload;
        },
    }
});

export default user.reducer;

export const { setStats, setOrders, setProducts, setSuppliers } = user.actions;
