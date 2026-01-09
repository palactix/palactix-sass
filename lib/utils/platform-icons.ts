import { ChannelIcon } from "@/features/agency-app/types/agency-app.types";

export function getPlatformIcon(icon: ChannelIcon, theme: string | undefined): string {
  if (theme === "system") {
    const systemIsDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    theme = systemIsDark ? "dark" : "light";
  }

  const isDark = theme === "dark";

  if (isDark) {
    // Dark theme preference: White logo
    return (
      icon["logo-white-svg"] ||
      icon["logo-white-png"] ||
      icon["logo-svg"] ||
      icon["logo-png"] ||
      ""
    );
  } else {
    // Light theme preference: Black logo
    return (
      icon["logo-black-svg"] ||
      icon["logo-black-png"] ||
      icon["logo-svg"] ||
      icon["logo-png"] ||
      ""
    );
  }
}
