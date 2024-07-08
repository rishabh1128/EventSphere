import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-col">
      <Toaster position="top-center" reverseOrder={false} />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
