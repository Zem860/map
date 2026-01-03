import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
const PublicLayout = () => {
    return (<>

        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-20"> {/* 根据 Header 高度调整 */}
                <Outlet />
            </main>
        </div>
    </>);
}

export default PublicLayout;