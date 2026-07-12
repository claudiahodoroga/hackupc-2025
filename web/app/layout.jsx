import { Inter } from "next/font/google";
import "@/styles/index.css";
import "@/styles/App.css";
import "@/styles/ScanBillPage.css";
import "@/styles/BillSummaryPage.css";
import "@/styles/SearchBar.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Split the Bill",
  description:
    "Scan a receipt, tell the AI who pays for what, and split the bill with your friends.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  );
}
