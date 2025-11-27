"use client";

import React from "react";
import { Button } from "./ui/button";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Container } from "./Container";

export function Footer() {
  const { theme, setTheme } = useTheme();

  return (
    <footer className="py-20">
      <Container>
        {/* Final CTA Section */}
        <div className="text-center mb-16 space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Stop losing clients to third-party consent screens
          </h2>

          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white"
            asChild
          >
            <a href="/auth/signup">Start 14-day Agency Pilot</a>
          </Button>

          <p className="text-sm text-muted-foreground">
            We&apos;ll even help you get your apps approved. Cancel anytime.
          </p>
        </div>

        {/* Footer Links and Theme Toggle */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-border">
          <div className="flex items-center gap-6">
            <a
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </a>
            <a
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </a>
            <a
              href="/developers"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Developers
            </a>
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
