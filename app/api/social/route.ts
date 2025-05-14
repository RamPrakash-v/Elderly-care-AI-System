import { NextResponse } from "next/server"
import { recordSocialInteraction, getWeeklySocialSummary } from "@/lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = Number.parseInt(searchParams.get("userId") || "1", 10)

  try {
    const socialSummary = await getWeeklySocialSummary(userId)

    return NextResponse.json(socialSummary)
  } catch (error) {
    console.error("Error fetching social summary:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch social summary",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const { userId, type, participants, duration } = await request.json()

    if (!userId || !type || !participants || duration === undefined) {
      return NextResponse.json(
        {
          error: "Missing required fields",
        },
        { status: 400 },
      )
    }

    await recordSocialInteraction(userId, type, participants, duration)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error recording social interaction:", error)
    return NextResponse.json(
      {
        error: "Failed to record social interaction",
      },
      { status: 500 },
    )
  }
}
