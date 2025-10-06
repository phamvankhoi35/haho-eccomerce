import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";



export interface OrderItem {
    id: number;
    title: string;
    price: number;
    quantity: number;
}
export interface Order {
    id: number;
    userId: number;
    orderitems: OrderItem[];
    total: number;
    date: string;
}
interface OrderState {
    orders: Order[];
    loading: boolean;
    error: string | null;
}

const initialState: OrderState = {
    orders: [],
    loading: false,
    error: null
};

// Fetch orders of current user
export const fetchOrders = createAsyncThunk("order/fetchOrders",
    async (userId: number) => {
        const res = await axiosClient.get(`/orders?userId=${userId}`);
        return res.data as Order[];
    });

// Create new order
export const createOrder = createAsyncThunk("order/createOrder",
    async (order: Omit<Order, "id" | "date">) => {
        const payload = { ...order, date: new Date().toISOString() };
        console.log("Payload to POST:", payload); // check payload
        const res = await axiosClient.post("/orders", payload);
        return res.data as Order;
    });

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchOrders.pending, state => { state.loading = true; })
            .addCase(fetchOrders.fulfilled, (state, action) => { state.loading = false; state.orders = action.payload; })
            .addCase(fetchOrders.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "Fetch orders failed"; })
            .addCase(createOrder.pending, state => { state.loading = true; })
            .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
                state.loading = false;
                state.orders.push(action.payload);
            })
            .addCase(createOrder.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "Create order failed"; });
    },
});

export default orderSlice.reducer;