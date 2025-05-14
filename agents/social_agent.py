import random
from datetime import datetime, timedelta

class SocialAgent:
    """
    Agent responsible for monitoring and encouraging social engagement
    """
    
    def __init__(self):
        self.name = "Social Agent"
        self.description = "Monitors social interactions and encourages engagement"
        
    def analyze_social_interactions(self, interactions_data):
        """Analyze social interaction data and provide insights"""
        if not interactions_data:
            return "No social interaction data available for analysis."
        
        total_interactions = sum(interaction['value'] for interaction in interactions_data)
        interaction_types = {interaction['type']: interaction['value'] for interaction in interactions_data}
        
        analysis = f"Social Interaction Analysis:\n"
        analysis += f"- Total interactions: {total_interactions}\n"
        
        for interaction_type, count in interaction_types.items():
            percentage = (count / total_interactions) * 100
            analysis += f"- {interaction_type}: {count} ({percentage:.1f}%)\n"
        
        analysis += "\n"
        
        # Evaluate social health
        if total_interactions < 5:
            analysis += "⚠️ Social interaction level is low. Consider encouraging more social activities.\n"
        elif total_interactions < 10:
            analysis += "ℹ️ Social interaction level is moderate. Maintaining this level is beneficial for mental health.\n"
        else:
            analysis += "✅ Social interaction level is good. This level of social engagement is excellent for mental health.\n"
        
        # Evaluate balance of interaction types
        in_person = interaction_types.get('In-Person', 0)
        if in_person == 0:
            analysis += "⚠️ No in-person interactions recorded. Consider encouraging face-to-face social activities.\n"
        
        return analysis
    
    def calculate_social_wellbeing_score(self, interactions_data, weekly_data):
        """Calculate a social wellbeing score based on interaction data"""
        # In a real implementation, this would use more sophisticated scoring
        # For demo purposes, we're using a simple weighted calculation
        
        if not interactions_data or not weekly_data:
            return 50  # Default score
        
        # Calculate based on total interactions
        total_interactions = sum(interaction['value'] for interaction in interactions_data)
        interaction_score = min(100, total_interactions * 5)  # 5 points per interaction, max 100
        
        # Calculate based on variety of interaction types
        variety_score = min(100, len(interactions_data) * 25)  # 25 points per type, max 100
        
        # Calculate based on consistency across the week
        weekly_interactions = [day['interactions'] for day in weekly_data]
        consistency_score = 100 - (max(weekly_interactions) - min(weekly_interactions)) * 10
        consistency_score = max(0, min(100, consistency_score))
        
        # Calculate final score (weighted average)
        final_score = (interaction_score * 0.4) + (variety_score * 0.3) + (consistency_score * 0.3)
        
        return round(final_score)
    
    def suggest_social_activities(self, user_preferences=None):
        """Suggest social activities based on user preferences"""
        # In a real implementation, this would consider user preferences and history
        # For demo purposes, we're returning generic suggestions
        
        suggestions = [
            {
                'activity': 'Family video call',
                'description': 'Schedule a video call with family members to catch up',
                'benefits': 'Maintains family connections and provides emotional support'
            },
            {
                'activity': 'Community center visit',
                'description': 'Visit the local senior community center for group activities',
                'benefits': 'Provides in-person social interaction and structured activities'
            },
            {
                'activity': 'Neighbor coffee chat',
                'description': 'Invite a neighbor over for coffee and conversation',
                'benefits': 'Builds local support network and provides regular social contact'
            },
            {
                'activity': 'Online book club',
                'description': 'Join an online book club for seniors',
                'benefits': 'Intellectual stimulation combined with social interaction'
            },
            {
                'activity': 'Volunteer opportunity',
                'description': 'Volunteer at the local library or community garden',
                'benefits': 'Provides purpose and regular social interaction'
            }
        ]
        
        return suggestions
    
    def get_recommendations(self):
        """Generate social engagement recommendations"""
        # In a real implementation, this would be based on actual social data
        # For demo purposes, we're returning static recommendations
        recommendations = [
            "Friday and Saturday show the highest interaction levels - schedule important conversations during these days",
            "Video calls have shown positive impacts on mood - consider increasing video interactions with family members",
            "Local senior center has weekly activities - consider attending the gardening workshop on Thursdays",
            "Morning social activities align well with energy levels - schedule social events before noon when possible",
            "Consider joining the online community group for seniors with similar interests"
        ]
        
        return recommendations
    
    def respond_to_query(self, query):
        """Respond to a user query about social engagement"""
        # In a real implementation, this would use NLP to understand the query
        # and provide a relevant response based on actual social data
        
        if "family" in query.lower():
            return "There have been 5 family interactions this week: 3 phone calls and 2 video chats. The next scheduled family event is a dinner tomorrow at 6:00 PM with your daughter, son-in-law, and grandchildren."
        
        elif "friend" in query.lower():
            return "There have been 2 interactions with friends this week. The weekly card game with neighbors is scheduled for Saturday at 3:00 PM. Would you like me to suggest additional social activities with friends?"
        
        elif "community" in query.lower():
            return "The local senior community center has several upcoming events: a gardening workshop on Thursday at 10:00 AM, a book club meeting on Friday at 2:00 PM, and a movie night on Saturday at 6:00 PM. Would you like me to add any of these to your calendar?"
        
        elif "lonely" in query.lower() or "alone" in query.lower():
            return "I notice that social interactions have been lower than usual this week. Would you like me to suggest some social activities or schedule a call with a family member? Regular social interaction is important for emotional well-being."
        
        else:
            return "Your social engagement has been good overall, with 20 total interactions this week across different types (calls, video chats, in-person visits). Your social well-being score is 75%, which is in the 'Good' range. The most frequent social contact has been with your daughter Jane (5 interactions). Is there a specific aspect of social engagement you'd like more information about?"
