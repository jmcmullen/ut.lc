import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

const sections = [
  {
    title: "Features",
    links: [
      { title: "Link Shortening", to: "#" },
      { title: "Branded Links", to: "#" },
      { title: "Analytics", to: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { title: "Blog", to: "#" },
      { title: "Developers", to: "#" },
      { title: "Support", to: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { title: "About", to: "#" },
      { title: "Our Team", to: "#" },
      { title: "Careers", to: "#" },
      { title: "Contact", to: "#" },
    ],
  },
];

import facebookIcon from "~/assets/images/icon-facebook.svg";
import twitterIcon from "~/assets/images/icon-twitter.svg";
import pinterestIcon from "~/assets/images/icon-pinterest.svg";
import instagramIcon from "~/assets/images/icon-instagram.svg";

const social = [
  { title: "Facebook", to: "#", icon: facebookIcon },
  { title: "Twitter", to: "#", icon: twitterIcon },
  { title: "Pinterest", to: "#", icon: pinterestIcon },
  { title: "Instagram", to: "#", icon: instagramIcon },
];

export const Footer: React.FC = () => {
  return (
    <footer className="px-6 py-16 bg-very-dark-violet" role="contentinfo">
      <div className="mx-auto flex flex-col gap-y-8 text-white items-center text-center">
        <Logo />
        {sections.map((section) => (
          <div key={section.title} className="flex flex-col gap-y-4">
            <p className="font-bold">{section.title}</p>
            {section.links.map((link) => (
              <Link
                key={link.title}
                to={link.to}
                className="text-grayish-violet hover:text-cyan transition-colors"
              >
                {link.title}
              </Link>
            ))}
          </div>
        ))}
        <div className="flex items-center gap-x-6 mt-6">
          {social.map((social) => (
            <Link
              key={social.title}
              to={social.to}
              className="text-white hover:text-cyan transition-colors"
              data-testid="social-link"
            >
              <img src={social.icon} alt={`${social.title} icon`} />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};
