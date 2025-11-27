"use client";

import React from "react";
import { Instagram, Linkedin, Facebook, Youtube } from "lucide-react";
import { motion } from "motion/react";
import { Container } from "./Container";

export function PlatformsSection() {
  const platforms = [
    { name: "Instagram", supported: true, Icon: Instagram },
    { name: "TikTok", supported: true, Icon: null },
    { name: "LinkedIn", supported: true, Icon: Linkedin },
    { name: "X (Twitter)", supported: true, Icon: null },
    { name: "Facebook", supported: true, Icon: Facebook },
    { name: "YouTube", supported: false, Icon: Youtube },
  ];

  return (
    <section className="py-20">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Native publishing — fully supported today
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`relative group p-6 rounded-xl border transition-all ${
                platform.supported
                  ? "border-border bg-card hover:border-primary/50 hover:bg-card/80"
                  : "border-border/50 bg-card/30 opacity-40 cursor-not-allowed"
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    platform.supported
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {platform.Icon ? (
                    <platform.Icon className="w-6 h-6" />
                  ) : (
                    <span className="text-xl font-bold">
                      {platform.name.charAt(0)}
                    </span>
                  )}
                </div>

                {/* Name */}
                <span className="text-sm font-medium text-center">
                  {platform.name}
                </span>

                {/* Status Badge */}
                {platform.supported ? (
                  <span className="text-xs text-primary font-medium">
                    ✓ Supported
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    Coming Soon
                  </span>
                )}
              </div>

              {/* Hover Glow Effect */}
              {platform.supported && (
                <div className="absolute -inset-0.5 bg-linear-to-r from-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:to-primary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-sm" />
              )}
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}