import { Button } from "./Button";

export const Boost: React.FC = () => {
  return (
    <section className="bg-dark-violet py-36 md:py-20 bg-boost-mobile md:bg-boost-desktop bg-cover bg-center">
      <div className="text-center">
        <h2 className="text-white text-2xl md:text-4xl font-bold mb-4 md:mb-8">
          Boost your links today
        </h2>
        <Button size="lg">Get Started</Button>
      </div>
    </section>
  );
};
