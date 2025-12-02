import { useState, useEffect } from "react"
import { Check, Copy, ExternalLink, Plus, Upload, Trash2, Pencil, Save, X, Loader2, AlertCircle, ChevronsUpDown, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { toast } from "sonner"
import { useMyAgencyApp, useChannels } from "@/features/agency-app/api/agency-app.queries"
import { AppStatus } from "@/features/agency-app/types/agency-app.types"
import { getPlatformIcon } from "@/lib/utils/platform-icons"
import { useTheme } from "next-themes"
import Image from "next/image"

// --- Types & Data ---

type Platform = {
  id: string
  name: string
  icon: string | null | undefined
  color: string
  connected: boolean
  lastUsed?: string
  appId?: string
  optional?: boolean
  disabled?: boolean
  badge?: string
  channelId: number
}

// --- Main Component ---

export function AgencyAppDashboard() {
  const { data: myApp } = useMyAgencyApp();
  const { data: allChannels } = useChannels();
  const { theme } = useTheme();
  
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [appName, setAppName] = useState("")
  const [isEditingName, setIsEditingName] = useState(false)
  const [tempName, setTempName] = useState("")
  const [previewPlatformId, setPreviewPlatformId] = useState<string>("")
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [description, setDescription] = useState("")
  
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingPlatformId, setEditingPlatformId] = useState<string | null>(null)
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false)
  const [platformToEdit, setPlatformToEdit] = useState<Platform | null>(null)

  // Initialize data from API
  useEffect(() => {
    if (myApp && allChannels) {
      setAppName(prev => (prev !== myApp.name ? myApp.name || "My Agency App" : prev));
      setTempName(prev => (prev !== myApp.name ? myApp.name || "My Agency App" : prev));
      setDescription(prev => (prev !== myApp.description ? myApp.description || "" : prev));

      const mappedPlatforms: Platform[] = allChannels.map(channel => {
        const appChannel = myApp.channels?.find(c => c.channel_id === channel.id);
        const isConnected = !!(appChannel && (appChannel.client_id || appChannel.client_secret));
        
        return {
          id: channel.slug,
          channelId: channel.id,
          name: channel.name,
          icon: channel.icon,
          color: "",
          connected: isConnected,
          lastUsed: isConnected ? "Active" : undefined,
          appId: appChannel?.client_id || undefined,
        };
      });

      // Only update platforms if the length or connection status changes to avoid loops
      // For simplicity in this fix, we'll set it. In a real app, use deep comparison or useMemo.
      setPlatforms(mappedPlatforms);
      
      if (mappedPlatforms.length > 0 && !previewPlatformId) {
        setPreviewPlatformId(mappedPlatforms[0].id);
      }
    }
  }, [myApp, allChannels, previewPlatformId]);

  const activePlatforms = platforms.filter(p => p.connected)
  const previewPlatform = platforms.find(p => p.id === previewPlatformId) || platforms[0]

  console.log("sd");
  const handleSaveName = () => {
    // TODO: Implement API call to update name
    setAppName(tempName)
    setIsEditingName(false)
    toast.success("App name updated")
  }

  const handleCopyInfo = () => {
    const info = `App Name: ${appName}\nRedirect URI: https://palactix.com/oauth/meta\n\n` + 
      activePlatforms.map(p => `${p.name} App ID: ${p.appId}`).join('\n')
    navigator.clipboard.writeText(info)
    toast.success("App info copied to clipboard")
  }

  const handleRemovePlatform = (id: string) => {
    // TODO: Implement API call
    setPlatforms(prev => prev.map(p => p.id === id ? { ...p, connected: false } : p))
    toast.success("Platform removed")
  }

  const handleAddPlatform = (id: string, appId: string) => {
    // TODO: Implement API call
    setPlatforms(prev => prev.map(p => p.id === id ? { ...p, connected: true, appId, lastUsed: "Just now" } : p))
    setIsAddModalOpen(false)
    toast.success(`${platforms.find(p => p.id === id)?.name} connected successfully`)
  }

  const handleChangeCredentials = (id: string, appId: string) => {
    // TODO: Implement API call
    setPlatforms(prev => prev.map(p => p.id === id ? { ...p, appId } : p))
    setEditingPlatformId(null)
    setPlatformToEdit(null)
    toast.success("Credentials updated. Clients notified to reconnect.", {
        duration: 5000,
        icon: <Check className="h-4 w-4 text-green-500" />
    })
  }

  const initiateChangeCredentials = (platform: Platform) => {
    setPlatformToEdit(platform)
    setIsWarningModalOpen(true)
  }

  if (!myApp || !allChannels) {
      return (
        <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )
  }

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 space-y-10">
      
      {/* 1. Header Section */}
      <div className="flex flex-col lg:flex-row gap-8 justify-between">
        <div className="flex-1 space-y-4">
            <div className="flex items-start gap-4">
                {isEditingName ? (
                    <div className="flex items-center gap-2">
                        <Input 
                            value={tempName} 
                            onChange={(e) => setTempName(e.target.value)}
                            className="text-3xl font-bold h-auto py-1 px-2 w-auto min-w-[300px]"
                            autoFocus
                        />
                        <Button size="icon" onClick={handleSaveName}><Save className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => { setIsEditingName(false); setTempName(appName) }}><X className="h-4 w-4" /></Button>
                    </div>
                ) : (
                    <div className="group flex items-center gap-3 cursor-pointer" onClick={() => setIsEditingName(true)}>
                        <h1 className="text-3xl font-bold tracking-tight border-b border-transparent group-hover:border-dashed group-hover:border-muted-foreground/50">{appName}</h1>
                        <Pencil className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                )}
                {myApp?.status === AppStatus.REVIEW ? (
                  <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200 mt-2">In Review</Badge>
                ) : (
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 mt-2">Live</Badge>
                )}
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
                This name appears on consent screens exactly as set in your developer app. Changing it here will not update existing connections.
            </p>
        </div>

        {/* Live Preview */}
        <div className="w-full lg:w-[400px]">
            <Collapsible open={isPreviewOpen} onOpenChange={setIsPreviewOpen} className="space-y-2">
                <div className="flex items-center justify-end">
                    <CollapsibleTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                            {isPreviewOpen ? "Hide Preview" : "Show Live Preview"}
                            <ChevronsUpDown className="h-4 w-4" />
                        </Button>
                    </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                    <Card className="bg-muted/30 border-dashed overflow-hidden">
                        <div className="p-3 border-b bg-muted/50 flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Live Preview</span>
                            <Select value={previewPlatformId} onValueChange={setPreviewPlatformId}>
                                <SelectTrigger className="h-7 w-[120px] text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {platforms.map(p => (
                                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <CardContent className="p-6 flex flex-col items-center text-center space-y-4 bg-background/50">
                            {previewPlatform && (
                                <div className={`h-16 w-16 rounded-xl flex items-center justify-center bg-background border shadow-sm`}>
                                    <Image 
                                        src={getPlatformIcon(previewPlatform.icon, theme)} 
                                        alt={previewPlatform.name} 
                                        width={32} 
                                        height={32} 
                                        className="h-8 w-8 object-contain"
                                        unoptimized
                                    />
                                </div>
                            )}
                            <div className="space-y-1">
                                <p className="font-medium text-lg leading-tight">
                                    <span className="font-bold">{appName}</span> wants to access your {previewPlatform?.name} account
                                </p>
                                <p className="text-xs text-muted-foreground">This is what your clients see — no Palactix branding.</p>
                            </div>
                            <div className="w-full space-y-2 pt-2 opacity-50 pointer-events-none">
                                <Button className="w-full" size="sm">Allow Access</Button>
                                <Button variant="ghost" className="w-full" size="sm">Cancel</Button>
                            </div>
                        </CardContent>
                    </Card>
                </CollapsibleContent>
            </Collapsible>
        </div>
      </div>

      {/* Review Status Alert */}
      {myApp?.status === AppStatus.REVIEW && (
        <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-900 dark:text-amber-100">App Under Review</AlertTitle>
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            Your app has been submitted for review. We&apos;ll notify you once it&apos;s approved and live. 
            You can view your configuration below, but changes are restricted during review.
          </AlertDescription>
        </Alert>
      )}

      {/* 2. Connected Platforms */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Connected Platforms</h3>
            <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add New Platform
            </Button>
        </div>

        <div className="grid gap-4">
            {activePlatforms.map(platform => (
                <Card key={platform.id} className="p-0 overflow-hidden">
                    <div className="flex flex-col sm:flex-row">
                        <div className="p-6 flex-1 flex items-start gap-4">
                            <div className={`p-3 rounded-full bg-background border shadow-sm`}>
                                <Image 
                                    src={getPlatformIcon(platform.icon, theme)} 
                                    alt={platform.name} 
                                    width={24} 
                                    height={24} 
                                    className="h-6 w-6 object-contain"
                                    unoptimized
                                />
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-lg">{platform.name}</h4>
                                    <Badge variant="secondary" className="text-green-600 bg-green-50 hover:bg-green-50">Connected</Badge>
                                </div>
                                <div className="text-sm text-muted-foreground flex items-center gap-2">
                                    <span>Last used {platform.lastUsed}</span>
                                    <span>•</span>
                                    <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">App ID: {platform.appId}</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-muted/30 p-4 sm:w-[200px] flex flex-row sm:flex-col items-center sm:justify-center gap-2 border-t sm:border-t-0 sm:border-l">
                            <Button variant="outline" size="sm" className="w-full" onClick={() => initiateChangeCredentials(platform)}>
                                Change Credentials
                            </Button>
                            
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                                        <Trash2 className="mr-2 h-4 w-4" /> Remove
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Remove {platform.name}?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Removing {platform.name} will <span className="font-bold text-destructive">disable posting</span> for all clients on this platform.
                                            You can re-add it later.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleRemovePlatform(platform.id)} className="bg-destructive hover:bg-destructive/90">Remove Platform</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                </Card>
            ))}
            {activePlatforms.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed rounded-xl text-muted-foreground">
                    No platforms connected. Add one to get started.
                </div>
            )}
        </div>
      </div>

      {/* 3. App Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">App Details <span className="text-sm font-normal text-muted-foreground ml-2">(Optional — improves trust on some consent screens)</span></h3>
        <Card>
            <CardContent className="p-6 space-y-6">
                <div className="flex flex-col sm:flex-row gap-8">
                    <div className="space-y-3">
                        <Label>App Logo</Label>
                        <div className="h-32 w-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer group relative overflow-hidden">
                            <Upload className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-xs">Upload PNG</span>
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-medium">
                                512x512
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 space-y-3">
                        <Label>App Description</Label>
                        <Textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="min-h-[120px] resize-none"
                        />
                        <div className="flex justify-end">
                            <Button variant="outline" size="sm" onClick={handleCopyInfo}>
                                <Copy className="mr-2 h-3 w-3" /> Copy App Info
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>

      {/* --- Modals --- */}

      {/* Add Platform Modal */}
      <PlatformSetupDialog 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen}
        mode="add"
        platforms={platforms.filter(p => !p.connected)}
        onComplete={handleAddPlatform}
      />

      {/* Warning Modal for Change Credentials */}
      <AlertDialog open={isWarningModalOpen} onOpenChange={setIsWarningModalOpen}>
        <AlertDialogContent className="border-l-4 border-destructive">
            <AlertDialogHeader>
                <div className="flex items-center gap-2 text-destructive mb-2">
                    <AlertTriangle className="h-5 w-5" />
                    <AlertDialogTitle>Warning: This will disconnect ALL your clients</AlertDialogTitle>
                </div>
                <AlertDialogDescription className="space-y-3 text-foreground">
                    <p>Changing credentials invalidates every existing connection to <strong>{platformToEdit?.name}</strong>.</p>
                    <p>Every client will need to re-authorize with the new app.</p>
                    <p className="font-medium">This usually takes 1–3 days and cannot be undone.</p>
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                    className="bg-destructive hover:bg-destructive/90"
                    onClick={() => {
                        setIsWarningModalOpen(false)
                        setEditingPlatformId(platformToEdit?.id || null)
                    }}
                >
                    Yes, Change Credentials
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Credentials Modal (Reusing Setup Dialog logic but simplified) */}
      {platformToEdit && (
          <PlatformSetupDialog 
            open={!!editingPlatformId} 
            onOpenChange={(open) => {
                if (!open) {
                    setEditingPlatformId(null)
                    setPlatformToEdit(null)
                }
            }}
            mode="edit"
            initialPlatform={platformToEdit}
            platforms={[platformToEdit]}
            onComplete={handleChangeCredentials}
          />
      )}

    </div>
  )
}

