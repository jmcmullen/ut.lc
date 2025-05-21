import iconBrandRecognition from "~/assets/images/icon-brand-recognition.svg";
import iconDetailedRecords from "~/assets/images/icon-detailed-records.svg";
import iconFullyCustomizable from "~/assets/images/icon-fully-customizable.svg";
import { cn } from "~/utils/cn";

const features = [
  {
    id: 1,
    icon: iconBrandRecognition,
    title: "Brand Recognition",
    description:
      "Boost your brand recognition with each click. Generic links don't mean a thing. Branded links help instill confidence in your brand.",
  },
  {
    id: 2,
    icon: iconDetailedRecords,
    title: "Detailed Records",
    description:
      "Gain insights to who is clicking your links. Knowing when and where people engage with your content helps inform better decisions.",
  },
  {
    id: 3,
    icon: iconFullyCustomizable,
    title: "Fully Customizable",
    description:
      "Improve brand awareness and content discoverability through customizable links, supercharging audience engagement.",
  },
];

export const Features: React.FC = () => {
  const featureVariants = ["md:mt-0", "md:mt-12", "md:mt-24"];
  const connectorVariants = ["", "md:top-[120px]", "md:top-[70px]"];

  return (
    <section className="-mt-24 bg-light-gray pb-28 pt-44">
      <div className="mx-auto flex max-w-7xl flex-col gap-y-8 px-6">
        <div className="text-center">
          <h2 className="mb-6 text-2xl font-bold">Advanced Statistics</h2>
          <p className="text-grayish-violet">
            Track how your links are performing across the web with our advanced
            statistics dashboard.
          </p>
        </div>
        <ul className="mt-20 flex flex-col gap-y-24 md:flex-row md:gap-x-8">
          {features.map((feature, index) => (
            <li
              key={feature.id}
              className={cn(
                "relative flex w-full flex-col items-center gap-y-4 self-start rounded-md bg-white p-6 pt-20 text-center md:justify-start md:text-left",
                featureVariants[index],
              )}
            >
              {index > 0 && (
                <div
                  className={cn(
                    "absolute -top-24 h-20 w-2 bg-cyan md:-left-8 md:h-2 md:w-8",
                    connectorVariants[index],
                  )}
                />
              )}
              <div className="absolute -top-10 flex size-20 items-center justify-center rounded-full bg-dark-violet p-3 md:self-start">
                <img src={feature.icon} alt={feature.title} />
              </div>
              <h3 className="w-full text-xl font-bold">{feature.title}</h3>
              <p className="text-grayish-violet">{feature.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
