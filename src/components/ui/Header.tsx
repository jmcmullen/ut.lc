import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Button } from "./Button";

import { Logo } from "./Logo";

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="py-6 px-6 sm:px-8 md:px-24">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-very-dark-violet">
            <Logo />
          </Link>
        </div>

        <button
          onClick={toggleMenu}
          className="md:hidden focus:outline-none"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? (
            <X size={24} className="text-grayish-violet" />
          ) : (
            <Menu size={24} className="text-grayish-violet" />
          )}
        </button>

        {isMenuOpen && (
          <div className="absolute top-20 left-6 right-6 z-50 md:hidden">
            <div className="bg-dark-violet rounded-lg p-6 flex flex-col items-center">
              <nav className="w-full mb-6">
                <ul className="flex flex-col items-center space-y-6">
                  <li>
                    <Link to="/" className="text-white font-bold">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link to="/" className="text-white font-bold">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link to="/" className="text-white font-bold">
                      Resources
                    </Link>
                  </li>
                </ul>
              </nav>
              <div className="w-full h-px bg-grayish-violet opacity-25 mb-6"></div>
              <div className="flex flex-col w-full space-y-4">
                <Button variant="secondary" fullWidth>
                  Login
                </Button>
                <Button variant="primary" fullWidth>
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="hidden md:flex items-center justify-between w-full ml-12">
          <nav>
            <ul className="flex space-x-8">
              <li>
                <Link
                  to="/"
                  className="text-grayish-violet hover:text-very-dark-violet"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-grayish-violet hover:text-very-dark-violet"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-grayish-violet hover:text-very-dark-violet"
                >
                  Resources
                </Link>
              </li>
            </ul>
          </nav>
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="text-grayish-violet hover:text-very-dark-violet"
            >
              Login
            </Link>
            <Button size="sm">Sign Up</Button>
          </div>
        </div>
      </div>
    </header>
  );
};
