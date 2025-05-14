import sqlite3
import json
import os
from datetime import datetime

# Database file path
DB_PATH = "eldercare.db"

def get_db_connection():
    """Create a connection to the SQLite database"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # This enables column access by name
    return conn

def create_tables():
    """Create all necessary tables if they don't exist"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Health records
    cursor.execute('''CREATE TABLE IF NOT EXISTS health_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        heart_rate INTEGER,
        bp TEXT,
        glucose REAL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )''')

    # Activity logs
    cursor.execute('''CREATE TABLE IF NOT EXISTS activity_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER, 
        activity TEXT,
        status TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )''')

    # Reminders
    cursor.execute('''CREATE TABLE IF NOT EXISTS reminders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        message TEXT,
        time TEXT,
        days TEXT,
        type TEXT,
        status TEXT DEFAULT 'pending'
    )''')

    # Alerts
    cursor.execute('''CREATE TABLE IF NOT EXISTS alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        message TEXT,
        type TEXT,
        priority TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'new',
        handled BOOLEAN DEFAULT 0
    )''')

    # Social interactions
    cursor.execute('''CREATE TABLE IF NOT EXISTS social_interactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        type TEXT,
        participants TEXT,
        duration INTEGER,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )''')

    # Social events
    cursor.execute('''CREATE TABLE IF NOT EXISTS social_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        title TEXT,
        date TEXT,
        type TEXT,
        participants TEXT,
        status TEXT DEFAULT 'upcoming'
    )''')

    conn.commit()
    conn.close()

# Health data functions
def record_health_data(user_id, heart_rate, bp, glucose):
    """Record new health data"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute(
        "INSERT INTO health_data (user_id, heart_rate, bp, glucose) VALUES (?, ?, ?, ?)",
        (user_id, heart_rate, bp, glucose)
    )
    
    conn.commit()
    conn.close()

def get_latest_health_data(user_id):
    """Get the latest health data for a user"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute(
        "SELECT * FROM health_data WHERE user_id = ? ORDER BY timestamp DESC LIMIT 1",
        (user_id,)
    )
    
    result = cursor.fetchone()
    conn.close()
    
    return dict(result) if result else None

def get_health_data_range(user_id, start_date, end_date):
    """Get health data for a user within a date range"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute(
        """SELECT * FROM health_data 
           WHERE user_id = ? AND timestamp BETWEEN ? AND ?
           ORDER BY timestamp""",
        (user_id, start_date, end_date)
    )
    
    results = cursor.fetchall()
    conn.close()
    
    return [dict(row) for row in results]

# Activity functions
def record_activity(user_id, activity, status):
    """Record new activity data"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute(
        "INSERT INTO activity_log (user_id, activity, status) VALUES (?, ?, ?)",
        (user_id, activity, status)
    )
    
    conn.commit()
    conn.close()

def get_daily_activity_summary(user_id, date):
    """Get activity summary for a specific date"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute(
        """SELECT activity, COUNT(*) as count 
           FROM activity_log 
           WHERE user_id = ? AND date(timestamp) = ? 
           GROUP BY activity""",
        (user_id, date)
    )
    
    results = cursor.fetchall()
    conn.close()
    
    return [dict(row) for row in results]

def get_activity_data_range(user_id, start_date, end_date):
    """Get activity data for a user within a date range"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute(
        """SELECT * FROM activity_log 
           WHERE user_id = ? AND timestamp BETWEEN ? AND ?
           ORDER BY timestamp""",
        (user_id, start_date, end_date)
    )
    
    results = cursor.fetchall()
    conn.close()
    
    return [dict(row) for row in results]

