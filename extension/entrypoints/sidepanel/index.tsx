import React from 'react';
import { createRoot } from "react-dom/client";
import { Provider } from 'jotai/react';
import { useHydrateAtoms } from 'jotai/react/utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { queryClientAtom } from 'jotai-tanstack-query';
import { App } from "./App";
import '../../assets/tailwind.css';

const queryClient = new QueryClient();

function HydrateAtoms({ children }: { children: React.ReactNode }) {
  useHydrateAtoms([[queryClientAtom, queryClient]]);
  return children;
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider>
        <HydrateAtoms>
          <App />
        </HydrateAtoms>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
);
