/**
 * This module handles the setup and initialization of the monitoring system,
 * including periodic health checks and alert generation.
 */

import { fetchLatestHealthData, createAlert } from "../lib/agent-clients";

// Intervals for different checks (in milliseconds)
const HEALTH_CHECK_INTERVAL = 60000 // 1 minute
const ACTIVITY_CHECK_INTERVAL = 120000 // 2 minutes
const REMINDER_CHECK_INTERVAL = 30000 // 30 seconds
const SOCIAL_CHECK_INTERVAL = 3600000 // 1 hour

// Thresholds for health metrics
const THRESHOLDS = {
  heart_rate: { low: 60, high: 100 },
  blood_pressure: { systolic: { low: 90, high: 140 }, diastolic: { low: 60, high: 90 } },
  glucose: { low: 70, high: 140 },
}

let healthCheckInterval: NodeJS.Timeout | null = null
let activityCheckInterval: NodeJS.Timeout | null = null
let reminderCheckInterval: NodeJS.Timeout | null = null
let socialCheckInterval: NodeJS.Timeout | null = null

/**
 * Start monitoring all systems
 */
export function startMonitoring(userId = 1) {
  // Clear any existing intervals
  stopMonitoring()

  // Start health monitoring
  healthCheckInterval = setInterval(() => {
    checkHealthMetrics(userId)
  }, HEALTH_CHECK_INTERVAL)

  // Start activity monitoring
  activityCheckInterval = setInterval(() => {
    checkActivity(userId)
  }, ACTIVITY_CHECK_INTERVAL)

  // Start reminder checks
  reminderCheckInterval = setInterval(() => {
    checkReminders(userId)
  }, REMINDER_CHECK_INTERVAL)

  // Start social engagement monitoring
  socialCheckInterval = setInterval(() => {
    checkSocialEngagement(userId)
  }, SOCIAL_CHECK_INTERVAL)

  console.log("ElderCare monitoring system started")
  return true
}

/**
 * Stop all monitoring processes
 */
export function stopMonitoring() {
  if (healthCheckInterval) clearInterval(healthCheckInterval)
  if (activityCheckInterval) clearInterval(activityCheckInterval)
  if (reminderCheckInterval) clearInterval(reminderCheckInterval)
  if (socialCheckInterval) clearInterval(socialCheckInterval)

  healthCheckInterval = null
  activityCheckInterval = null
  reminderCheckInterval = null
  socialCheckInterval = null

  console.log("ElderCare monitoring system stopped")
  return true
}

/**
 * Check health metrics and create alerts if needed
 */
async function checkHealthMetrics(userId: number) {
  try {
    const healthData = await fetchLatestHealthData(userId)
    if (!healthData) return

    // Check heart rate
    if (healthData.heart_rate) {
      if (healthData.heart_rate < THRESHOLDS.heart_rate.low) {
        await createAlert(userId, `Low heart rate detected: ${healthData.heart_rate} BPM`, "health", "high")
      } else if (healthData.heart_rate > THRESHOLDS.heart_rate.high) {
        await createAlert(userId, `Elevated heart rate detected: ${healthData.heart_rate} BPM`, "health", "high")
      }
    }

    // Check blood pressure
    if (healthData.bp) {
      const [systolic, diastolic] = healthData.bp.split("/").map(Number)

      if (systolic > THRESHOLDS.blood_pressure.systolic.high || diastolic > THRESHOLDS.blood_pressure.diastolic.high) {
        await createAlert(userId, `Elevated blood pressure detected: ${healthData.bp} mmHg`, "health", "high")
      } else if (
        systolic < THRESHOLDS.blood_pressure.systolic.low ||
        diastolic < THRESHOLDS.blood_pressure.diastolic.low
      ) {
        await createAlert(userId, `Low blood pressure detected: ${healthData.bp} mmHg`, "health", "high")
      }
    }

    // Check glucose
    if (healthData.glucose) {
      if (healthData.glucose < THRESHOLDS.glucose.low) {
        await createAlert(userId, `Low glucose level detected: ${healthData.glucose} mg/dL`, "health", "high")
      } else if (healthData.glucose > THRESHOLDS.glucose.high) {
        await createAlert(userId, `Elevated glucose level detected: ${healthData.glucose} mg/dL`, "health", "high")
      }
    }
  } catch (error) {
    console.error("Error in health metrics check:", error)
  }
}

/**
 * Check activity patterns and create alerts if needed
 */
async function checkActivity(userId: number) {
  // Implementation would connect to your activity API
  console.log("Checking activity patterns for user", userId)
}

/**
 * Check due reminders
 */
async function checkReminders(userId: number) {
  // Implementation would connect to your reminders API
  console.log("Checking due reminders for user", userId)
}

/**
 * Check social engagement metrics
 */
async function checkSocialEngagement(userId: number) {
  // Implementation would connect to your social engagement API
  console.log("Checking social engagement for user", userId)
}

/**
 * Initialize the monitoring system when the app starts
 */
export function initializeMonitoringSystem() {
  // This function would be called during app initialization
  console.log("Initializing ElderCare monitoring system")

  // Auto-start monitoring with default user ID
  return startMonitoring(1)
}
