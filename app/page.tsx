import { Suspense } from 'react';
import ChatShell from '@/components/chat/ChatShell';

function HomePageFallback() {
  return <main style={{ minHeight: '100vh' }} />;
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomePageFallback />}>
      <ChatShell />
    </Suspense>
  );
}
