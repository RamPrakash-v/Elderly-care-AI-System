import { NextResponse } from "next/server"
import { recordActivity, getDailyActivitySummary } from "@/lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = Number.parseInt(searchParams.get("userId") || "1", 10)
  const date = searchParams.get("date") || new Date().toISOString().split("T")[0]

  try {
    const activitySummary = await getDailyActivitySummary(userId, date)

    return NextResponse.json(activitySummary)
  } catch (error) {
    console.error("Error fetching activity summary:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch activity summary",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const { userId, activity, status } = await request.json()

    if (!userId || !activity) {
      return NextResponse.json(
        {
          error: "Missing required fields",
        },
        { status: 400 },
      )
    }

    await recordActivity(userId, activity, status || "active")

    // Check for unusual activity patterns
    if (activity === "inactive" && status === "extended") {
      // In a real app, we would call an alert service here
      console.log(`ALERT: Extended inactivity detected for user ${userId}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error recording activity:", error)
    return NextResponse.json(
      {
        error: "Failed to record activity",
      },
      { status: 500 },
    )
  }
}
