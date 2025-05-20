import { createFileRoute } from "@tanstack/react-router";
import { Header } from "~/components/ui/Header";
import { Hero } from "~/components/ui/Hero";
import { Shorten } from "~/components/ui/Shorten";
import { Features } from "~/components/ui/Features";
import { Boost } from "~/components/ui/Boost";
import { Footer } from "~/components/ui/Footer";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div>
      <Header />
      <main className="mx-auto">
        <Hero />
        <div className="flex justify-center px-6 max-w-7xl mx-auto">
          <Shorten />
        </div>
        <Features />
        <Boost />
        <Footer />
      </main>
    </div>
  );
}
