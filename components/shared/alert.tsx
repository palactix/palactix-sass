import { Alert as MainAlert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, Info, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export enum AlertType {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info"
}

export interface AlertProps {
  type: AlertType;
  title?: string;
  message: string;
  className?: string;
}

export interface AlertVariantProps {
  title?: string;
  message: string;
  className?: string;
}

export type AlertSuccessProps = AlertVariantProps;
export type AlertErrorProps = AlertVariantProps;
export type AlertWarningProps = AlertVariantProps;
export type AlertInfoProps = AlertVariantProps;

const alertConfig = {
  [AlertType.SUCCESS]: {
    icon: CheckCircle,
    className: "border-green-200 bg-green-50 text-green-600 dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-400",
    titleClassName: "text-green-800 dark:text-green-300",
    descriptionClassName: "text-green-700 dark:text-green-300/90"
  },
  [AlertType.ERROR]: {
    icon: XCircle,
    className: "border-red-200 bg-red-50 text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400",
    titleClassName: "text-red-800 dark:text-red-300",
    descriptionClassName: "text-red-700 dark:text-red-300/90"
  },
  [AlertType.WARNING]: {
    icon: AlertTriangle,
    className: "border-amber-200 bg-amber-50 text-amber-600",
    titleClassName: "text-amber-800",
    descriptionClassName: "text-amber-700"
  },
  [AlertType.INFO]: {
    icon: Info,
    className: "border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-400",
    titleClassName: "text-blue-800 dark:text-blue-300",
    descriptionClassName: "text-blue-700 dark:text-blue-300/90"
  }
};

export const Alert = ({ type, title, message, className }: AlertProps) => {
  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <MainAlert className={cn(config.className, className)}>
      <Icon className="h-4 w-4" />
      {title && <AlertTitle className={cn("font-semibold", config.titleClassName)}>{title}</AlertTitle>}
      <AlertDescription className={config.descriptionClassName}>
        {message}
      </AlertDescription>
    </MainAlert>
  )
}

export const AlertWarning = (props: AlertWarningProps) => (
  <Alert type={AlertType.WARNING} {...props} />
)

export const AlertSuccess = (props: AlertSuccessProps) => (
  <Alert type={AlertType.SUCCESS} {...props} />
)

export const AlertError = (props: AlertErrorProps) => (
  <Alert type={AlertType.ERROR} {...props} />
)

export const AlertInfo = (props: AlertInfoProps) => (
  <Alert type={AlertType.INFO} {...props} />
)