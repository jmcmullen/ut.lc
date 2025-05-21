import { createFileRoute } from "@tanstack/react-router";
import { Boost } from "~/components/ui/Boost";
import { Features } from "~/components/ui/Features";
import { Footer } from "~/components/ui/Footer";
import { Header } from "~/components/ui/Header";
import { Hero } from "~/components/ui/Hero";
import { History } from "~/components/ui/History";
import { Shorten } from "~/components/ui/Shorten";
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
