import { createFileRoute } from "@tanstack/react-router";
import { Boost } from "~/components/ui/Boost";
import { Features } from "~/components/ui/Features";
import { Footer } from "~/components/ui/Footer";
import { Header } from "~/components/ui/Header";
import { Hero } from "~/components/ui/Hero";
import { Shorten } from "~/components/ui/Shorten";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div>
      <Header />
      <main className="mx-auto">
        <Hero />
        <div className="mx-auto flex max-w-7xl justify-center px-6">
          <Shorten />
        </div>
        <Features />
        <Boost />
        <Footer />
      </main>
    </div>
  );
}
