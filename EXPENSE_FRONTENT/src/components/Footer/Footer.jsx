"use client";

import { Footer } from "flowbite-react";

export default function FooterComponent() {
  return (
    <Footer container>
      <div className="w-full text-center">
        <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
          <Footer.Brand
            href="#"
            src="https://cdn-icons-png.flaticon.com/512/6289/6289247.png"
            alt="Flowbite Logo"
            name="Expense Tracker"
          />
          <Footer.LinkGroup>
            <Footer.Link href="#">About</Footer.Link>
            <Footer.Link href="#">Privacy Policy</Footer.Link>
            <Footer.Link href="#">Licensing</Footer.Link>
            <Footer.Link href="#">Contact</Footer.Link>
          </Footer.LinkGroup>
        </div>
        <Footer.Divider />
        <Footer.Copyright href="#" by="Expense™" year={2025} />
      </div>
    </Footer>
  );
}
