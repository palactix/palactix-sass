import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const response = await fetch(
      `https://api.mailgun.net/v3/lists/auto@emails-sandbox.palactix.com/members`,
      {
        method: "POST",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from("api:" + process.env.MAILGUN_API_KEY).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          subscribed: "yes",
          address: email,
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: err }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}