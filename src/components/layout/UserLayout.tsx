
// import { Outlet } from 'react-router-dom'

// const UserLayout = () => {
//     return (
//         <div>
//             <main className='ml-64 p-4'>
//                 <Outlet />
//             </main>
//         </div>
//     )
// }

// export default UserLayout

import React from 'react';

export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow p-4">User Nav</header>
            <main className="p-4">{children}</main>
            <footer className="p-4 text-center text-sm">© MyShop</footer>
        </div>
    );
}