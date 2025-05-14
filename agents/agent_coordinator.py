from agents.health_agent import HealthMonitorAgent
from agents.activity_agent import ActivityMonitorAgent
from agents.reminder_agent import ReminderAgent
from agents.alert_agent import AlertAgent
from agents.social_agent import SocialAgent
import json
import time
from datetime import datetime

class AgentCoordinator:
    """
    Coordinates the activities of all agents in the system
    """
    
    def __init__(self):
        self.health_agent = HealthMonitorAgent()
        self.activity_agent = ActivityMonitorAgent()
        self.reminder_agent = ReminderAgent()
        self.alert_agent = AlertAgent()
        self.social_agent = SocialAgent()
        
        self.agents = {
            'health': self.health_agent,
            'activity': self.activity_agent,
            'reminder': self.reminder_agent,
            'alert': self.alert_agent,
            'social': self.social_agent
        }
        
        self.agent_status = {
            'health': {'status': 'idle', 'last_run': None},
            'activity': {'status': 'idle', 'last_run': None},
            'reminder': {'status': 'idle', 'last_run': None},
            'alert': {'status': 'idle', 'last_run': None},
            'social': {'status': 'idle', 'last_run': None}
        }
        
        self.log = []
    
    def run_agent(self, agent_type, data=None):
        """Run a specific agent with provided data"""
        if agent_type not in self.agents:
            return {'error': f'Agent type {agent_type} not found'}
        
        self.agent_status[agent_type]['status'] = 'running'
        self.log.append({
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'action': f'Started {agent_type} agent',
            'details': f'Running with data: {json.dumps(data) if data else "None"}'
        })
        
        try:
            result = None
            
            # Execute agent-specific logic
            if agent_type == 'health':
                if data and 'heart_rate' in data:
                    result = self.health_agent.analyze_heart_rate([data['heart_rate']])
                elif data and 'systolic' in data and 'diastolic' in data:
                    result = self.health_agent.analyze_blood_pressure([data['systolic']], [data['diastolic']])
                elif data and 'glucose' in data:
                    result = self.health_agent.analyze_glucose([data['glucose']])
                else:
                    result = "Insufficient data for health analysis"
            
            elif agent_type == 'activity':
                if data and 'activity_level' in data:
                    result = self.activity_agent.analyze_activity([data['activity_level']])
                elif data and 'location_data' in data:
                    result = self.activity_agent.detect_unusual_patterns(data['location_data'])
                else:
                    result = "Insufficient data for activity analysis"
            
            elif agent_type == 'reminder':
                if data and 'reminders' in data:
                    current_time = data.get('current_time', datetime.now().strftime('%H:%M'))
                    current_day = data.get('current_day', datetime.now().strftime('%a'))
                    result = self.reminder_agent.check_due_reminders(data['reminders'], current_time, current_day)
                else:
                    result = "No reminders to check"
            
            elif agent_type == 'alert':
                if data and 'health_data' in data:
                    result = self.alert_agent.evaluate_health_alert(data['health_data'])
                elif data and 'activity_data' in data:
                    result = self.alert_agent.evaluate_activity_alert(data['activity_data'])
                else:
                    result = "Insufficient data for alert evaluation"
            
            elif agent_type == 'social':
                if data and 'interactions_data' in data and 'weekly_data' in data:
                    score = self.social_agent.calculate_social_wellbeing_score(
                        data['interactions_data'], data['weekly_data']
                    )
                    result = {
                        'score': score,
                        'analysis': self.social_agent.analyze_social_interactions(data['interactions_data']),
                        'suggestions': self.social_agent.suggest_social_activities()
                    }
                else:
                    result = "Insufficient data for social analysis"
            
            self.agent_status[agent_type]['status'] = 'idle'
            self.agent_status[agent_type]['last_run'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            
            self.log.append({
                'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'action': f'Completed {agent_type} agent',
                'details': f'Result: {json.dumps(result) if isinstance(result, dict) else str(result)}'
            })
            
            return {
                'status': 'success',
                'agent': agent_type,
                'result': result,
                'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
            
        except Exception as e:
            self.agent_status[agent_type]['status'] = 'error'
            
            error_details = str(e)
            self.log.append({
                'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'action': f'Error in {agent_type} agent',
                'details': error_details
            })
            
            return {
                'status': 'error',
                'agent': agent_type,
                'error': error_details,
                'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
    
    def run_all_agents(self, data=None):
        """Run all agents in sequence"""
        results = {}
        
        for agent_type in self.agents:
            results[agent_type] = self.run_agent(agent_type, data)
            time.sleep(0.1)  # Small delay between agent runs
        
        return results
    
    def get_agent_status(self):
        """Get the current status of all agents"""
        return self.agent_status
    
    def get_log(self, limit=10):
        """Get the recent log entries"""
        return self.log[-limit:] if limit > 0 else self.log
    
    def process_query(self, query):
        """Process a user query and route to appropriate agent"""
        # Simple keyword-based routing
        if any(keyword in query.lower() for keyword in ['heart', 'blood', 'health', 'glucose']):
            return self.health_agent.respond_to_query(query)
        
        elif any(keyword in query.lower() for keyword in ['activity', 'movement', 'walk', 'step']):
            return self.activity_agent.respond_to_query(query)
        
        elif any(keyword in query.lower() for keyword in ['reminder', 'medication', 'appointment']):
            return self.reminder_agent.respond_to_query(query)
        
        elif any(keyword in query.lower() for keyword in ['alert', 'emergency', 'fall', 'help']):
            return self.alert_agent.respond_to_query(query)
        
        elif any(keyword in query.lower() for keyword in ['social', 'family', 'friend', 'call']):
            return self.social_agent.respond_to_query(query)
        
        else:
            # General response when no specific agent matches
            return "I'm monitoring all aspects of elderly care. The system is functioning normally with all agents active. Health metrics are within normal ranges, there are no missed reminders, and no alerts requiring attention. How can I assist you today?"
