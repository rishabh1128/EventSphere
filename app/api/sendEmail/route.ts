import nodemailer from "nodemailer";
import { NextResponse, NextRequest } from "next/server";
import { formatPrice } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const { email, eventName, ticketId, cost, startDateTime, endDateTime } =
    await req.json();
  const displayCost = cost ? cost : "0";
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: "EventSphere <no-reply@event-sphere-theta.vercel.app>",
    to: email,
    subject: "Event Ticket Purchase Confirmation",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;padding: 20px; background-color: #f4f4f4; border-radius: 10px;overflow-x:auto">
          <h2 style="color: #4CAF50;">Thank you for your purchase!</h2>
          <p>We're excited to have you at <strong>${eventName}</strong>. Here are your ticket details:</p>
          <table style="border-collapse: collapse; width: 100%; margin-top: 20px;">
            <thead>
              <tr style="background-color: #4CAF50; color: #ffffff;">
                <th style="border: 1px solid #ddd; padding: 12px;">Event Name</th>
                <th style="border: 1px solid #ddd; padding: 12px;">Ticket ID</th>
                <th style="border: 1px solid #ddd; padding: 12px;">Cost</th>
                <th style="border: 1px solid #ddd; padding: 12px;">Event Start Date</th>
                <th style="border: 1px solid #ddd; padding: 12px;">Event End Date</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #f9f9f9;">
                <td style="border: 1px solid #ddd; padding: 12px;">${eventName}</td>
                <td style="border: 1px solid #ddd; padding: 12px;">${ticketId}</td>
                <td style="border: 1px solid #ddd; padding: 12px;">${formatPrice(
                  displayCost
                )}</td>
                <td style="border: 1px solid #ddd; padding: 12px;">${startDateTime}</td>
                <td style="border: 1px solid #ddd; padding: 12px;">${endDateTime}</td>
              </tr>
            </tbody>
          </table>
          <p style="margin-top: 20px;">We look forward to seeing you there!</p>
          <p>Best regards,<br>The EventSphere Team</p>
      </div>
    `,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    return NextResponse.json(
      { message: "Email sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error sending email" }, { status: 500 });
  }
}
