import { AppFrame } from "@/components/dashboard/app-frame";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <AppFrame>{children}</AppFrame>;
}
