// layouts/AdminLayout.tsx
import { Outlet } from "react-router-dom"

import { AdminHeader } from "@/components/Header";
import { Sidebar } from '@/components/Sidebar';

const AdminLayout = () => {
    return (
        <>
            <Sidebar />
            <div className="lg:ml-64">
                <AdminHeader />
                <div className="p-4"><Outlet /></div>
            </div>
        </>);
}

export default AdminLayout;
