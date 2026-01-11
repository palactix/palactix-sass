"use client";

import React, { useState } from "react";
import { Plus, Minus, Cross, X, Check } from "lucide-react";
import { Container } from "../Container";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import Link from "next/link";

export function ComparisonTable() {
  const [teamSeats, setTeamSeats] = useState(5);
  const [clientBrands, setClientBrands] = useState(15);
  const [publishingToX, setPublishingToX] = useState(false);

  // Calculate costs
  const singleSeatCost = 199;
  const singleClientCost = 49;
  const traditionalSeatCost = teamSeats * singleSeatCost;
  const traditionalClientCost = clientBrands * singleClientCost;
  const traditionalTotal = traditionalSeatCost + traditionalClientCost;
  
  const palactixXFee = publishingToX ? 200 : 0;
  const palactixTotal = 799 + palactixXFee; // Flat infrastructure fee
  
  const monthlySavings = traditionalTotal - palactixTotal;

  return (
    <section className="py-20 bg-muted/30">
      <Container>
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Stop Paying the <span className="text-primary">Success Tax</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Traditional social media tools charge more as you add staff and clients.{" "}
            <span className="font-semibold text-foreground">
              Palactix gives agencies flat infrastructure
            </span>{" "}
            so growth increases profit — not software bills.
          </p>
        </div>

        {/* Monthly Cost Calculator */}
        <div className="w-full mx-auto mb-8">
          <h3 className="text-2xl font-bold mb-6 text-center">Monthly Cost Calculator</h3>
          
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Team Seats */}
              <div className="text-center">
                <label className="text-sm font-semibold mb-1 block">Team Seats</label>
                <p className="text-xs text-muted-foreground mb-3">
                  Employees who manage content
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setTeamSeats(Math.max(1, teamSeats - 1))}
                    className="h-10 w-10 rounded-full"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-3xl font-bold min-w-[60px] text-center">
                    {teamSeats}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setTeamSeats(teamSeats + 1)}
                    className="h-10 w-10 rounded-full"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Client Brands */}
              <div className="text-center">
                <label className="text-sm font-semibold mb-1 block">Client Brands</label>
                <p className="text-xs text-muted-foreground mb-3">
                  Brands or accounts you manage
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setClientBrands(Math.max(1, clientBrands - 1))}
                    className="h-10 w-10 rounded-full"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-3xl font-bold min-w-[60px] text-center">
                    {clientBrands}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setClientBrands(clientBrands + 1)}
                    className="h-10 w-10 rounded-full"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Publishing to X Toggle */}
              <div className="text-center">
                <label className="text-sm font-semibold mb-1 block">Publishing to X?</label>
                <p className="text-xs text-muted-foreground mb-3">
                  Direct X subscription required
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <span className={`text-sm font-medium ${!publishingToX ? 'text-foreground' : 'text-muted-foreground'}`}>
                    No
                  </span>
                  <Switch
                    checked={publishingToX}
                    onCheckedChange={setPublishingToX}
                    className="data-[state=checked]:bg-primary"
                  />
                  <span className={`text-sm font-medium ${publishingToX ? 'text-foreground' : 'text-muted-foreground'}`}>
                    Yes
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="w-full mx-auto mb-8">
          <h3 className="text-2xl font-bold mb-6 text-center">Monthly Software Cost Comparison</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full border border-border overflow-hidden bg-card">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-semibold border-b border-border">Cost Category</th>
                  <th className="text-left p-4 font-semibold border-b border-border">Traditional Agency Tools</th>
                  <th className="text-left p-4 font-semibold border-b border-border">Palactix</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-4 font-medium">Pricing Model</td>
                  <td className="p-4">Per seat + per client</td>
                  <td className="p-4">Flat infrastructure fee</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 font-medium">BYO Keys (Zero-Ban Security)</td>
                  <td className="p-4"> 
                    {/* need cross icon with red */}
                    <span className="text-red-600 dark:text-red-400 font-semibold">
                      <X className="inline w-4 h-4 mr-1" />
                      
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-green-600 dark:text-green-400 font-semibold">
                      <Check className="inline w-4 h-4 mr-1" />
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 font-medium">Team Seat Cost</td>
                  <td className="p-4">{teamSeats} × ${singleSeatCost} = ${traditionalSeatCost.toLocaleString()}</td>
                  <td className="p-4 text-green-600 dark:text-green-400 font-semibold">Included</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 font-medium">Client Brand Cost</td>
                  <td className="p-4">{clientBrands} × ${singleClientCost} = ${traditionalClientCost.toLocaleString()}</td>
                  <td className="p-4 text-green-600 dark:text-green-400 font-semibold">Included</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 font-medium">Platform API Fees</td>
                  <td className="p-4">Included (often marked up)</td>
                  <td className="p-4">
                    {publishingToX ? (
                      <span>${palactixXFee} <span className="text-xs text-muted-foreground">(paid directly to X)</span></span>
                    ) : (
                      <span className="text-green-600 dark:text-green-400 font-semibold">$0</span>
                    )}
                  </td>
                </tr>
                {/* Highlighted Total Row */}
                <tr className="bg-primary/10 border-t-2 border-primary">
                  <td className="p-4 font-bold text-lg">Total Monthly Cost</td>
                  <td className="p-4 font-bold text-xl">${traditionalTotal.toLocaleString()}</td>
                  <td className="p-4 font-bold text-xl text-primary">${palactixTotal.toLocaleString()} (Pro)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Combined: Profit Recovery + CTA */}
        <div className="w-full mx-auto mb-8">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-2 border-green-500 dark:border-green-600 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Left: Profit Recovery */}
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold mb-2">Estimated Monthly Savings</h3>
                <p className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                  +${monthlySavings.toLocaleString()} <span className="text-lg font-normal">/month</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Every new client improves margins instead of overhead
                </p>
              </div>
              
              {/* Right: CTA */}
              <div className="text-center md:text-right">
                <Link href="/auth/signup" rel="noopener noreferrer" className="cursor-pointer">
                  <Button size="lg" className="text-base px-6 py-5 h-auto mb-3">
                    Instant Access to White-Label Dashboard
                  </Button>
                </Link>
                <p className="text-xs text-muted-foreground">
                  No credit card • Your own apps • Cancel anytime
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Infrastructure Transparency - Informational Text */}
        <div className="w-full mx-auto mb-6 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            <strong className="text-foreground">Infrastructure Transparency:</strong> Palactix is a BYO-key platform. 
            You use your own social platform apps — not shared credentials. 
            Meta, LinkedIn, and TikTok provide API access at no cost. 
            X requires a direct developer subscription (~$200/mo). 
            Platform fees are paid directly to networks, never marked up.
          </p>
          <p className="text-xs text-muted-foreground/70">
            Figures shown are representative industry averages for agencies managing 5–15 clients.
          </p>
        </div>
      </Container>
    </section>
  );
}
