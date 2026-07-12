import "@/styles/index.css";
import "@/styles/App.css";
import "@/styles/ScanBillPage.css";
import "@/styles/BillSummaryPage.css";
import "@/styles/SearchBar.css";

export const metadata = {
  title: "Split the Bill",
  description:
    "Scan a receipt, tell the AI who pays for what, and split the bill with your friends.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  );
}
