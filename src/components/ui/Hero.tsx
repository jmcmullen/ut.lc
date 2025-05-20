import { Button } from "./Button";
import illustrationWorking from "../../assets/images/illustration-working.svg";

export const Hero: React.FC = () => {
  return (
    <section className="overflow-hidden pb-16 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex flex-col order-2 md:order-1 text-center md:text-left">
            <h1 className="text-3xl font-bold md:text-7xl md:leading-tight">
              More than just shorter links
            </h1>
            <p className="text-grayish-violet md:text-xl mb-6">
              Build your brand's recognition and get detailed insights on how
              your links are performing.
            </p>
            <Button className="self-center md:self-start">Get Started</Button>
          </div>

          <div className="order-1 md:order-2 md:h-[520px] max-w-lg md:max-w-max w-[calc(140%)] md:ml-20">
            <img
              src={illustrationWorking}
              alt="Person working"
              className="w-full object-left"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
