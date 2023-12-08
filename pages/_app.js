import '@/styles/globals.css';
import { HuddleClient, HuddleProvider } from '@huddle01/react';

export default function App({ Component, pageProps }) {
  const huddleClient = new HuddleClient({
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    options: {
      activeSpeakers: {
        size: 8,
      },
    },
  });

  return (
    <HuddleProvider client={huddleClient}>
      <Component {...pageProps} />
    </HuddleProvider>
  );
}
