// layouts/AdminLayout.tsx
import { Outlet, Link } from "react-router-dom"

import { AdminHeader } from "@/components/Header";
import { Sidebar } from '@/components/Sidebar';

const AdminLayout = () => {
    return (
        <>
            <Sidebar />
            <div className="md:ml-64">
                <AdminHeader />
                <Outlet />
            </div>
        </>);
}

export default AdminLayout;
