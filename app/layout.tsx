"use client";

import React from "react";
import { Inter } from "next/font/google";
import { Provider } from "react-redux";
import { LayoutType } from "@/types";

import { store } from "@/redux/store";

import "antd/dist/reset.css";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "E-commerce",
//   description: "E-commerce site for shops",
// };

export default function RootLayout({ children }: LayoutType) {
  return (
    <Provider store={store}>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </Provider>
  );
}
