import illustrationWorking from "../../assets/images/illustration-working.svg";
import { Button } from "./Button";

export const Hero: React.FC = () => {
  return (
    <section className="overflow-hidden pb-16 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-6">
        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
          <div className="order-2 flex flex-col text-center md:order-1 md:text-left">
            <h1 className="text-3xl font-bold md:text-7xl md:leading-tight">
              More than just shorter links
            </h1>
            <p className="mb-6 text-grayish-violet md:text-xl">
              Build your brand's recognition and get detailed insights on how your links
              are performing.
            </p>
            <Button className="self-center md:self-start">Get Started</Button>
          </div>

          <div className="order-1 w-[calc(140%)] max-w-lg md:order-2 md:ml-20 md:h-[520px] md:max-w-max">
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
