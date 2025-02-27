"use client";

import { Button } from "flowbite-react";


export default function Home() {
  return (
    <>
      <div className="flex h-screen">
        <div className="w-1/2 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center h-screen gap-4">
            <div className="p-5">
              <p className="text-lg font-bold">
                An Expense Management System helps individuals or businesses
                track, manage, and analyze their expenses efficiently. It
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
