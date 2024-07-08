"use client";

import { IEvent } from "@/lib/database/models/event.model";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { Button } from "../ui/button";
import Link from "next/link";
import Checkout from "./Checkout";
import DeleteConfirmation from "./DeleteConfirmation";
import { useEffect } from "react";
import { formatDateTime } from "@/lib/utils";

const CheckoutButton = ({
  event,
  order,
  email,
}: {
  event: IEvent;
  order?: string;
  email?: string;
}) => {
  const hasEventFinished = new Date(event.endDateTime) < new Date();
  const { user } = useUser();
  const userId = user?.publicMetadata.userId as string;
  const isOrganizer = userId === event.organizer._id.toString();
  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success") && order) {
      console.log("Order placed! You will receive an email confirmation.");
      const sendMail = async () => {
        const res = await fetch("/api/sendEmail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            eventName: event.title,
            ticketId: order,
            cost: event.price,
            startDateTime: formatDateTime(event.startDateTime).dateTime,
            endDateTime: formatDateTime(event.endDateTime).dateTime,
          }),
        });
        console.log(res);
      };
      sendMail();
    }
    if (query.get("canceled")) {
      console.log(
        "Order canceled -- continue to shop around and checkout when you’re ready."
      );
    }
  }, []);

  return isOrganizer ? (
    <div className="flex flex-col sm:flex-row items-start md:items-center gap-4">
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
            {order ? (
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
