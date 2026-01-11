"use client";

import React from "react";
import { Instagram, Linkedin, Facebook, Youtube } from "lucide-react";
import { motion } from "motion/react";
import { Container } from "../Container";
import { useChannels } from "@/features/agency-app/api/agency-app.queries";
import { Channel } from "@/features/agency-app/types/agency-app.types";
import { useChannelLogo } from "@/hooks/use-channel-logo";
import Image from "next/image";

export function PlatformsSection() {
  const { data, isLoading } = useChannels();
  const channelLogo = useChannelLogo();
  
  const platforms = [
    { name: "Instagram", supported: true, Icon: Instagram },
    { name: "TikTok", supported: true, Icon: null },
    { name: "LinkedIn", supported: true, Icon: Linkedin },
    { name: "X (Twitter)", supported: true, Icon: null },
    { name: "Facebook", supported: true, Icon: Facebook },
    { name: "YouTube", supported: true, Icon: Youtube },
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
          {isLoading ? (
            <p>Loading...</p>
          ) : (
           data !== undefined && data.map((platform: Channel, index: number) => (
              <motion.div
                key={platform.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              // className={`relative group p-6 rounded-xl border transition-all ${
              //   platform.supported
              //     ? "border-border bg-card hover:border-primary/50 hover:bg-card/80"
              //     : "border-border/50 bg-card/30 opacity-40 cursor-not-allowed"
              // }`}
              className={`relative group p-6 rounded-xl border transition-all border-border bg-card hover:border-primary/50 hover:bg-card/80`}
            >
              <div className="flex flex-col items-center gap-3">
                {/* Icon */}
                <div
                  // className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  //   platform.supported
                  //     ? "bg-primary/10 text-primary"
                  //     : "bg-muted text-muted-foreground"
                  // }`}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center text-primary`}
                >
                  <Image
                    width={48}
                    height={48}
                    src={channelLogo(platform.icon)}
                    alt={platform.name}
                    className="w-10 h-10 object-contain"
                    unoptimized
                  />
                 
                </div>

                {/* Name */}
                <span className="text-sm font-medium text-center">
                  {platform.name}
                </span>

                <span className="text-xs text-primary font-medium">
                    ✓ Supported
                  </span>
              </div>

              {/* Hover Glow Effect */}
              
              <div className="absolute -inset-0.5 bg-linear-to-r from-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:to-primary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-sm" />
             
            </motion.div>
          ))
          )}
        </div>
      </Container>
    </section>
  );
}