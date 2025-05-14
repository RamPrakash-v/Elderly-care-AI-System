import { NextResponse } from "next/server"

// Mock data for system status - in a real implementation, this would check actual system components
const systemComponents = [
  {
    id: "health-agent",
    name: "Health Monitor Agent",
    status: "online",
    lastActivity: new Date().toISOString(),
    version: "1.0.2",
  },
  {
    id: "activity-agent",
    name: "Activity Monitor Agent",
    status: "online",
    lastActivity: new Date().toISOString(),
    version: "1.0.1",
  },
  {
    id: "reminder-agent",
    name: "Reminder Agent",
    status: "online",
    lastActivity: new Date().toISOString(),
    version: "1.0.3",
  },
  {
    id: "alert-agent",
    name: "Alert Agent",
    status: "online",
    lastActivity: new Date().toISOString(),
    version: "1.0.0",
  },
  {
    id: "social-agent",
    name: "Social Agent",
    status: "online",
    lastActivity: new Date().toISOString(),
    version: "1.0.1",
  },
  {
    id: "db-connection",
    name: "Database Connection",
    status: "online",
    lastActivity: new Date().toISOString(),
    version: "SQLite 3.36.0",
  },
]

export async function GET() {
  try {
    // In a real implementation, this would perform actual checks
    const systemStatus = {
      timestamp: new Date().toISOString(),
      systemName: "ElderCare AI",
      version: "1.0.0",
      status: "operational",
      components: systemComponents,
      metrics: {
        activeAlerts: 3,
        pendingReminders: 2,
        monitoringActive: true,
        lastHealthCheck: new Date().toISOString(),
        systemUptime: "3d 12h 45m",
      },
    }

    return NextResponse.json(systemStatus)
  } catch (error) {
    console.error("Error fetching system status:", error)
    return NextResponse.json({ error: "Failed to fetch system status" }, { status: 500 })
  }
}
