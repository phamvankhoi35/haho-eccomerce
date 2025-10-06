import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { addToCart } from '../features/cart/cartSlice';
import { fetchProducts } from '../features/product/productSlice';

const Home = () => {
    const dispatch = useAppDispatch();
    const { products, loading, error } = useAppSelector(state => state.product);


    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    if (loading) return <p>Loading...</p>;
    if (loading) return <p className="p-4">Loading products...</p>;
    if (error) return <p className="p-4 text-red-500">{error}</p>;
    if (!products || !Array.isArray(products)) return <p className="p-4">No products found</p>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {products.map((p) => (
                <div key={p.id} className="border p-2 flex flex-col rounded shadow">
                    <img src={p.image} alt={p.title} className="h-40 object-contain mb-2" />
                    <h3 className="font-bold">{p.title}</h3>
                    <p className="text-green-600 font-semibold">${p.price}</p>
                    <button
                        className="mt-auto bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
                        onClick={() => dispatch(addToCart({ ...p, quantity: 1 }))}
                    >
                        Add to Cart
                    </button>
                </div>
            ))}
        </div>
    )
}

export default Home