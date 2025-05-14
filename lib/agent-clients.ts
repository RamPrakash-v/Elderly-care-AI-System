// Interface for health data
interface HealthData {
    heart_rate?: number
    bp?: string
    glucose?: number
    timestamp?: string
  }
  
  // Interface for alert data
  interface AlertData {
    id: number
    message: string
    type: string
    priority: string
    time: string
    status: string
    handled: boolean
  }
  
  /**
   * Fetches the latest health data from the API
   */
  export async function fetchLatestHealthData(userId = 1): Promise<HealthData | null> {
    try {
      const response = await fetch(`/api/health?userId=${userId}`)
      if (!response.ok) {
        console.error("Failed to fetch health data:", await response.text())
        return null
      }
      return await response.json()
    } catch (error) {
      console.error("Error fetching health data:", error)
      return null
    }
  }
  
  /**
   * Fetches active alerts from the API
   */
  export async function fetchActiveAlerts(userId = 1): Promise<AlertData[]> {
    try {
      const response = await fetch(`/api/alerts?userId=${userId}`)
      if (!response.ok) {
        console.error("Failed to fetch alerts:", await response.text())
        return []
      }
      return await response.json()
    } catch (error) {
      console.error("Error fetching alerts:", error)
      return []
    }
  }
  
  /**
   * Records a new reminder
   */
  export async function recordReminder(
    userId: number,
    message: string,
    time: string,
    days: string[],
    type: string,
  ): Promise<boolean> {
    try {
      const response = await fetch("/api/reminders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          message,
          time,
          days,
          type,
        }),
      })
  
      return response.ok
    } catch (error) {
      console.error("Error recording reminder:", error)
      return false
    }
  }
  
  /**
   * Records a social interaction
   */
  export async function recordSocialInteraction(
    userId: number,
    type: string,
    participants: string[],
    duration: number,
  ): Promise<boolean> {
    try {
      const response = await fetch("/api/social", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          type,
          participants,
          duration,
        }),
      })
  
      return response.ok
    } catch (error) {
      console.error("Error recording social interaction:", error)
      return false
    }
  }
  
  /**
   * Creates a new alert
   */
  export async function createAlert(userId: number, message: string, type: string, priority: string): Promise<boolean> {
    try {
      const response = await fetch("/api/alerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          message,
          type,
          priority,
        }),
      })
  
      return response.ok
    } catch (error) {
      console.error("Error creating alert:", error)
      return false
    }
  }
  
  /**
   * Resolves an alert
   */
  export async function resolveAlert(alertId: number): Promise<boolean> {
    try {
      const response = await fetch(`/api/alerts/${alertId}/resolve`, {
        method: "PUT",
      })
  
      return response.ok
    } catch (error) {
      console.error("Error resolving alert:", error)
      return false
    }
  }
  