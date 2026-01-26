
"use client";

// import { Button, Card, Footer } from "flowbite-react";
import Header from "../../components/Header/Header";
// Dashboard generic import if needed, but usually we link to it. 
// The original imported Dashboard component? 
// import Dashboard from "../Admin/Dashboard/Dashboard"; -> This was importing the component to render it? 
// In the code: It is NOT used in the JSX! 
// Lines 11-41 do NOT use Dashboard. 
// So I can remove the unused import. 
import FooterComponent from "../../components/Footer/Footer";
import { Button } from "flowbite-react";
import { SidebarComponent } from "../../components/Admin/Sidebar/Sidebar";

export default function Home() {
    return (
        <>
            <SidebarComponent />
            <div className="flex h-screen">
                <div className="w-1/2 flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center h-screen gap-4">
                        <div className="p-5">
                            <p className="text-lg font-bold">
                                An Expense Management System helps individuals or businesses
                                track,<br></br> manage, and analyze their expenses efficiently. It
                                automates expense reporting.
                            </p>
                        </div>
                        <div className="p-5">
                            <Button>Get Started</Button>
                        </div>
                    </div>
                </div>
                <div className="w-1/2 flex items-center justify-center">
                    <img
                        src="https://cdni.iconscout.com/illustration/premium/thumb/budget-management-illustration-download-in-svg-png-gif-file-formats--expense-managing-accounting-finance-statement-planning-isometric-pack-professionals-illustrations-4040951.png"
                        alt="Example"
                    />
                </div>
            </div>

        </>
    );
}
