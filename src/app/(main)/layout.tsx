import { MainLayoutClient } from '@/components/layout/main-layout-client';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <MainLayoutClient>{children}</MainLayoutClient>;
}