// --- Helper Components ---

function PlatformSetupDialog({ 
    open, 
    onOpenChange, 
    mode, 
    platforms, 
    initialPlatform,
    onComplete 
}: { 
    open: boolean
    onOpenChange: (open: boolean) => void
    mode: 'add' | 'edit'
    platforms: Platform[]
    initialPlatform?: Platform
    onComplete: (id: string, appId: string) => void
}) {
    const [step, setStep] = useState(mode === 'edit' ? 2 : 1)
    const [selectedPlatformId, setSelectedPlatformId] = useState<string | null>(initialPlatform?.id || null)
    const [appId, setAppId] = useState("")
    const [appSecret, setAppSecret] = useState("")
    const [verifying, setVerifying] = useState(false)
    const { theme } = useTheme();

    const selectedPlatform = platforms.find(p => p.id === selectedPlatformId)

    const handleNext = () => setStep(2)
    
    const handleVerify = () => {
        if (!selectedPlatform) return
        setVerifying(true)
        setTimeout(() => {
            setVerifying(false)
            onComplete(selectedPlatform.id, appId || "123456789012345") // Mock App ID if empty
            handleClose()
        }, 1500)
    }

    const handleClose = () => {
        onOpenChange(false)
        // Reset state after transition
        setTimeout(() => {
            setStep(mode === 'edit' ? 2 : 1)
            if (mode === 'add') setSelectedPlatformId(null)
            setAppId("")
            setAppSecret("")
        }, 300)
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{mode === 'add' ? 'Add New Platform' : `Change ${selectedPlatform?.name} Credentials`}</DialogTitle>
                    <DialogDescription>
                        {step === 1 ? "Choose a platform to connect." : "Enter your developer app credentials."}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {step === 1 && (
                        <div className="grid gap-3">
                            {platforms.map(platform => (
                                <div 
                                    key={platform.id} 
                                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${selectedPlatformId === platform.id ? 'border-primary bg-primary/5' : 'hover:bg-muted'}`}
                                    onClick={() => setSelectedPlatformId(platform.id)}
                                >
                                    <div className={`p-2 rounded-full bg-background border`}>
                                        <Image 
                                            src={getPlatformIcon(platform.icon, theme)} 
                                            alt={platform.name} 
                                            width={20} 
                                            height={20} 
                                            className="h-5 w-5 object-contain"
                                            unoptimized
                                        />
                                    </div>
                                    <span className="font-medium">{platform.name}</span>
                                    {selectedPlatformId === platform.id && <Check className="ml-auto h-4 w-4 text-primary" />}
                                </div>
                            ))}
                        </div>
                    )}

                    {step === 2 && selectedPlatform && (
                        <div className="space-y-4">
                            <div className="bg-muted/50 p-4 rounded-lg border space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="bg-primary/10 p-2 rounded-full text-primary">
                                        <ExternalLink className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-sm">Create App on {selectedPlatform.name}</h4>
                                        <Button variant="link" className="h-auto p-0 text-xs" asChild>
                                            <a href="#" target="_blank">Open Developer Guide</a>
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <Label className="text-xs">Redirect URI</Label>
                                    <div className="flex gap-2">
                                        <Input value="https://palactix.com/oauth/meta" readOnly className="bg-muted text-xs font-mono" />
                                        <Button variant="outline" size="icon" className="h-9 w-9"><Copy className="h-4 w-4" /></Button>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">App ID / Client Key</Label>
                                    <Input 
                                        placeholder={`Paste ${selectedPlatform.name} App ID`} 
                                        value={appId}
                                        onChange={(e) => setAppId(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">App Secret</Label>
                                    <Input 
                                        type="password" 
                                        placeholder={`Paste ${selectedPlatform.name} App Secret`} 
                                        value={appSecret}
                                        onChange={(e) => setAppSecret(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    {step === 1 ? (
                        <Button onClick={handleNext} disabled={!selectedPlatformId}>Next Step</Button>
                    ) : (
                        <div className="flex justify-between w-full">
                            {mode === 'add' && <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>}
                            <Button onClick={handleVerify} disabled={verifying} className="ml-auto">
                                {verifying ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</> : "Verify & Connect"}
                            </Button>
                        </div>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
