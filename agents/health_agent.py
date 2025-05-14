import numpy as np
from datetime import datetime
import random

class HealthMonitorAgent:
    """
    Agent responsible for monitoring and analyzing health data
    """
    
    def __init__(self):
        self.name = "Health Monitor Agent"
        self.description = "Monitors vital signs and provides health insights"
        
    def analyze_heart_rate(self, heart_rate_data):
        """Analyze heart rate data and provide insights"""
        if not heart_rate_data:
            return "No heart rate data available for analysis."
        
        avg_hr = np.mean(heart_rate_data)
        max_hr = np.max(heart_rate_data)
        min_hr = np.min(heart_rate_data)
        
        analysis = f"Heart Rate Analysis:\n"
        analysis += f"- Average: {avg_hr:.1f} BPM\n"
        analysis += f"- Maximum: {max_hr:.1f} BPM\n"
        analysis += f"- Minimum: {min_hr:.1f} BPM\n\n"
        
        if max_hr > 100:
            analysis += "⚠️ There are periods of elevated heart rate that may require attention.\n"
        if min_hr < 60:
            analysis += "⚠️ There are periods of low heart rate that may require attention.\n"
        
        if 60 <= min_hr and max_hr <= 100:
            analysis += "✅ Heart rate remains within normal range throughout the monitored period.\n"
        
        return analysis
    
    def analyze_blood_pressure(self, systolic_data, diastolic_data):
        """Analyze blood pressure data and provide insights"""
        if not systolic_data or not diastolic_data:
            return "No blood pressure data available for analysis."
        
        avg_sys = np.mean(systolic_data)
        avg_dia = np.mean(diastolic_data)
        max_sys = np.max(systolic_data)
        max_dia = np.max(diastolic_data)
        
        analysis = f"Blood Pressure Analysis:\n"
        analysis += f"- Average: {avg_sys:.1f}/{avg_dia:.1f} mmHg\n"
        analysis += f"- Maximum: {max_sys:.1f}/{max_dia:.1f} mmHg\n\n"
        
        if avg_sys > 140 or avg_dia > 90:
            analysis += "⚠️ Average blood pressure is elevated above normal range.\n"
        elif avg_sys > 120 or avg_dia > 80:
            analysis += "⚠️ Average blood pressure is slightly elevated (pre-hypertension range).\n"
        else:
            analysis += "✅ Average blood pressure is within normal range.\n"
        
        if max_sys > 140 or max_dia > 90:
            analysis += "⚠️ There are instances of high blood pressure that may require attention.\n"
        
        return analysis
    
    def analyze_glucose(self, glucose_data):
        """Analyze glucose data and provide insights"""
        if not glucose_data:
            return "No glucose data available for analysis."
        
        avg_glucose = np.mean(glucose_data)
        max_glucose = np.max(glucose_data)
        min_glucose = np.min(glucose_data)
        
        analysis = f"Glucose Analysis:\n"
        analysis += f"- Average: {avg_glucose:.1f} mg/dL\n"
        analysis += f"- Maximum: {max_glucose:.1f} mg/dL\n"
        analysis += f"- Minimum: {min_glucose:.1f} mg/dL\n\n"
        
        if max_glucose > 140:
            analysis += "⚠️ There are instances of elevated glucose levels that may require attention.\n"
        if min_glucose < 70:
            analysis += "⚠️ There are instances of low glucose levels that may require attention.\n"
        
        if 70 <= min_glucose and max_glucose <= 140:
            analysis += "✅ Glucose levels remain within normal range throughout the monitored period.\n"
        
        return analysis
    
    def get_recommendations(self):
        """Generate health recommendations based on analysis"""
        # In a real implementation, this would be based on actual health data analysis
        # For demo purposes, we're returning static recommendations
        recommendations = [
            "Continue monitoring blood pressure as it shows slight elevation",
            "Maintain current medication schedule",
            "Consider light physical activity in the morning to improve circulation",
            "Schedule next healthcare provider check-in for next week",
            "Ensure adequate hydration throughout the day"
        ]
        
        return recommendations
    
    def detect_anomalies(self, health_data):
        """Detect anomalies in health data"""
        anomalies = []
        
        # In a real implementation, this would use statistical methods or ML
        # For demo purposes, we're using simple thresholds
        if 'heart_rate' in health_data and health_data['heart_rate'] > 100:
            anomalies.append(f"Elevated heart rate: {health_data['heart_rate']} BPM")
        
        if 'bp' in health_data:
            systolic, diastolic = map(int, health_data['bp'].split('/'))
            if systolic > 140 or diastolic > 90:
                anomalies.append(f"Elevated blood pressure: {health_data['bp']} mmHg")
        
        if 'glucose' in health_data and health_data['glucose'] > 140:
            anomalies.append(f"Elevated glucose: {health_data['glucose']} mg/dL")
        
        return anomalies
    
    def respond_to_query(self, query):
        """Respond to a user query about health"""
        # In a real implementation, this would use NLP to understand the query
        # and provide a relevant response based on actual health data
        
        if "heart" in query.lower():
            return "Based on recent heart rate data, everything appears to be within normal range. The average heart rate has been 72 BPM over the past 24 hours, with a peak of 85 BPM during morning activities."
        
        elif "blood pressure" in query.lower():
            return "Blood pressure readings have been stable. The most recent reading was 125/82 mmHg, which is slightly elevated but not concerning. I recommend continuing to monitor and maintain the current medication schedule."
        
        elif "glucose" in query.lower():
            return "Glucose levels have been well-controlled. The average reading is 112 mg/dL, with a slight elevation after meals as expected. Continue monitoring before and after meals as recommended by your healthcare provider."
        
        elif "medication" in query.lower():
            return "All medications have been taken as scheduled today. The next medication reminder is for the blood pressure medication at 8:00 PM. Would you like me to provide a detailed medication schedule?"
        
        else:
            return "Based on my analysis of recent health data, all vital signs are within normal ranges. There are no immediate health concerns that require attention. Is there a specific health metric you'd like more information about?"
