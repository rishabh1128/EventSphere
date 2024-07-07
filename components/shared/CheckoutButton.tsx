"use client";

import { IEvent } from "@/lib/database/models/event.model";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { Button } from "../ui/button";
import Link from "next/link";
import Checkout from "./Checkout";
import DeleteConfirmation from "./DeleteConfirmation";
import Image from "next/image";

const CheckoutButton = ({
  event,
  isOrdered,
}: {
  event: IEvent;
  isOrdered: boolean;
}) => {
  const hasEventFinished = new Date(event.endDateTime) < new Date();
  const { user } = useUser();
  const userId = user?.publicMetadata.userId as string;
  const isOrganizer = userId === event.organizer._id.toString();

  return isOrganizer ? (
    <div className="flex items-center gap-4">
      <Button asChild className="button rounded-full" size="lg">
        <Link href={`/events/${event._id}/update`}>Update Event</Link>
      </Button>
      <DeleteConfirmation eventId={event._id} type="Button" />
      <Button
        asChild
        className="button bg-green-500 hover:bg-green-400"
        size="lg"
      >
        <Link href={`/orders?eventId=${event._id}`} className="flex gap-2">
          <p>Order Details</p>
        </Link>
      </Button>
    </div>
  ) : (
    <div className="flex items-center gap-3">
      {hasEventFinished ? (
        <p className="p-2 text-red-400">
          {" "}
          Sorry! Tickets are no longer available.
        </p>
      ) : (
        <>
          {" "}
          <SignedOut>
            <Button asChild className="button rounded-full" size="lg">
              <Link href={"/sign-in"}>Get Tickets</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            {isOrdered ? (
              <p className="p-2 text-green-500"> Already purchased!</p>
            ) : (
              <Checkout event={event} userId={userId} />
            )}
          </SignedIn>
        </>
      )}
    </div>
  );
};

export default CheckoutButton;
