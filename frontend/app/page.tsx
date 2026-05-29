import Hero from "@/components/Hero";
import Apartments from "@/components/Apartments";
import Featured from "@/components/Featured";
import Whats from "@/components/Whats";
import Crypto from "@/components/Crypto";
import Testimonies from "@/components/Testimonies";
import Gallery from "@/components/Gallery";

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <Apartments />
      <Whats />
      <Featured />
      <Crypto />
      <Testimonies />
      <Gallery />
    </div>
  );
}

