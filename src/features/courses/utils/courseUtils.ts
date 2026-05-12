import { Monitor, Users, MapPin, Globe } from "lucide-react";

export const getModeIcon = (mode: number | string) => {
  const m = Number(mode);
  switch (m) {
    case 1:
      return Globe;
    case 2:
      return Users;
    default:
      return Monitor;
  }
};

export const getModeLabel = (mode: number | string) => {
  const m = Number(mode);
  switch (m) {
    case 1:
      return "Online";
    case 2:
      return "Offline";
    default:
      return "Khác";
  }
};
