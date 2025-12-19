"use client";

import React from "react";
import { Check, X } from "lucide-react";
import { Container } from "../Container";

const CheckIcon = () => (
  <Check className="w-5 h-5 text-primary mx-auto" />
);
const XIcon = () => <X className="w-5 h-5 text-muted-foreground mx-auto" />;

export function ComparisonTable() {
  const competitors = [
    {
      name: "Hootsuite",
      byoKeys: false,
      zeroLeakage: false,
      whiteLabel: "Limited",
      unlimitedClients: false,
      cost: "$500–$2000+/mo",
    },
    {
      name: "Sprout Social",
      byoKeys: false,
      zeroLeakage: false,
      whiteLabel: "Limited",
      unlimitedClients: false,
      cost: "$1000–$3000+/mo",
    },
    {
      name: "Buffer",
      byoKeys: false,
      zeroLeakage: false,
      whiteLabel: false,
      unlimitedClients: true,
      cost: "$250–$1200+/mo",
    },
    {
      name: "Sendible",
      byoKeys: false,
      zeroLeakage: false,
      whiteLabel: true,
      unlimitedClients: true,
      cost: "$700+/mo",
    },
    {
      name: "SocialPilot",
      byoKeys: false,
      zeroLeakage: false,
      whiteLabel: true,
      unlimitedClients: true,
      cost: "$400+/mo",
    },
    {
      name: "Ayrshare",
      byoKeys: true,
      zeroLeakage: true,
      whiteLabel: false,
      unlimitedClients: true,
      cost: "$600+/mo",
    },
  ];

  

  return (
    <section className="py-20">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why agencies choose Palactix
          </h2>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full rounded-xl overflow-hidden">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-semibold">Platform</th>
                <th className="text-center p-4 font-semibold">BYO Keys</th>
                <th className="text-center p-4 font-semibold">Zero Leakage</th>
                <th className="text-center p-4 font-semibold">White-label</th>
                <th className="text-center p-4 font-semibold">
                  Unlimited Clients
                </th>
                <th className="text-left p-4 font-semibold">Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {competitors.map((competitor, index) => (
                <tr
                  key={competitor.name}
                  className={`border-t border-border ${
                    index % 2 === 0 ? "bg-card" : "bg-muted/20"
                  }`}
                >
                  <td className="p-4">{competitor.name}</td>
                  <td className="p-4 text-center">
                    {competitor.byoKeys ? <CheckIcon /> : <XIcon />}
                  </td>
                  <td className="p-4 text-center">
                    {competitor.zeroLeakage ? <CheckIcon /> : <XIcon />}
                  </td>
                  <td className="p-4 text-center">
                    {competitor.whiteLabel ? (
                      <div className="flex flex-col items-center gap-1">
                        <CheckIcon />
                        {typeof competitor.whiteLabel === "string" && (
                          <span className="text-xs text-muted-foreground">({competitor.whiteLabel})</span>
                        )}
                      </div>
                    ) : (
                      <XIcon />
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {competitor.unlimitedClients ? <CheckIcon /> : <XIcon />}
                  </td>
                  <td className="p-4">{competitor.cost}</td>
                </tr>
              ))}

              {/* Palactix Row - Highlighted */}
              <tr className="bg-primary/10 border-t-2 border-primary">
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary">Palactix</span>
                    <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">
                      95% switch here
                    </span>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <CheckIcon />
                </td>
                <td className="p-4 text-center">
                  <CheckIcon />
                </td>
                <td className="p-4 text-center">
                  <CheckIcon />
                </td>
                <td className="p-4 text-center">
                  <CheckIcon />
                </td>
                <td className="p-4 font-bold text-primary">
                  $199 – $799 flat
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {competitors.map((competitor) => (
            <div
              key={competitor.name}
              className="bg-card border border-border rounded-xl p-4 space-y-3"
            >
              <h3 className="font-semibold text-lg">{competitor.name}</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  {competitor.byoKeys ? <CheckIcon /> : <XIcon />}
                  <span>BYO Keys</span>
                </div>
                <div className="flex items-center gap-2">
                  {competitor.zeroLeakage ? <CheckIcon /> : <XIcon />}
                  <span>Zero Leakage</span>
                </div>
                <div className="flex items-center gap-2">
                  {competitor.whiteLabel ? (
                    <div className="flex items-center gap-2">
                      <CheckIcon />
                      <span>
                        White-label
                        {typeof competitor.whiteLabel === "string" && (
                          <span className="text-xs text-muted-foreground ml-1">({competitor.whiteLabel})</span>
                        )}
                      </span>
                    </div>
                  ) : (
                    <>
                      <XIcon />
                      <span>White-label</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {competitor.unlimitedClients ? <CheckIcon /> : <XIcon />}
                  <span>Unlimited Clients</span>
                </div>
              </div>
              <div className="pt-2 border-t border-border">
                <span className="text-sm text-muted-foreground">Cost: </span>
                <span className="font-semibold">{competitor.cost}</span>
              </div>
            </div>
          ))}

          {/* Palactix Card - Highlighted */}
          <div className="bg-primary/10 border-2 border-primary rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg text-primary">Palactix</h3>
              <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">
                95% switch here
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckIcon />
                <span>BYO Keys</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon />
                <span>Zero Leakage</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon />
                <span>White-label</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon />
                <span>Unlimited Clients</span>
              </div>
            </div>
            <div className="pt-2 border-t border-primary/30">
              <span className="text-sm text-muted-foreground">Cost: </span>
              <span className="font-bold text-primary">$199 – $799 flat</span>
            </div>
          </div>
        </div>

        {/* Separator Line */}
        <div className="mt-20 border-t border-border" />
      </Container>
    </section>
  );
}
