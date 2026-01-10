import { ShieldAlertIcon } from "lucide-react";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";

export const UnauthenticatedView = () => {
  return (
    <div className="bg-background flex h-screen items-center justify-center">
      <div className="bg-muted w-full max-w-lg rounded-md">
        <Item variant="outline">
          <ItemMedia variant="icon">
            <ShieldAlertIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Unauthorized</ItemTitle>
            <ItemDescription>
              You do not have permission to access this resource
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <SignInButton>
              <Button variant="outline" size="sm">Sign In</Button>
            </SignInButton>
          </ItemActions>
        </Item>
      </div>
    </div>
  );
};
