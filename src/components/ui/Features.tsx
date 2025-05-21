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
    <section className="bg-light-gray pb-28 pt-44 -mt-20">
      <div className="flex flex-col gap-y-8 px-6 max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">Advanced Statistics</h2>
          <p className="text-grayish-violet">
            Track how your links are performing across the web with our advanced
            statistics dashboard.
          </p>
        </div>
        <ul className="flex flex-col md:flex-row md:gap-x-8 gap-y-24 mt-20">
          {features.map((feature, index) => (
            <li
              key={feature.id}
              className={cn(
                "w-full p-6 pt-20 bg-white rounded-md text-center md:text-left flex flex-col gap-y-4 items-center relative self-start md:justify-start",
                featureVariants[index],
              )}
            >
              {index > 0 && (
                <div
                  className={cn(
                    "absolute h-20 w-2 -top-24 bg-cyan md:w-8 md:h-2 md:-left-8",
                    connectorVariants[index],
                  )}
                />
              )}
              <div className="bg-dark-violet size-20 rounded-full flex items-center justify-center p-3 absolute -top-10 md:self-start">
                <img src={feature.icon} alt={feature.title} />
              </div>
              <h3 className="text-xl font-bold w-full">{feature.title}</h3>
              <p className="text-grayish-violet">{feature.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
