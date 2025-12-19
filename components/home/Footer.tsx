"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Container } from "../Container";
import Link from "next/link";


const footerLinks = [
  { href: "/privacy-policy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/developers", label: "Developers" },
];

export function Footer() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <footer className="py-20">
      <Container>
        {/* Footer Links and Theme Toggle */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-border">
          <div className="flex items-center gap-6">
            {
              footerLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {link.label}
                </Link>
              ))
            }
          </div>

          {/* Theme Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
                aria-label="Select theme"
              >
                {theme === "dark" ? (
                  <>
                    <Moon className="w-4 h-4" />
                    <span className="text-sm">Dark</span>
                  </>
                ) : theme === "system" ? (
                  <>
                    <Monitor className="w-4 h-4" />
                    <span className="text-sm">System</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-4 h-4" />
                    <span className="text-sm">Light</span>
                  </>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="w-4 h-4 mr-2" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="w-4 h-4 mr-2" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor className="w-4 h-4 mr-2" />
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Copyright */}
        <div className="text-center mt-8">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Palactix. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
