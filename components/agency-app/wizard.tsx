"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Check, ChevronRight, Copy, ExternalLink, Instagram, Linkedin, Twitter, Facebook, Youtube, Loader2, PartyPopper } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const platforms = [
  { id: "instagram", name: "Instagram", icon: Instagram, color: "text-pink-500" },
  { id: "tiktok", name: "TikTok", icon: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
  ), color: "text-black dark:text-white" },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "text-blue-600" },
  { id: "x", name: "X (Twitter)", icon: Twitter, color: "text-black dark:text-white" },
  { id: "facebook", name: "Facebook", icon: Facebook, color: "text-blue-600", optional: true },
  { id: "youtube", name: "YouTube", icon: Youtube, color: "text-red-600", disabled: true, badge: "Coming Soon" },
]

interface AgencyAppWizardProps {
  onComplete: () => void
}

export function AgencyAppWizard({ onComplete }: AgencyAppWizardProps) {
  const [step, setStep] = useState(1)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [appName, setAppName] = useState("")
  const [credentials, setCredentials] = useState<Record<string, any>>({})
  const [verifying, setVerifying] = useState<string | null>(null)
  const [verified, setVerified] = useState<string[]>([])

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const handleVerify = (platformId: string) => {
    setVerifying(platformId)
    setTimeout(() => {
      setVerifying(null)
      setVerified(prev => [...prev, platformId])
    }, 1500)
  }

  const nextStep = () => setStep(prev => prev + 1)
  const prevStep = () => setStep(prev => prev - 1)

  return (
    <div className="container max-w-3xl mx-auto py-10 px-4">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold tracking-tight">Create Your Agency App</h1>
            <span className="text-sm text-muted-foreground">Step {step > 5 ? 5 : step} of 5</span>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary" 
            initial={{ width: 0 }}
            animate={{ width: `${(step / 5) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">

        {step === 1 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Name Your App</CardTitle>
                <CardDescription>This name will appear on consent screens when your clients connect their accounts.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="appName">App Name</Label>
                  <Input 
                    id="appName" 
                    placeholder="e.g. Rivera Social App" 
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    className="text-lg py-6"
                  />
                  <p className="text-sm text-muted-foreground">
                    Preview: <span className="font-medium text-foreground">{appName || "Your App Name"}</span> wants to access your Instagram account.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="ghost" onClick={prevStep}>Back</Button>
                <Button onClick={nextStep} disabled={!appName.trim()}>
                  Next Step <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
        {step === 2 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Choose Your Platforms</CardTitle>
                <CardDescription>Select the platforms you want to enable for your clients. You can add more later.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                {platforms.map((platform) => (
                  <div key={platform.id} className={`flex items-center space-x-4 border p-4 rounded-lg transition-colors ${selectedPlatforms.includes(platform.id) ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'} ${platform.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    onClick={() => !platform.disabled && togglePlatform(platform.id)}
                  >
                    <Checkbox 
                      checked={selectedPlatforms.includes(platform.id)} 
                      disabled={platform.disabled}
                      onCheckedChange={() => !platform.disabled && togglePlatform(platform.id)}
                    />
                    <div className={`p-2 rounded-full bg-background border ${platform.color}`}>
                      <platform.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Label className="text-base font-medium cursor-pointer">{platform.name}</Label>
                        {platform.badge && <Badge variant="secondary" className="text-xs">{platform.badge}</Badge>}
                        {platform.optional && <Badge variant="outline" className="text-xs">Optional</Badge>}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="flex justify-between">
                 <div className="text-sm text-muted-foreground">
                    {selectedPlatforms.length} selected
                 </div>
                <Button onClick={nextStep} disabled={selectedPlatforms.length === 0}>
                  Next Step <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Add Platform Credentials</CardTitle>
                <CardDescription>Configure your app for each platform. We've provided direct links to the developer portals.</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full" defaultValue={selectedPlatforms[0]}>
                  {selectedPlatforms.map((platformId) => {
                    const platform = platforms.find(p => p.id === platformId)!
                    const isVerified = verified.includes(platformId)
                    
                    return (
                      <AccordionItem key={platformId} value={platformId}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3">
                            <platform.icon className={`h-5 w-5 ${platform.color}`} />
                            <span>{platform.name}</span>
                            {isVerified && <Check className="h-4 w-4 text-green-500 ml-2" />}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-4 px-1">
                          <div className="bg-muted/50 p-4 rounded-lg border space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="bg-primary/10 p-2 rounded-full text-primary">
                                    <ExternalLink className="h-4 w-4" />
                                </div>
                                <div>
                                    <h4 className="font-medium">Create App on {platform.name}</h4>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Go to the developer portal and create a new app with these settings.
                                    </p>
                                    <Button variant="outline" size="sm" className="gap-2" asChild>
                                        <Link href="#" target="_blank">Open {platform.name} Guide <ExternalLink className="h-3 w-3" /></Link>
                                    </Button>
                                </div>
                            </div>
                          </div>

                          <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label>Redirect URI (Copy this)</Label>
                                <div className="flex gap-2">
                                    <Input value="https://palactix.com/oauth/meta" readOnly className="bg-muted" />
                                    <Button variant="outline" size="icon"><Copy className="h-4 w-4" /></Button>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>App ID / Client Key</Label>
                                <Input placeholder={`Paste ${platform.name} App ID`} />
                            </div>
                            <div className="grid gap-2">
                                <Label>App Secret</Label>
                                <Input type="password" placeholder={`Paste ${platform.name} App Secret`} />
                            </div>
                          </div>

                          <div className="flex justify-end pt-2">
                            <Button 
                                onClick={() => handleVerify(platformId)} 
                                disabled={isVerified || verifying === platformId}
                                className={isVerified ? "bg-green-600 hover:bg-green-700" : ""}
                            >
                                {verifying === platformId ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</>
                                ) : isVerified ? (
                                    <><Check className="mr-2 h-4 w-4" /> Verified</>
                                ) : (
                                    "Verify Credentials"
                                )}
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="ghost" onClick={prevStep}>Back</Button>
                <Button onClick={nextStep} disabled={verified.length < selectedPlatforms.length}>
                  Next Step <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
             <Card>
              <CardHeader>
                <CardTitle>Final Review</CardTitle>
                <CardDescription>You're about to activate your white-label agency app.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                    <div>
                        <p className="text-sm text-muted-foreground">App Name</p>
                        <p className="text-lg font-semibold">{appName}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setStep(2)}>Edit</Button>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-muted-foreground">Connected Platforms</p>
                        <Button variant="ghost" size="sm" onClick={() => setStep(1)}>Edit</Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {selectedPlatforms.map(id => {
                            const p = platforms.find(pl => pl.id === id)!
                            return (
                                <div key={id} className="flex items-center gap-2 p-3 border rounded-lg">
                                    <p.icon className={`h-4 w-4 ${p.color}`} />
                                    <span className="font-medium">{p.name}</span>
                                    <Check className="h-3 w-3 text-green-500 ml-auto" />
                                </div>
                            )
                        })}
                    </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="ghost" onClick={prevStep}>Back</Button>
                <Button onClick={nextStep} className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto">
                  Activate My App
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10"
          >
            <div className="flex justify-center mb-6">
                <div className="h-24 w-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <PartyPopper className="h-12 w-12 text-green-600" />
                </div>
            </div>
            <h2 className="text-4xl font-bold mb-4">You now own your social stack.</h2>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto mb-8">
                Your clients will only see <span className="font-semibold text-foreground">"{appName}"</span> on consent screens — never Palactix or a third-party tool.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-6" asChild>
                    <Link href="/clients/new">Connect Your First Client</Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6" onClick={onComplete}>
                    View App Dashboard
                </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
