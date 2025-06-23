'use client'

import Sidebar from "../../app/components/sidebar";
import Topbar from "../../app/components/topbar";
import Footer from "../../app/components/footer";

export default function AdminLayout({ children }) {
    return (
        
        <div id="wrapper" className="d-flex">
            <Sidebar />

            <div id="content-wrapper" className="d-flex flex-column flex-grow-1">
                <div id="content">
                    <Topbar />
                    <main className="container-fluid py-4">
                        {children}
                    </main>
                </div>
                <Footer />
            </div>
        </div>
    )
}