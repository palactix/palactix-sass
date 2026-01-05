import { Footer } from "@/components/home/Footer";
import { Navbar } from "@/components/home/Navbar";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <Navbar/>
      <main>
        {children}
      </main>
      <Footer />
    </div>
  )
}