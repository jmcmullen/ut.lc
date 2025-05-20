import { Button } from "./Button";

export const Boost: React.FC = () => {
  return (
    <section className="bg-dark-violet py-40 bg-boost-mobile lg:bg-boost-desktop bg-cover">
      <div className="text-center">
        <h2 className="text-white text-2xl font-bold mb-4">
          Boost your links today
        </h2>
        <Button size="lg">Get Started</Button>
      </div>
    </section>
  );
};
