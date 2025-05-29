import { Button } from "./Button";

export const Boost: React.FC = () => {
  return (
    <section className="bg-dark-violet bg-boost-mobile bg-cover bg-center py-36 md:bg-boost-desktop md:py-20">
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-bold text-white md:mb-8 md:text-4xl">
          Boost your links today
        </h2>
        <Button size="lg">Get Started</Button>
      </div>
    </section>
  );
};
