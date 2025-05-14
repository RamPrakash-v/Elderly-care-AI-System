import { NextResponse } from "next/server"
import { getLatestHealthData, recordHealthData } from "/lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = Number.parseInt(searchParams.get("userId") || "1", 10)

  try {
    const healthData = await getLatestHealthData(userId)

    if (!healthData) {
      return NextResponse.json(
        {
          error: "No health data found for this user",
        },
        { status: 404 },
      )
    }

    return NextResponse.json(healthData)
  } catch (error) {
    console.error("Error fetching health data:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch health data",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const { userId, heartRate, bp, glucose } = await request.json()

    if (!userId || !heartRate || !bp || glucose === undefined) {
      return NextResponse.json(
        {
          error: "Missing required fields",
        },
        { status: 400 },
      )
    }

    await recordHealthData(userId, heartRate, bp, glucose)

    // Check for abnormal values and trigger alerts if needed
    if (
      heartRate > 100 ||
      heartRate < 50 ||
      Number.parseInt(bp.split("/")[0]) > 140 ||
      Number.parseInt(bp.split("/")[1]) > 90 ||
      glucose > 200
    ) {
      // In a real app, we would call an alert service here
      console.log(`ALERT: Abnormal health reading detected for user ${userId}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error recording health data:", error)
    return NextResponse.json(
      {
        error: "Failed to record health data",
      },
      { status: 500 },
    )
  }
}
