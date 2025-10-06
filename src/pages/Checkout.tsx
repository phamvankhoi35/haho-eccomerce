import React from 'react'
import { clearCart } from '../features/cart/cartSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../features/order/orderSlice';
import type { AxiosError } from 'axios';


const Checkout = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const cart = useAppSelector(state => state.cart.items);
    const auth = useAppSelector(state => state.auth);

    const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const handleCheckout = async () => {
        if (!cart.length) return alert("Cart is empty!");
        if (!auth.user) return alert("You must login!");

        console.log({
            userId: auth.user.id,
            orderitems: cart,
            total,
            date: new Date().toISOString()
        });
        try {
            await dispatch(createOrder({ userId: auth.user.id, orderitems: cart, total })).unwrap();
            dispatch(clearCart());
            alert("Checkout success!");
            navigate("/orders");
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            alert(error.response?.data?.message || "Checkout failed");
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Checkout</h2>
            {cart.map(i => (
                <div key={i.id} className="flex justify-between border-b p-2">
                    <div>{i.title} x {i.quantity}</div>
                    <div>${i.price * i.quantity}</div>
                </div>
            ))}
            <div className="mt-4 font-bold">Total: ${total}</div>
            <button onClick={handleCheckout} className="bg-green-500 text-white p-2 mt-2 rounded">Place Order</button>
        </div>
    )
}

export default Checkout