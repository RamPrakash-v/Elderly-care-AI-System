from datetime import datetime, timedelta
import random
import json

class ReminderAgent:
    """
    Agent responsible for managing reminders and schedules
    """
    
    def __init__(self):
        self.name = "Reminder Agent"
        self.description = "Manages medication schedules, appointments, and daily activities"
        
    def check_due_reminders(self, reminders, current_time=None, current_day=None):
        """Check for reminders that are due at the current time and day"""
        if current_time is None:
            current_time = datetime.now().strftime('%H:%M')
        
        if current_day is None:
            days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
            current_day = days[datetime.now().weekday()]
        
        due_reminders = []
        
        for reminder in reminders:
            # Check if reminder is due at current time and day
            reminder_time = reminder['time']
            reminder_days = reminder['days']
            
            # Time comparison - allow for 5 minute buffer
            current_dt = datetime.strptime(current_time, '%H:%M')
            reminder_dt = datetime.strptime(reminder_time, '%H:%M')
            time_diff = abs((current_dt - reminder_dt).total_seconds() / 60)
            
            if time_diff <= 5 and current_day in reminder_days and reminder['status'] == 'pending':
                due_reminders.append(reminder)
        
        return due_reminders
    
    def generate_voice_reminder(self, reminder):
        """Generate a voice reminder message"""
        # In a real implementation, this would generate actual voice output
        # For demo purposes, we're returning the text that would be spoken
        
        reminder_type = reminder['type']
        message = reminder['message']
        
        if reminder_type == 'medication':
            return f"Medication reminder: It's time to take your {message}. Please don't forget."
        
        elif reminder_type == 'appointment':
            return f"Appointment reminder: You have a {message} scheduled. Please prepare accordingly."
        
        elif reminder_type == 'health':
            return f"Health reminder: It's time for your {message}. This is important for your well-being."
        
        elif reminder_type == 'social':
            return f"Social reminder: Don't forget to {message}. Staying connected is important."
        
        else:
            return f"Reminder: {message}"
    
    def check_missed_reminders(self, reminders):
        """Check for reminders that have been missed"""
        # In a real implementation, this would check the database for missed reminders
        # For demo purposes, we're filtering the provided reminders
        
        missed_reminders = [r for r in reminders if r['status'] == 'missed']
        return missed_reminders
    
    def get_recommendations(self):
        """Generate reminder recommendations"""
        # In a real implementation, this would be based on actual reminder data
        # For demo purposes, we're returning static recommendations
        recommendations = [
            "Consider setting medication reminders 30 minutes before meals",
            "Add voice reminders for critical medications",
            "Schedule social activities during high-energy times of day",
            "Set hydration reminders every 2 hours",
            "Add reminders for light stretching exercises in the morning"
        ]
        
        return recommendations
    
    def respond_to_query(self, query):
        """Respond to a user query about reminders"""
        # In a real implementation, this would use NLP to understand the query
        # and provide a relevant response based on actual reminder data
        
        if "medication" in query.lower():
            return "There are 2 medication reminders scheduled for today: blood pressure medication at 8:00 AM (completed) and heart medication at 8:00 PM (pending). All medications have been taken as scheduled so far today."
        
        elif "appointment" in query.lower():
            return "There is one upcoming appointment: Doctor's follow-up on Wednesday at 2:30 PM. I've added this to the calendar and set a reminder for 1 hour before the appointment."
        
        elif "missed" in query.lower():
            return "There was one missed reminder yesterday: glucose measurement at 6:00 PM. I've rescheduled this for today at the same time and added an additional reminder 15 minutes before."
        
        elif "schedule" in query.lower():
            return "Today's schedule includes: medication at 8:00 AM (completed), water reminder at 10:00 AM (pending), lunch at 12:00 PM (pending), medication at 8:00 PM (pending). Would you like me to add any additional reminders to today's schedule?"
        
        else:
            return "There are 3 pending reminders for today: water reminder at 10:00 AM, lunch at 12:00 PM, and evening medication at 8:00 PM. One reminder has been completed (morning medication), and there are no missed reminders today. Is there a specific reminder you'd like more information about?"
