import "./globals.css";
import  Topbar  from "@/components/Topbar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Topbar />
        <Navbar />

        <main>{children}</main>

        <Footer />
      </body>
    </html>
  );
}