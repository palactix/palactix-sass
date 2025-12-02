interface WizardStepWrapperProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function WizardStepWrapper({ title, description, children }: WizardStepWrapperProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="p-6 border rounded-xl bg-card text-card-foreground shadow-sm">
        {children}
      </div>
    </div>
  );
}
