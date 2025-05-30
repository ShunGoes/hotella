"use client";

import Social from "../social";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import BackButton from "./back-button";
import Header from "./header";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonRef: string;
  showSocial?: boolean;
}

const CardWrapper = ({
  children,
  showSocial,
  backButtonRef,
  backButtonLabel,
  headerLabel,
}: CardWrapperProps) => {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      <CardFooter>
      <BackButton label={backButtonLabel} href={backButtonRef} />

      </CardFooter>
    </Card>
  );
};

export default CardWrapper;
