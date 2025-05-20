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
      <main className="mx-auto pt-4">
        <Hero />
        <div className="flex justify-center px-6">
          <Shorten />
        </div>
        <Features />
        <Boost />
        <Footer />
      </main>
    </div>
  );
}
