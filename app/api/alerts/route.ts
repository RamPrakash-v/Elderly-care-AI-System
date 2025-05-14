import { NextResponse } from "next/server"
import { createAlert, getActiveAlerts } from "@/lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = Number.parseInt(searchParams.get("userId") || "1", 10)

  try {
    const alerts = await getActiveAlerts(userId)

    return NextResponse.json(alerts)
  } catch (error) {
    console.error("Error fetching alerts:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch alerts",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const { userId, message, type, priority } = await request.json()

    if (!userId || !message || !type || !priority) {
      return NextResponse.json(
        {
          error: "Missing required fields",
        },
        { status: 400 },
      )
    }

    await createAlert(userId, message, type, priority)

    // For critical alerts, we could trigger immediate notifications
    if (priority === "critical") {
      // In a real app, we would integrate with SMS/calling service
      console.log(`CRITICAL ALERT: ${message} for user ${userId}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error creating alert:", error)
    return NextResponse.json(
      {
        error: "Failed to create alert",
      },
      { status: 500 },
    )
  }
}
