import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchProducts } from '../../features/product/productSlice';
import axiosClient from '../../api/axiosClient';
import type { AxiosError } from 'axios';

const AdminDashboard = () => {
    const dispatch = useAppDispatch();
    const { products, loading } = useAppSelector(state => state.product);
    const [title, setTitle] = useState(""); const [price, setPrice] = useState(""); const [image, setImage] = useState("");

    useEffect(() => { dispatch(fetchProducts()) }, [dispatch]);

    const handleAdd = async () => {
        try {
            await axiosClient.post("/products", { title, price: parseFloat(price), image });
            alert("Product added!"); dispatch(fetchProducts());
            setTitle(""); setPrice(""); setImage("");
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            alert(error.response?.data?.message || "Add failed");
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Delete product?")) return;
        try { await axiosClient.delete(`/products/${id}`); alert("Deleted"); dispatch(fetchProducts()); }
        catch (err) {
            const error = err as AxiosError<{ message: string }>;
            alert(error.response?.data?.message || "Delete failed");
        }
    }

    if (loading) return <div className="p-4 text-center">Loading...</div>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
            <div className="mb-6 border p-4 rounded">
                <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="border p-1 mb-2 w-full" />
                <input placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} className="border p-1 mb-2 w-full" />
                <input placeholder="Image URL" value={image} onChange={e => setImage(e.target.value)} className="border p-1 mb-2 w-full" />
                <button onClick={handleAdd} className="bg-green-500 text-white p-2 rounded">Add Product</button>
            </div>
            <table className="w-full border-collapse border">
                <thead>
                    <tr><th className="border p-2">ID</th><th className="border p-2">Title</th><th className="border p-2">Price</th><th className="border p-2">Image</th><th className="border p-2">Action</th></tr>
                </thead>
                <tbody>
                    {products.map(p => (
                        <tr key={p.id} className="border">
                            <td className="border p-2">{p.id}</td>
                            <td className="border p-2">{p.title}</td>
                            <td className="border p-2">${p.price}</td>
                            <td className="border p-2"><img src={p.image} alt={p.title} className="h-12" /></td>
                            <td className="border p-2"><button onClick={() => handleDelete(p.id)} className="bg-red-500 text-white p-1 rounded">Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminDashboard