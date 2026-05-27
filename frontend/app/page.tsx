import Hero from "@/components/Hero";
import Apartments from "@/components/Apartments";
import Topbar from "@/components/Topbar";
import Navbar from "@/components/Navbar";
import Featured from "@/components/Featured";
import Whats from "@/components/Whats";
import Crypto from "@/components/Crypto";
import Testimonies from "@/components/Testimonies";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <Topbar />
      <Navbar />
      <Hero />
      <Apartments />
      <Whats />
      <Featured />
      <Crypto />
      <Testimonies />
      <Gallery />
      <Footer />
    </div>
  );
}

