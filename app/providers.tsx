"use client";

import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { createOptimizedQueryClient } from "@lib/react-query";

type ProvidersProps = {
  children: React.ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  const [queryClient] = React.useState(() => createOptimizedQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}


