import { Logo } from "./Logo";

const sections = [
  {
    title: "Features",
    links: [
      { title: "Link Shortening", href: "#" },
      { title: "Branded Links", href: "#" },
      { title: "Analytics", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { title: "Blog", href: "#" },
      { title: "Developers", href: "#" },
      { title: "Support", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { title: "About", href: "#" },
      { title: "Our Team", href: "#" },
      { title: "Careers", href: "#" },
      { title: "Contact", href: "#" },
    ],
  },
];

import facebookIcon from "~/assets/images/icon-facebook.svg";
import twitterIcon from "~/assets/images/icon-twitter.svg";
import pinterestIcon from "~/assets/images/icon-pinterest.svg";
import instagramIcon from "~/assets/images/icon-instagram.svg";

const social = [
  { title: "Facebook", href: "#", icon: facebookIcon },
  { title: "Twitter", href: "#", icon: twitterIcon },
  { title: "Pinterest", href: "#", icon: pinterestIcon },
  { title: "Instagram", href: "#", icon: instagramIcon },
];

export const Footer: React.FC = () => {
  return (
    <footer className="px-6 py-16 bg-very-dark-violet">
      <div className="flex flex-col gap-y-8 text-white items-center text-center">
        <Logo />
        {sections.map((section) => (
          <div className="flex flex-col gap-y-4">
            <p className="font-bold">{section.title}</p>
            {section.links.map((link) => (
              <p key={link.title} className="text-grayish-violet">
                {link.title}
              </p>
            ))}
          </div>
        ))}
        <div className="flex items-center gap-x-6 mt-6">
          {social.map((social) => (
            <a
              key={social.title}
              href={social.href}
              className="text-grayish-violet"
            >
              <img src={social.icon} alt={social.title} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};
