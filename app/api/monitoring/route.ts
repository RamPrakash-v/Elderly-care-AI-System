import { NextResponse } from "next/server"
import { startMonitoring, stopMonitoring } from "@/lib/setup-monitoring"

export async function POST(request: Request) {
  const { action, userId = 1 } = await request.json()

  try {
    if (action === "start") {
      const result = startMonitoring(userId)
      return NextResponse.json({ success: true, message: "Monitoring started" })
    } else if (action === "stop") {
      const result = stopMonitoring()
      return NextResponse.json({ success: true, message: "Monitoring stopped" })
    } else {
      return NextResponse.json({ error: "Invalid action. Use 'start' or 'stop'" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error managing monitoring:", error)
    return NextResponse.json({ error: "Failed to manage monitoring" }, { status: 500 })
  }
}