# Reminder functions
def add_reminder(user_id, message, time, days, reminder_type):
    """Add a new reminder"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Convert days list to JSON string
    days_json = json.dumps(days)
    
    cursor.execute(
        """INSERT INTO reminders (user_id, message, time, days, type) 
           VALUES (?, ?, ?, ?, ?)""",
        (user_id, message, time, days_json, reminder_type)
    )
    
    conn.commit()
    conn.close()

def get_due_reminders(user_id, current_time, current_day):
    """Get reminders due at the current time and day"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute(
        """SELECT * FROM reminders 
           WHERE user_id = ? AND time = ? AND status = 'pending'""",
        (user_id, current_time)
    )
    
    results = cursor.fetchall()
    conn.close()
    
    # Filter reminders to those scheduled for today
    filtered_reminders = []
    for reminder in results:
        days = json.loads(reminder['days'])
        if current_day in days:
            filtered_reminders.append(dict(reminder))
    
    return filtered_reminders

def update_reminder_status(reminder_id, status):
    """Update the status of a reminder"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute(
        "UPDATE reminders SET status = ? WHERE id = ?",
        (status, reminder_id)
    )
    
    conn.commit()
    conn.close()

def delete_reminder(reminder_id):
    """Delete a reminder"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("DELETE FROM reminders WHERE id = ?", (reminder_id,))
    
    conn.commit()
    conn.close()

# Alert functions
def create_alert(user_id, message, alert_type, priority):
    """Create a new alert"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute(
        """INSERT INTO alerts (user_id, message, type, priority) 
           VALUES (?, ?, ?, ?)""",
        (user_id, message, alert_type, priority)
    )
    
    conn.commit()
    conn.close()

def get_active_alerts(user_id):
    """Get active (unhandled) alerts for a user"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute(
        """SELECT * FROM alerts 
           WHERE user_id = ? AND handled = 0 
           ORDER BY 
           CASE 
             WHEN priority = 'critical' THEN 1
             WHEN priority = 'high' THEN 2
             WHEN priority = 'medium' THEN 3
             ELSE 4
           END""",
        (user_id,)
    )
    
    results = cursor.fetchall()
    conn.close()
    
    return [dict(row) for row in results]

def resolve_alert(alert_id):
    """Mark an alert as handled/resolved"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute(
        "UPDATE alerts SET handled = 1, status = 'handled' WHERE id = ?",
        (alert_id,)
    )
    
    conn.commit()
    conn.close()

# Social interaction functions
def record_social_interaction(user_id, interaction_type, participants, duration):
    """Record a new social interaction"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Convert participants list to JSON string
    participants_json = json.dumps(participants)
    
    cursor.execute(
        """INSERT INTO social_interactions (user_id, type, participants, duration) 
           VALUES (?, ?, ?, ?)""",
        (user_id, interaction_type, participants_json, duration)
    )
    
    conn.commit()
    conn.close()

def get_weekly_social_summary(user_id):
    """Get social interaction summary for the past week"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute(
        """SELECT date(timestamp) as date, COUNT(*) as count 
           FROM social_interactions 
           WHERE user_id = ? AND timestamp >= date('now', '-7 days') 
           GROUP BY date(timestamp)""",
        (user_id,)
    )
    
    results = cursor.fetchall()
    conn.close()
    
    return [dict(row) for row in results]

def add_social_event(user_id, title, date, event_type, participants):
    """Add a new social event"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Convert participants list to JSON string
    participants_json = json.dumps(participants)
    
    cursor.execute(
        """INSERT INTO social_events (user_id, title, date, type, participants) 
           VALUES (?, ?, ?, ?, ?)""",
        (user_id, title, date, event_type, participants_json)
    )
    
    conn.commit()
    conn.close()

def get_upcoming_social_events(user_id):
    """Get upcoming social events for a user"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute(
        """SELECT * FROM social_events 
           WHERE user_id = ? AND status = 'upcoming' AND date >= date('now')
           ORDER BY date""",
        (user_id,)
    )
    
    results = cursor.fetchall()
    conn.close()
    
    # Parse JSON strings back to lists
    events = []
    for event in results:
        event_dict = dict(event)
        event_dict['participants'] = json.loads(event_dict['participants'])
        events.append(event_dict)
    
    return events
