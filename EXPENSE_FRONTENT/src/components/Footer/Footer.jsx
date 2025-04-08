
"use client";

import { Footer } from "flowbite-react";

export default function FooterComponent() {
  return (
    <Footer container>
      <div className="w-full text-center">
        <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
          <Footer.Brand
            href="#"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiuqOqnFkGtkSfndrsWv7_DWCfI5SvjNsrbg&s"
            alt="Flowbite Logo"
            name="Expense Management"
          />
          <Footer.LinkGroup>
            <Footer.Link href="#">About</Footer.Link>
            <Footer.Link href="/expense">Expense</Footer.Link>
            <Footer.Link href="/income">Income</Footer.Link>
            <Footer.Link href="/contact">Contact</Footer.Link>
          </Footer.LinkGroup>
        </div>
        <Footer.Divider />
        <Footer.Copyright href="#" by="Zidio" year={2025} />
      </div>
    </Footer>
  );
}
