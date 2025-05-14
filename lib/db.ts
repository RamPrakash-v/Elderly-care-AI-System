import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

// Reminder type definition
type Reminder = {
  id: number
  user_id: number
  message: string
  time: string
  days: string // stored as JSON string
  type: string
  status: string
}

// Create a singleton db instance that can be imported across the app
let db: any = null

export async function getDbConnection() {
  if (db) {
    return db
  }

  // Open SQLite database
  db = await open({
    filename: "./elderlycare.db",
    driver: sqlite3.Database,
  })

  // Ensure tables exist
  await createTables()

  return db
}

export async function createTables() {
  const db = await getDbConnection()

  // Health records
  await db.exec(`CREATE TABLE IF NOT EXISTS health_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    heart_rate INTEGER,
    bp TEXT,
    glucose REAL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`)

  // Activity logs
  await db.exec(`CREATE TABLE IF NOT EXISTS activity_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER, 
    activity TEXT,
    status TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`)

  // Reminders
  await db.exec(`CREATE TABLE IF NOT EXISTS reminders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    message TEXT,
    time TEXT,
    days TEXT,
    type TEXT,
    status TEXT DEFAULT 'pending'
  )`)

  // Alerts
  await db.exec(`CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    message TEXT,
    type TEXT,
    priority TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'new',
    handled BOOLEAN DEFAULT 0
  )`)

  // Social interactions
  await db.exec(`CREATE TABLE IF NOT EXISTS social_interactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    type TEXT,
    participants TEXT,
    duration INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`)

  // Social events
  await db.exec(`CREATE TABLE IF NOT EXISTS social_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT,
    date TEXT,
    type TEXT,
    participants TEXT,
    status TEXT DEFAULT 'upcoming'
  )`)
}

// Health data functions
export async function recordHealthData(userId: number, heartRate: number, bp: string, glucose: number) {
  const db = await getDbConnection()
  await db.run(`INSERT INTO health_data (user_id, heart_rate, bp, glucose) VALUES (?, ?, ?, ?)`, [
    userId, heartRate, bp, glucose,
  ])
}

export async function getLatestHealthData(userId: number) {
  const db = await getDbConnection()
  return await db.get(`SELECT * FROM health_data WHERE user_id = ? ORDER BY timestamp DESC LIMIT 1`, [userId])
}

// Activity functions
export async function recordActivity(userId: number, activity: string, status: string) {
  const db = await getDbConnection()
  await db.run(`INSERT INTO activity_log (user_id, activity, status) VALUES (?, ?, ?)`, [userId, activity, status])
}

export async function getDailyActivitySummary(userId: number, date: string) {
  const db = await getDbConnection()
  return await db.all(
    `SELECT activity, COUNT(*) as count 
     FROM activity_log 
     WHERE user_id = ? AND date(timestamp) = ? 
     GROUP BY activity`,
    [userId, date],
  )
}

// Reminder functions
export async function addReminder(userId: number, message: string, time: string, days: string[], type: string) {
  const db = await getDbConnection()
  await db.run(`INSERT INTO reminders (user_id, message, time, days, type) VALUES (?, ?, ?, ?, ?)`, [
    userId, message, time, JSON.stringify(days), type,
  ])
}

export async function getDueReminders(userId: number, currentTime: string, currentDay: string) {
  const db = await getDbConnection()

  const reminders: Reminder[] = await db.all(
    `SELECT * FROM reminders WHERE user_id = ? AND time = ? AND status = 'pending'`,
    [userId, currentTime]
  )

  // Filter reminders to those scheduled for today
  return reminders.filter((reminder: Reminder) => {
    const days = JSON.parse(reminder.days)
    return days.includes(currentDay)
  })
}

// Alert functions
export async function createAlert(userId: number, message: string, type: string, priority: string) {
  const db = await getDbConnection()
  await db.run(`INSERT INTO alerts (user_id, message, type, priority) VALUES (?, ?, ?, ?)`, [
    userId, message, type, priority,
  ])
}

export async function getActiveAlerts(userId: number) {
  const db = await getDbConnection()
  return await db.all(
    `SELECT * FROM alerts WHERE user_id = ? AND handled = 0 ORDER BY 
     CASE 
       WHEN priority = 'critical' THEN 1
       WHEN priority = 'high' THEN 2
       WHEN priority = 'medium' THEN 3
       ELSE 4
     END`,
    [userId],
  )
}

// Social interaction functions
export async function recordSocialInteraction(userId: number, type: string, participants: string[], duration: number) {
  const db = await getDbConnection()
  await db.run(`INSERT INTO social_interactions (user_id, type, participants, duration) VALUES (?, ?, ?, ?)`, [
    userId, type, JSON.stringify(participants), duration,
  ])
}

export async function getWeeklySocialSummary(userId: number) {
  const db = await getDbConnection()
  return await db.all(
    `SELECT date(timestamp) as date, COUNT(*) as count 
     FROM social_interactions 
     WHERE user_id = ? AND timestamp >= date('now', '-7 days') 
     GROUP BY date(timestamp)`,
    [userId],
  )
}
