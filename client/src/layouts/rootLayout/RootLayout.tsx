import { ClerkProvider, SignedIn, UserButton } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// @ts-ignore
import { Link, Outlet } from 'react-router-dom';
import './rootLayout.css';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const API_URL = import.meta.env.VITE_API_UR;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

const queryClient = new QueryClient();

const RootLayout = () => {
  return (
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      // frontendApi={API_URL}
      afterSignOutUrl="/"
    >
      <QueryClientProvider client={queryClient}>
        <div className="rootLayout">
          <header>
            <Link to="/#">
              <span>Chat app</span>
            </Link>
            <div className="user">
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>
          <main>
            <Outlet />
          </main>
        </div>
      </QueryClientProvider>
    </ClerkProvider>
  );
};

export default RootLayout;
