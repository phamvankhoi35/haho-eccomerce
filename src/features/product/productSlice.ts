import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosClient from "../../api/axiosClient";

export interface Product {
    id: number;
    title: string;
    price: number;
    image: string;
}

interface ProductState {
    products: Product[];
    loading: boolean;
    error: string | null;
}

const initialState: ProductState = {
    products: [],
    loading: false,
    error: null,
};

// Fake API: https://fakestoreapi.com/products
export const fetchProducts = createAsyncThunk("product/fetchProducts", async () => {
    // const res = await axios.get("https://fakestoreapi.com/products");
    const res = await axiosClient.get("/product");
    return res.data;
});

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => { state.loading = true })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Error fetching products";
            });
    },
});



export default productSlice.reducer;