import { Button } from "./Button";

export const Hero: React.FC = () => {
  return (
    <section className="flex flex-col gap-y-8 pl-6 pb-16">
      <div className="w-full relative overflow-hidden h-72">
        <div className="absolute top-0 right-0 w-full h-full max-[520px]:bg-cover bg-contain bg-no-repeat bg-left bg-working-illustration" />
      </div>
      <div className="flex flex-col gap-y-4 pr-6 text-center">
        <h1 className="text-3xl font-bold">More than just shorter links</h1>
        <p className="text-grayish-violet">
          Build your brand's recognition and get detailed insights on how your
          links are performing.
        </p>
        <div className="flex justify-center">
          <Button>Get Started</Button>
        </div>
      </div>
    </section>
  );
};
