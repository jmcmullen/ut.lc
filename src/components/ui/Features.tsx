import iconBrandRecognition from "~/assets/images/icon-brand-recognition.svg";
import iconDetailedRecords from "~/assets/images/icon-detailed-records.svg";
import iconFullyCustomizable from "~/assets/images/icon-fully-customizable.svg";

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
  return (
    <section className="flex flex-col gap-y-8 px-6 bg-light-gray pb-28 pt-44 -mt-20">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-6">Advanced Statistics</h2>
        <p className="text-grayish-violet">
          Track how your links are performing across the web with our advanced
          statistics dashboard.
        </p>
      </div>
      <ul className="flex flex-col gap-y-24 mt-20">
        {features.map((feature, index) => (
          <li
            key={feature.id}
            className="p-6 pt-20 bg-white rounded-md text-center flex flex-col gap-y-4 items-center relative"
          >
            {index > 0 && <div className="absolute h-20 w-2 -top-24 bg-cyan" />}
            <div className="bg-dark-violet size-20 rounded-full flex items-center justify-center p-3 absolute -top-10">
              <img src={feature.icon} alt={feature.title} />
            </div>
            <h3 className="text-xl font-bold">{feature.title}</h3>
            <p className="text-grayish-violet">{feature.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};
