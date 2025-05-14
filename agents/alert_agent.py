from datetime import datetime
import random

class AlertAgent:
    """
    Agent responsible for managing alerts and emergency situations
    """
    
    def __init__(self):
        self.name = "Alert Agent"
        self.description = "Detects unusual behavior and triggers appropriate alerts"
        
    def evaluate_health_alert(self, health_data):
        """Evaluate health data for potential alerts"""
        alerts = []
        
        # Heart rate checks
        if 'heart_rate' in health_data:
            hr = health_data['heart_rate']
            if hr > 120:
                alerts.append({
                    'message': f'Critical heart rate detected: {hr} BPM',
                    'type': 'health',
                    'priority': 'critical'
                })
            elif hr > 100:
                alerts.append({
                    'message': f'Elevated heart rate detected: {hr} BPM',
                    'type': 'health',
                    'priority': 'high'
                })
            elif hr < 50:
                alerts.append({
                    'message': f'Low heart rate detected: {hr} BPM',
                    'type': 'health',
                    'priority': 'high'
                })
        
        # Blood pressure checks
        if 'bp' in health_data:
            try:
                systolic, diastolic = map(int, health_data['bp'].split('/'))
                
                if systolic > 180 or diastolic > 120:
                    alerts.append({
                        'message': f'Hypertensive crisis detected: {health_data["bp"]} mmHg',
                        'type': 'health',
                        'priority': 'critical'
                    })
                elif systolic > 140 or diastolic > 90:
                    alerts.append({
                        'message': f'High blood pressure detected: {health_data["bp"]} mmHg',
                        'type': 'health',
                        'priority': 'high'
                    })
            except:
                pass
        
        # Glucose checks
        if 'glucose' in health_data:
            glucose = health_data['glucose']
            if glucose > 250:
                alerts.append({
                    'message': f'Critical glucose level detected: {glucose} mg/dL',
                    'type': 'health',
                    'priority': 'critical'
                })
            elif glucose > 180:
                alerts.append({
                    'message': f'High glucose level detected: {glucose} mg/dL',
                    'type': 'health',
                    'priority': 'high'
                })
            elif glucose < 70:
                alerts.append({
                    'message': f'Low glucose level detected: {glucose} mg/dL',
                    'type': 'health',
                    'priority': 'high'
                })
        
        return alerts
    
    def evaluate_activity_alert(self, activity_data):
        """Evaluate activity data for potential alerts"""
        alerts = []
        
        # Check for extended inactivity
        if 'last_movement' in activity_data:
            last_movement = activity_data['last_movement']
            current_time = datetime.now()
            
            try:
                last_movement_time = datetime.strptime(last_movement, '%Y-%m-%d %H:%M:%S')
                time_diff = (current_time - last_movement_time).total_seconds() / 60  # minutes
                
                if time_diff > 180:  # 3 hours
                    alerts.append({
                        'message': f'No movement detected for {int(time_diff/60)} hours',
                        'type': 'activity',
                        'priority': '  hours',
                        'type': 'activity',
                        'priority': 'critical'
                    })
                elif time_diff > 120:  # 2 hours
                    alerts.append({
                        'message': f'No movement detected for {int(time_diff/60)} hours',
                        'type': 'activity',
                        'priority': 'high'
                    })
                elif time_diff > 60:  # 1 hour
                    alerts.append({
                        'message': f'No movement detected for {int(time_diff/60)} hour',
                        'type': 'activity',
                        'priority': 'medium'
                    })
            except:
                pass
        
        # Check for unusual location patterns
        if 'location' in activity_data and 'duration' in activity_data:
            location = activity_data['location']
            duration = activity_data['duration']  # in minutes
            
            if location == 'Bathroom' and duration > 30:
                alerts.append({
                    'message': f'Extended time in bathroom: {duration} minutes',
                    'type': 'safety',
                    'priority': 'high'
                })
            elif location == 'Floor' and duration > 1:
                alerts.append({
                    'message': f'Possible fall detected: {duration} minutes on floor',
                    'type': 'safety',
                    'priority': 'critical'
                })
        
        return alerts
    
    def send_emergency_alert(self, alert, contacts):
        """Send emergency alert to contacts"""
        # In a real implementation, this would send actual notifications
        # For demo purposes, we're simulating the process
        
        message = f"ALERT: {alert['message']} - Priority: {alert['priority']}"
        
        # Log the alert
        print(f"[EMERGENCY ALERT] {datetime.now()}: {message}")
        print(f"Sending to contacts: {', '.join(contacts)}")
        
        # In a real system, this would use SMS, email, or push notifications
        return {
            'status': 'sent',
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'recipients': contacts,
            'message': message
        }
    
    def respond_to_query(self, query):
        """Respond to a user query about alerts"""
        # In a real implementation, this would use NLP to understand the query
        # and provide a relevant response based on actual alert data
        
        if "emergency" in query.lower():
            return "There are no active emergency situations. The system is monitoring all vital signs and activity patterns. Emergency contacts are configured and ready to be notified if needed."
        
        elif "alert" in query.lower():
            return "There are 3 active alerts: 1) High blood pressure reading at 9:15 AM (high priority), 2) Missed medication reminder at 8:00 AM (medium priority), 3) Unusual inactivity between 2-4 PM (high priority). Would you like me to provide more details on any of these alerts?"
        
        elif "fall" in query.lower():
            return "No falls have been detected in the monitoring period. The fall detection system is active and functioning properly. The last movement was detected 15 minutes ago in the living room area."
        
        elif "contact" in query.lower():
            return "Emergency contacts are configured as follows: 1) Jane Doe (Daughter): 555-123-4567, 2) Dr. Smith: 555-987-6543. These contacts will be notified in case of critical alerts. Would you like to update these contacts?"
        
        else:
            return "The alert system is functioning properly. There are 3 active alerts that require attention, with 2 high priority alerts related to health and activity. All monitoring systems are online and continuously evaluating data for potential concerns. Is there a specific aspect of the alert system you'd like more information about?"
