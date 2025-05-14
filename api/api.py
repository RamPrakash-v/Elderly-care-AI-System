from flask import Flask, request, jsonify
from database.db_manager import (
    record_health_data, get_latest_health_data, get_health_data_range,
    record_activity, get_daily_activity_summary, get_activity_data_range,
    add_reminder, get_due_reminders, update_reminder_status, delete_reminder,
    create_alert, get_active_alerts, resolve_alert,
    record_social_interaction, get_weekly_social_summary, add_social_event, get_upcoming_social_events,
    create_tables
)
from agents.agent_coordinator import AgentCoordinator
from datetime import datetime
import json

# Initialize Flask app
app = Flask(__name__)

# Initialize agent coordinator
agent_coordinator = AgentCoordinator()

# Ensure database tables exist
create_tables()

# Health endpoints
@app.route('/api/health', methods=['GET'])
def get_health():
    user_id = request.args.get('user_id', 1, type=int)
    
    if 'start_date' in request.args and 'end_date' in request.args:
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        health_data = get_health_data_range(user_id, start_date, end_date)
        return jsonify(health_data)
    else:
        health_data = get_latest_health_data(user_id)
        return jsonify(health_data if health_data else {'error': 'No health data found'})

@app.route('/api/health', methods=['POST'])
def post_health():
    data = request.json
    
    if not data or 'user_id' not in data or 'heart_rate' not in data or 'bp' not in data or 'glucose' not in data:
        return jsonify({'error': 'Missing required fields'}), 400
    
    try:
        record_health_data(data['user_id'], data['heart_rate'], data['bp'], data['glucose'])
        
        # Run health agent to analyze the data
        agent_result = agent_coordinator.run_agent('health', {
            'heart_rate': data['heart_rate'],
            'systolic': int(data['bp'].split('/')[0]),
            'diastolic': int(data['bp'].split('/')[1]),
            'glucose': data['glucose']
        })
        
        # Check for potential health alerts
        alert_result = agent_coordinator.run_agent('alert', {
            'health_data': data
        })
        
        return jsonify({
            'success': True,
            'analysis': agent_result.get('result', ''),
            'alerts': alert_result.get('result', [])
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Activity endpoints
@app.route('/api/activity', methods=['GET'])
def get_activity():
    user_id = request.args.get('user_id', 1, type=int)
    
    if 'date' in request.args:
        date = request.args.get('date')
        activity_data = get_daily_activity_summary(user_id, date)
        return jsonify(activity_data)
    elif 'start_date' in request.args and 'end_date' in request.args:
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        activity_data = get_activity_data_range(user_id, start_date, end_date)
        return jsonify(activity_data)
    else:
        today = datetime.now().strftime('%Y-%m-%d')
        activity_data = get_daily_activity_summary(user_id, today)
        return jsonify(activity_data)

@app.route('/api/activity', methods=['POST'])
def post_activity():
    data = request.json
    
    if not data or 'user_id' not in data or 'activity' not in data:
        return jsonify({'error': 'Missing required fields'}), 400
    
    try:
        status = data.get('status', 'active')
        record_activity(data['user_id'], data['activity'], status)
        
        # Run activity agent to analyze the data
        agent_result = agent_coordinator.run_agent('activity', {
            'activity_level': data.get('activity_level', 50),
            'location_data': data.get('location_data', [])
        })
        
        # Check for potential activity alerts
        alert_result = agent_coordinator.run_agent('alert', {
            'activity_data': data
        })
        
        return jsonify({
            'success': True,
            'analysis': agent_result.get('result', ''),
            'alerts': alert_result.get('result', [])
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Reminder endpoints
@app.route('/api/reminders', methods=['GET'])
def get_reminders():
    user_id = request.args.get('user_id', 1, type=int)
    
    if 'time' in request.args:
        time = request.args.get('time')
        day = request.args.get('day', datetime.now().strftime('%a'))
        reminders = get_due_reminders(user_id, time, day)
        return jsonify(reminders)
    else:
        # In a real app, you would have an endpoint to get all reminders
        return jsonify({'error': 'Time parameter required'}), 400

@app.route('/api/reminders', methods=['POST'])
def post_reminder():
    data = request.json
    
    if not data or 'user_id' not in data or 'message' not in data or 'time' not in data or 'days' not in data or 'type' not in data:
        return jsonify({'error': 'Missing required fields'}), 400
    
    try:
        add_reminder(data['user_id'], data['message'], data['time'], data['days'], data['type'])
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/reminders/<int:reminder_id>', methods=['PUT'])
def update_reminder(reminder_id):
    data = request.json
    
    if not data or 'status' not in data:
        return jsonify({'error': 'Missing status field'}), 400
    
    try:
        update_reminder_status(reminder_id, data['status'])
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/reminders/<int:reminder_id>', methods=['DELETE'])
def remove_reminder(reminder_id):
    try:
        delete_reminder(reminder_id)
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Alert endpoints
@app.route('/api/alerts', methods=['GET'])
def get_alerts():
    user_id = request.args.get('user_id', 1, type=int)
    
    try:
        alerts = get_active_alerts(user_id)
        return jsonify(alerts)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/alerts', methods=['POST'])
def post_alert():
    data = request.json
    
    if not data or 'user_id' not in data or 'message' not in data or 'type' not in data or 'priority' not in data:
        return jsonify({'error': 'Missing required fields'}), 400
    
    try:
        create_alert(data['user_id'], data['message'], data['type'], data['priority'])
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/alerts/<int:alert_id>/resolve', methods=['PUT'])
def resolve_alert_endpoint(alert_id):
    try:
        resolve_alert(alert_id)
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Social endpoints
@app.route('/api/social/interactions', methods=['GET'])
def get_social():
    user_id = request.args.get('user_id', 1, type=int)
    
    try:
        social_summary = get_weekly_social_summary(user_id)
        return jsonify(social_summary)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/social/interactions', methods=['POST'])
def post_social():
    data = request.json
    
    if not data or 'user_id' not in data or 'type' not in data or 'participants' not in data or 'duration' not in data:
        return jsonify({'error': 'Missing required fields'}), 400
    
    try:
        record_social_interaction(data['user_id'], data['type'], data['participants'], data['duration'])
        
        # Run social agent to analyze the data
        # This would require more data in a real implementation
        agent_result = agent_coordinator.run_agent('social', {
            'interactions_data': [{'type': data['type'], 'value': 1}],
            'weekly_data': [{'day': 'Mon', 'interactions': 1}]
        })
        
        return jsonify({
            'success': True,
            'analysis': agent_result.get('result', {}).get('analysis', '')
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/social/events', methods=['GET'])
def get_events():
    user_id = request.args.get('user_id', 1, type=int)
    
    try:
        events = get_upcoming_social_events(user_id)
        return jsonify(events)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/social/events', methods=['POST'])
def post_event():
    data = request.json
    
    if not data or 'user_id' not in data or 'title' not in data or 'date' not in data or 'type' not in data or 'participants' not in data:
        return jsonify({'error': 'Missing required fields'}), 400
    
    try:
        add_social_event(data['user_id'], data['title'], data['date'], data['type'], data['participants'])
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Agent endpoints
@app.route('/api/agents/status', methods=['GET'])
def get_agent_status():
    return jsonify(agent_coordinator.get_agent_status())

@app.route('/api/agents/run', methods=['POST'])
def run_agent():
    data = request.json
    
    if not data or 'agent_type' not in data:
        return jsonify({'error': 'Missing agent_type field'}), 400
    
    agent_type = data['agent_type']
    agent_data = data.get('data', {})
    
    result = agent_coordinator.run_agent(agent_type, agent_data)
    return jsonify(result)

@app.route('/api/agents/query', methods=['POST'])
def query_agent():
    data = request.json
    
    if not data or 'query' not in data:
        return jsonify({'error': 'Missing query field'}), 400
    
    response = agent_coordinator.process_query(data['query'])
    return jsonify({'response': response})

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True, port=5000)
