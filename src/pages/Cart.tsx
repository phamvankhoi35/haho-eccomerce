import React from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearCart, removeFromCart } from '../features/cart/cartSlice';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const items = useAppSelector(state => state.cart.items);

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (!items.length) return <div className="p-4">Cart is empty</div>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Your Cart</h2>
            <ul>
                {items.map(i => (
                    <li key={i.id} className="flex justify-between mb-2">
                        <span>{i.title} x {i.quantity}</span>
                        <span>${i.price * i.quantity}</span>
                        <button onClick={() => dispatch(removeFromCart(i.id))} className="text-red-500">Remove</button>
                    </li>
                ))}
            </ul>
            <p className="font-bold mt-4">Total: ${total}</p>
            <div className="mt-4 flex gap-2">
                <button
                    className="bg-green-500 text-white p-2 rounded"
                    onClick={() => navigate("/checkout")}
                >
                    Checkout
                </button>
                <button
                    className="bg-red-500 text-white p-2 rounded"
                    onClick={() => dispatch(clearCart())}
                >
                    Clear Cart
                </button>
            </div>
        </div>
    )
}

export default Cart