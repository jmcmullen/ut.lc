import { createFileRoute } from "@tanstack/react-router";
import { Boost } from "~/components/home/Boost";
import { Features } from "~/components/home/Features";
import { Footer } from "~/components/home/Footer";
import { Header } from "~/components/home/Header";
import { Hero } from "~/components/home/Hero";
import { History } from "~/components/home/History";
import { Shorten } from "~/components/home/Shorten";
import { UrlProvider } from "~/contexts/UrlContext";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div>
      <Header />
      <main className="mx-auto">
        <Hero />
        <UrlProvider>
          <div className="mx-auto flex max-w-7xl flex-col justify-center px-6">
            <Shorten />
          </div>
          <History />
        </UrlProvider>
        <Features />
        <Boost />
        <Footer />
      </main>
    </div>
  );
}
