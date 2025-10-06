import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchOrders } from "../features/order/orderSlice";

export default function Order() {
    const dispatch = useAppDispatch();
    const auth = useAppSelector(state => state.auth);
    const { orders, loading } = useAppSelector(state => state.order);

    useEffect(() => {
        if (auth.user) dispatch(fetchOrders(auth.user.id));
    }, [auth.user, dispatch]);

    if (loading) return <div className="p-4">Loading...</div>;
    if (!orders.length) return <div className="p-4">No orders found.</div>;

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Your Orders</h2>
            {orders.map(order => (
                <div key={order.id} className="border p-2 mb-2 rounded">
                    <div className="font-bold">Order #{order.id} - {new Date(order.date).toLocaleString()}</div>
                    <div>Total: ${order.total}</div>
                    <ul>
                        {order.orderitems.map(item => (
                            <li key={item.id}>{item.title} x {item.quantity} = ${item.price * item.quantity}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}