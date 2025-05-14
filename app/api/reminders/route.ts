import { NextResponse } from "next/server"
import { addReminder, getDueReminders } from "@/lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = Number.parseInt(searchParams.get("userId") || "1", 10)
  const time = searchParams.get("time") || new Date().toTimeString().slice(0, 5)

  // Get current day (Mon, Tue, etc.)
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const currentDay = days[new Date().getDay()]

  try {
    const dueReminders = await getDueReminders(userId, time, currentDay)

    return NextResponse.json(dueReminders)
  } catch (error) {
    console.error("Error fetching reminders:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch reminders",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const { userId, message, time, days, type } = await request.json()

    if (!userId || !message || !time || !days || !type) {
      return NextResponse.json(
        {
          error: "Missing required fields",
        },
        { status: 400 },
      )
    }

    await addReminder(userId, message, time, days, type)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error adding reminder:", error)
    return NextResponse.json(
      {
        error: "Failed to add reminder",
      },
      { status: 500 },
    )
  }
}
