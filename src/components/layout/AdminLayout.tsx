
// import { Outlet } from 'react-router-dom'
// const AdminLayout = () => {
//     return (
//         <div className='min-h-screen flex'>
//             <aside className="w-64 float-left bg-gray-800 text-white h-screen p-4">
//                 <h2 className="text-xl font-bold mb-4">Admin Menu</h2>
//                 {/* Menu Admin */}
//             </aside>
//             <main className="ml-64 p-4">
//                 <Outlet />
//             </main>
//         </div>
//     )
// }
// export default AdminLayout

import React from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex">
            <aside className="w-64 bg-gray-800 text-white p-4">Admin Sidebar</aside>
            <div className="flex-1">
                <header className="bg-white p-4 shadow">Admin Header</header>
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}