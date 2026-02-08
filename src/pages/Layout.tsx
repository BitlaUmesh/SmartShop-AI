import { Outlet } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { AIChatWidget } from "../components/AIChatWidget";

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Outlet />
      <Footer />
      <AIChatWidget />
    </div>
  );
}