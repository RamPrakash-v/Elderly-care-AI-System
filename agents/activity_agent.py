import numpy as np
from datetime import datetime, timedelta
import random

class ActivityMonitorAgent:
    """
    Agent responsible for monitoring and analyzing activity data
    """
    
    def __init__(self):
        self.name = "Activity Monitor Agent"
        self.description = "Monitors movement patterns and activity levels"
        
    def analyze_activity(self, activity_data):
        """Analyze activity level data and provide insights"""
        if not activity_data:
            return "No activity data available for analysis."
        
        avg_activity = np.mean(activity_data)
        max_activity = np.max(activity_data)
        min_activity = np.min(activity_data)
        
        analysis = f"Activity Analysis:\n"
        analysis += f"- Average daily activity level: {avg_activity:.1f}%\n"
        analysis += f"- Highest activity day: {max_activity:.1f}%\n"
        analysis += f"- Lowest activity day: {min_activity:.1f}%\n\n"
        
        if avg_activity < 30:
            analysis += "⚠️ Overall activity level is low. Consider encouraging more movement throughout the day.\n"
        elif avg_activity < 50:
            analysis += "⚠️ Activity level is moderate but could be improved. Consider adding light exercise to daily routine.\n"
        else:
            analysis += "✅ Activity level is good. Maintaining this level of activity is beneficial for overall health.\n"
        
        if max(activity_data) - min(activity_data) > 40:
            analysis += "⚠️ There is significant variation in activity levels across days. A more consistent routine may be beneficial.\n"
        
        return analysis
    
    def detect_unusual_patterns(self, location_data):
        """Detect unusual patterns in location data"""
        # In a real implementation, this would use more sophisticated pattern recognition
        # For demo purposes, we're using simple rules
        
        unusual_patterns = []
        
        # Check for extended time in bathroom
        bathroom_visits = [entry for entry in location_data if entry['location'] == 'Bathroom']
        for i in range(len(bathroom_visits) - 1):
            current = bathroom_visits[i]
            next_visit = bathroom_visits[i + 1]
            
            # Convert time strings to datetime for comparison
            current_time = datetime.strptime(current['time'], '%H:%M')
            next_time = datetime.strptime(next_visit['time'], '%H:%M')
            
            # If next bathroom visit is within 30 minutes, might indicate an issue
            if (next_time - current_time).total_seconds() / 60 < 30:
                unusual_patterns.append(f"Frequent bathroom visits detected around {current['time']}")
        
        # Check for extended inactivity (no location change for long period)
        for i in range(len(location_data) - 1):
            current = location_data[i]
            next_loc = location_data[i + 1]
            
            current_time = datetime.strptime(current['time'], '%H:%M')
            next_time = datetime.strptime(next_loc['time'], '%H:%M')
            
            # If more than 3 hours between location changes, might indicate inactivity
            if (next_time - current_time).total_seconds() / 3600 > 3:
                unusual_patterns.append(f"Extended period with no movement detected between {current['time']} and {next_loc['time']}")
        
        return unusual_patterns
    
    def get_recommendations(self):
        """Generate activity recommendations based on analysis"""
        # In a real implementation, this would be based on actual activity data analysis
        # For demo purposes, we're returning static recommendations
        recommendations = [
            "Encourage more light activity on weekends",
            "Current routine shows good balance between rest and activity",
            "Consider adding a short morning walk to the daily routine",
            "Bathroom visits are well-spaced, indicating good hydration",
            "Activity level peaks in the afternoon - this is a good time for social engagements"
        ]
        
        return recommendations
    
    def respond_to_query(self, query):
        """Respond to a user query about activity"""
        # In a real implementation, this would use NLP to understand the query
        # and provide a relevant response based on actual activity data
        
        if "step" in query.lower():
            return "The average daily step count has been approximately 3,200 steps. This is a good level of activity for the user's age and condition. The highest step count was recorded on Friday with 4,500 steps."
        
        elif "walk" in query.lower():
            return "Walking activity has been consistent. There's a regular morning walk pattern between 8:30 AM and 9:15 AM, and occasional afternoon walks. The pace and duration are appropriate for the user's mobility level."
        
        elif "inactive" in query.lower() or "inactivity" in query.lower():
            return "There have been no concerning periods of inactivity. The longest period without significant movement was 2 hours during afternoon rest time, which is normal for the user's routine."
        
        elif "bathroom" in query.lower():
            return "Bathroom visits have been regular and well-spaced throughout the day, indicating good hydration and normal function. There are no unusual patterns that would suggest concerns."
        
        elif "sleep" in query.lower():
            return "Sleep patterns have been stable. The user typically goes to bed around 9:30 PM and wakes up around 6:30 AM. There was minimal movement detected during sleep hours, suggesting good sleep quality."
        
        else:
            return "Activity levels have been good overall. The user maintains a healthy balance of rest and movement throughout the day. There are no unusual patterns or concerns in the recent activity data. Is there a specific aspect of activity you'd like more information about?"
