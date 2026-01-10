"use client";

import { ReactNode } from "react";
import {
  ClerkProvider,
  useAuth,
  UserButton,
} from "@clerk/nextjs";
import {
  Authenticated,
  AuthLoading,
  ConvexReactClient,
  Unauthenticated,
} from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { shadcn } from "@clerk/themes";

import { UnauthenticatedView } from "@/features/auth/unauthenticated-view";
import { AuthLoadingView } from "@/features/auth/auth-loading-view";
import { ThemeProvider } from "@/components/theme-provider";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ClerkProvider
      appearance={{
        theme: shadcn,
        layout: {
          socialButtonsPlacement: "bottom",
          socialButtonsVariant: "iconButton",
        },
      }}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Authenticated>
            <UserButton />
            {children}
          </Authenticated>
          <Unauthenticated>
            <UnauthenticatedView />
          </Unauthenticated>
          <AuthLoading>
            <AuthLoadingView />
          </AuthLoading>
        </ThemeProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};
