import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./Button";

import { signIn, useSession } from "~/utils/auth-client";
import { Logo } from "./Logo";

export const Header: React.FC = () => {
  const session = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="mx-auto px-6 py-6 md:max-w-7xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-very-dark-violet">
            <Logo />
          </Link>
        </div>

        <button
          type="button"
          onClick={toggleMenu}
          className="focus:outline-none md:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? (
            <X size={24} className="text-grayish-violet" />
          ) : (
            <Menu size={24} className="text-grayish-violet" />
          )}
        </button>

        {isMenuOpen && (
          <div className="absolute left-6 right-6 top-20 z-50 animate-header md:hidden">
            <div className="flex flex-col items-center rounded-lg bg-dark-violet p-6">
              <nav className="mb-6 w-full" role="navigation" data-testid="mobile-nav">
                <ul className="flex flex-col items-center space-y-6">
                  <li>
                    <Link to="/" className="font-bold text-white">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link to="/" className="font-bold text-white">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link to="/" className="font-bold text-white">
                      Resources
                    </Link>
                  </li>
                </ul>
              </nav>
              <div className="mb-6 h-px w-full bg-grayish-violet opacity-25"></div>
              <div className="flex w-full flex-col space-y-4">
                {session.data?.user ? (
                  <Button variant="secondary" fullWidth>
                    Logout
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="secondary"
                      onClick={() =>
                        signIn.social({
                          provider: "google",
                        })
                      }
                      fullWidth
                    >
                      Login
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() =>
                        signIn.social({
                          provider: "google",
                        })
                      }
                      fullWidth
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        <div
          className="ml-12 hidden w-full items-center justify-between md:flex"
          data-testid="desktop-nav"
        >
          <nav role="navigation">
            <ul className="flex space-x-8">
              <li>
                <Link to="/" className="text-grayish-violet hover:text-very-dark-violet">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/" className="text-grayish-violet hover:text-very-dark-violet">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/" className="text-grayish-violet hover:text-very-dark-violet">
                  Resources
                </Link>
              </li>
            </ul>
          </nav>
          <div className="flex items-center">
            {session.data?.user ? (
              <Link to="/dashboard">
                <Button variant="secondary" type="button" fullWidth>
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Button
                  type="button"
                  variant="link"
                  onClick={() =>
                    signIn.social({
                      provider: "google",
                    })
                  }
                  className="text-grayish-violet hover:text-very-dark-violet"
                >
                  Login
                </Button>
                <Button
                  size="sm"
                  onClick={() =>
                    signIn.social({
                      provider: "google",
                    })
                  }
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
