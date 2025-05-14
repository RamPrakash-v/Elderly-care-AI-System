import streamlit as st
from datetime import datetime, timedelta
import sqlite3
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from agents.health_agent import HealthMonitorAgent
from agents.activity_agent import ActivityMonitorAgent
from agents.reminder_agent import ReminderAgent
from agents.alert_agent import AlertAgent
from agents.social_agent import SocialAgent
from database.db_manager import create_tables, get_db_connection

# Initialize the database
create_tables()

# Page configuration
st.set_page_config(
    page_title="ElderCare AI Dashboard",
    page_icon="❤️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Sidebar for navigation
st.sidebar.title("ElderCare AI")
st.sidebar.image("assets/pic.png", width=100)

# User selection (in a real app, this would be a login system)
user_id = st.sidebar.selectbox("Select User", [1], format_func=lambda x: f"User {x}")

# Navigation
page = st.sidebar.radio(
    "Navigation",
    ["Dashboard", "Health Monitoring", "Activity Tracking", 
     "Reminders", "Alerts", "Social Engagement", "Agent Chat"]
)

# Initialize agents
health_agent = HealthMonitorAgent()
activity_agent = ActivityMonitorAgent()
reminder_agent = ReminderAgent()
alert_agent = AlertAgent()
social_agent = SocialAgent()

# Helper function to get mock data
def get_mock_health_data():
    # In a real app, this would come from the database
    dates = pd.date_range(end=datetime.now(), periods=24, freq='H')
    heart_rate = np.random.normal(75, 5, 24)
    systolic = np.random.normal(120, 10, 24)
    diastolic = np.random.normal(80, 5, 24)
    glucose = np.random.normal(110, 15, 24)
    
    df = pd.DataFrame({
        'timestamp': dates,
        'heart_rate': heart_rate,
        'systolic': systolic,
        'diastolic': diastolic,
        'glucose': glucose
    })
    return df

def get_mock_activity_data():
    # In a real app, this would come from the database
    dates = pd.date_range(end=datetime.now(), periods=7, freq='D')
    activity_level = np.random.normal(70, 15, 7)
    steps = np.random.normal(3000, 1000, 7)
    
    df = pd.DataFrame({
        'date': dates,
        'activity_level': activity_level,
        'steps': steps
    })
    return df

def get_mock_location_data():
    # In a real app, this would come from the database
    times = [
        "08:00", "08:30", "09:15", "10:30", "12:00", 
        "13:30", "15:45", "17:00", "18:30", "21:00", "21:30"
    ]
    locations = [
        "Bedroom", "Bathroom", "Kitchen", "Living Room", "Kitchen",
        "Living Room", "Bedroom", "Kitchen", "Living Room", "Bathroom", "Bedroom"
    ]
    
    return pd.DataFrame({'time': times, 'location': locations})

def get_mock_reminders():
    # In a real app, this would come from the database
    return [
        {"id": 1, "message": "Take blood pressure medication", "time": "08:00", 
         "days": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], "type": "medication", "status": "completed"},
        {"id": 2, "message": "Drink water", "time": "10:00", 
         "days": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], "type": "health", "status": "pending"},
        {"id": 3, "message": "Doctor's appointment", "time": "14:30", 
         "days": ["Wed"], "type": "appointment", "status": "pending"},
        {"id": 4, "message": "Take glucose measurement", "time": "18:00", 
         "days": ["Mon", "Thu"], "type": "health", "status": "missed"},
        {"id": 5, "message": "Call daughter", "time": "19:00", 
         "days": ["Tue", "Sun"], "type": "social", "status": "pending"},
    ]

def get_mock_alerts():
    # In a real app, this would come from the database
    return [
        {"id": 1, "message": "Blood pressure reading high at 9:15 AM", "type": "health", 
         "priority": "high", "time": "9:15 AM", "status": "new", "handled": False},
        {"id": 2, "message": "Medication reminder missed at 8:00 AM", "type": "medication", 
         "priority": "medium", "time": "8:00 AM", "status": "new", "handled": False},
        {"id": 3, "message": "Unusual inactivity detected between 2-4 PM", "type": "activity", 
         "priority": "high", "time": "4:00 PM", "status": "new", "handled": False},
        {"id": 4, "message": "Heart rate elevated during morning walk", "type": "health", 
         "priority": "low", "time": "7:30 AM", "status": "handled", "handled": True},
        {"id": 5, "message": "No movement detected in bathroom for over 30 minutes", "type": "safety", 
         "priority": "critical", "time": "10:45 AM", "status": "handled", "handled": True},
    ]

def get_mock_social_data():
    # In a real app, this would come from the database
    interaction_types = ["Family Calls", "Video Chats", "Messages", "In-Person"]
    values = [5, 2, 12, 1]
    
    df_interactions = pd.DataFrame({
        'type': interaction_types,
        'value': values
    })
    
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    interactions = [2, 4, 1, 3, 5, 6, 2]
    
    df_weekly = pd.DataFrame({
        'day': days,
        'interactions': interactions
    })
    
    return df_interactions, df_weekly

# Dashboard page
if page == "Dashboard":
    st.title("ElderCare AI Dashboard")
    st.markdown("Multi-agent AI system for monitoring, reminders, and safety alerts for elderly care")
    
    # Quick stats in columns
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric(label="Health Status", value="Normal", delta="stable")
        
    with col2:
        st.metric(label="Activity Level", value="Moderate", delta="↑ 10%")
        
    with col3:
        st.metric(label="Reminders", value="2 Pending", delta=None)
        
    with col4:
        st.metric(label="Alerts", value="3 New", delta="2 high priority", delta_color="inverse")
    
    # Main dashboard content
    st.subheader("System Overview")
    
    # Two columns for charts
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("### Health Trends")
        health_data = get_mock_health_data()
        fig = px.line(health_data, x='timestamp', y='heart_rate', title='Heart Rate (Last 24 Hours)')
        st.plotly_chart(fig, use_container_width=True)
        
    with col2:
        st.markdown("### Activity Levels")
        activity_data = get_mock_activity_data()
        fig = px.bar(activity_data, x='date', y='activity_level', title='Daily Activity Level (%)')
        st.plotly_chart(fig, use_container_width=True)
    
    # Agent status
    st.subheader("Agent Status")
    agent_col1, agent_col2, agent_col3, agent_col4, agent_col5 = st.columns(5)
    
    with agent_col1:
        st.info("Health Monitor: Active")
    with agent_col2:
        st.info("Activity Monitor: Active")
    with agent_col3:
        st.info("Reminder Agent: Active")
    with agent_col4:
        st.info("Alert Agent: Active")
    with agent_col5:
        st.info("Social Agent: Active")
    
    # Recent alerts
    st.subheader("Recent Alerts")
    alerts = get_mock_alerts()
    active_alerts = [alert for alert in alerts if not alert["handled"]]
    
    if active_alerts:
        for alert in active_alerts:
            if alert["priority"] == "critical":
                st.error(f"**{alert['type'].upper()}**: {alert['message']} ({alert['time']})")
            elif alert["priority"] == "high":
                st.warning(f"**{alert['type'].upper()}**: {alert['message']} ({alert['time']})")
            else:
                st.info(f"**{alert['type'].upper()}**: {alert['message']} ({alert['time']})")
    else:
        st.success("No active alerts at this time.")

# Health Monitoring page
elif page == "Health Monitoring":
    st.title("Health Monitoring")
    
    # Tabs for different health metrics
    tab1, tab2, tab3 = st.tabs(["Heart Rate", "Blood Pressure", "Glucose"])
    
    health_data = get_mock_health_data()
    
    with tab1:
        st.subheader("Heart Rate Monitoring")
        fig = px.line(health_data, x='timestamp', y='heart_rate', 
                     title='Heart Rate Trends',
                     labels={'heart_rate': 'BPM', 'timestamp': 'Time'})
        fig.add_hline(y=60, line_dash="dash", line_color="red", annotation_text="Lower Limit")
        fig.add_hline(y=100, line_dash="dash", line_color="red", annotation_text="Upper Limit")
        st.plotly_chart(fig, use_container_width=True)
        
        # Analysis from health agent
        st.subheader("AI Analysis")
        analysis = health_agent.analyze_heart_rate(health_data['heart_rate'].tolist())
        st.write(analysis)
    
    with tab2:
        st.subheader("Blood Pressure Monitoring")
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=health_data['timestamp'], y=health_data['systolic'],
                                mode='lines+markers', name='Systolic'))
        fig.add_trace(go.Scatter(x=health_data['timestamp'], y=health_data['diastolic'],
                                mode='lines+markers', name='Diastolic'))
        fig.update_layout(title='Blood Pressure Trends',
                         xaxis_title='Time',
                         yaxis_title='mmHg')
        fig.add_hline(y=140, line_dash="dash", line_color="red", annotation_text="Systolic Upper Limit")
        fig.add_hline(y=90, line_dash="dash", line_color="red", annotation_text="Diastolic Upper Limit")
        st.plotly_chart(fig, use_container_width=True)
        
        # Analysis from health agent
        st.subheader("AI Analysis")
        analysis = health_agent.analyze_blood_pressure(
            health_data['systolic'].tolist(), 
            health_data['diastolic'].tolist()
        )
        st.write(analysis)
    
    with tab3:
        st.subheader("Glucose Monitoring")
        # Filter for fewer glucose readings (typically measured less frequently)
        glucose_data = health_data[::4].copy()  # Every 4th reading
        fig = px.line(glucose_data, x='timestamp', y='glucose', 
                     title='Glucose Trends',
                     labels={'glucose': 'mg/dL', 'timestamp': 'Time'})
        fig.add_hline(y=70, line_dash="dash", line_color="red", annotation_text="Lower Limit")
        fig.add_hline(y=140, line_dash="dash", line_color="red", annotation_text="Upper Limit")
        st.plotly_chart(fig, use_container_width=True)
        
        # Analysis from health agent
        st.subheader("AI Analysis")
        analysis = health_agent.analyze_glucose(glucose_data['glucose'].tolist())
        st.write(analysis)
    
    # Recommendations
    st.subheader("AI Recommendations")
    recommendations = health_agent.get_recommendations()
    for rec in recommendations:
        st.markdown(f"- {rec}")

# Activity Tracking page
elif page == "Activity Tracking":
    st.title("Activity Monitoring")
    
    # Activity data
    activity_data = get_mock_activity_data()
    location_data = get_mock_location_data()
    
    # Activity overview
    st.subheader("Activity Overview")
    col1, col2 = st.columns(2)
    
    with col1:
        fig = px.bar(activity_data, x='date', y='activity_level', 
                    title='Daily Activity Level (%)',
                    labels={'activity_level': 'Activity %', 'date': 'Date'})
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        fig = px.bar(activity_data, x='date', y='steps', 
                    title='Daily Step Count',
                    labels={'steps': 'Steps', 'date': 'Date'})
        st.plotly_chart(fig, use_container_width=True)
    
    # Activity breakdown
    st.subheader("Today's Activity Breakdown")
    
    # Mock data for pie chart
    activity_types = ['Sleeping', 'Resting', 'Light Activity', 'Moderate Activity', 'Social']
    activity_hours = [8, 6, 5, 3, 2]
    
    fig = px.pie(values=activity_hours, names=activity_types, title='Activity Distribution (hours)')
    st.plotly_chart(fig, use_container_width=True)
    
    # Location timeline
    st.subheader("Location Timeline")
    st.dataframe(location_data, use_container_width=True)
    
    # Analysis from activity agent
    st.subheader("AI Analysis")
    analysis = activity_agent.analyze_activity(activity_data['activity_level'].tolist())
    st.write(analysis)
    
    # Recommendations
    st.subheader("AI Recommendations")
    recommendations = activity_agent.get_recommendations()
    for rec in recommendations:
        st.markdown(f"- {rec}")

# Reminders page
elif page == "Reminders":
    st.title("Reminders & Scheduling")
    
    # Add new reminder form
    st.subheader("Add New Reminder")
    with st.form("reminder_form"):
        message = st.text_input("Reminder Message")
        col1, col2 = st.columns(2)
        with col1:
            time = st.time_input("Time")
        with col2:
            reminder_type = st.selectbox("Type", ["medication", "health", "appointment", "social"])
        
        days = st.multiselect("Days", ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], 
                             default=["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"])
        
        submitted = st.form_submit_button("Save Reminder")
        if submitted:
            # In a real app, this would save to the database
            st.success(f"Reminder '{message}' saved successfully!")
    
    # Display existing reminders
    st.subheader("Current Reminders")
    reminders = get_mock_reminders()
    
    # Filter options
    status_filter = st.selectbox("Filter by Status", ["All", "Pending", "Completed", "Missed"])
    
    filtered_reminders = reminders
    if status_filter != "All":
        filtered_reminders = [r for r in reminders if r["status"].lower() == status_filter.lower()]
    
    # Display reminders in a table
    if filtered_reminders:
        # Convert to DataFrame for better display
        df_reminders = pd.DataFrame(filtered_reminders)
        # Convert days list to string for display
        df_reminders['days'] = df_reminders['days'].apply(lambda x: ", ".join(x))
        
        # Apply styling based on status
        def highlight_status(val):
            if val == 'completed':
                return 'background-color: #d1fae5; color: #065f46'
            elif val == 'missed':
                return 'background-color: #fee2e2; color: #b91c1c'
            elif val == 'pending':
                return 'background-color: #fef3c7; color: #92400e'
            return ''
        
        styled_df = df_reminders.style.applymap(highlight_status, subset=['status'])
        st.dataframe(styled_df, use_container_width=True)
        
        # Reminder actions
        st.subheader("Reminder Actions")
        reminder_id = st.selectbox("Select Reminder", df_reminders['id'].tolist(), 
                                  format_func=lambda x: df_reminders[df_reminders['id'] == x]['message'].values[0])
        
        col1, col2 = st.columns(2)
        with col1:
            if st.button("Mark as Completed"):
                # In a real app, this would update the database
                st.success(f"Reminder marked as completed!")
        with col2:
            if st.button("Delete Reminder"):
                # In a real app, this would update the database
                st.success(f"Reminder deleted!")
    else:
        st.info("No reminders found with the selected filter.")
    
    # Voice reminder settings
    st.subheader("Voice Reminder Settings")
    col1, col2 = st.columns(2)
    with col1:
        voice_type = st.selectbox("Voice Type", ["Female", "Male"])
    with col2:
        reminder_lead_time = st.selectbox("Reminder Lead Time", ["1 minute", "5 minutes", "10 minutes", "15 minutes"])
    
    if st.button("Save Settings"):
        st.success("Voice reminder settings saved!")

# Alerts page
elif page == "Alerts":
    st.title("Alert Management")
    
    alerts = get_mock_alerts()
    
    # Active alerts
    st.subheader("Active Alerts")
    active_alerts = [alert for alert in alerts if not alert["handled"]]
    
    if active_alerts:
        # Convert to DataFrame for better display
        df_active = pd.DataFrame(active_alerts)
        
        # Apply styling based on priority
        def highlight_priority(val):
            if val == 'critical':
                return 'background-color: #fee2e2; color: #b91c1c; font-weight: bold'
            elif val == 'high':
                return 'background-color: #fed7aa; color: #9a3412; font-weight: bold'
            elif val == 'medium':
                return 'background-color: #fef3c7; color: #92400e'
            elif val == 'low':
                return 'background-color: #d1fae5; color: #065f46'
            return ''
        
        styled_df = df_active.style.applymap(highlight_priority, subset=['priority'])
        st.dataframe(styled_df, use_container_width=True)
        
        # Alert actions
        st.subheader("Alert Actions")
        alert_id = st.selectbox("Select Alert", df_active['id'].tolist(), 
                               format_func=lambda x: df_active[df_active['id'] == x]['message'].values[0])
        
        col1, col2 = st.columns(2)
        with col1:
            if st.button("Resolve Alert"):
                # In a real app, this would update the database
                st.success(f"Alert marked as resolved!")
        with col2:
            if st.button("Assign to Caregiver"):
                caregiver = st.selectbox("Select Caregiver", ["Jane Doe", "John Smith", "Mary Johnson"])
                if st.button("Confirm Assignment"):
                    st.success(f"Alert assigned to {caregiver}!")
    else:
        st.success("No active alerts at this time.")
    
    # Handled alerts
    st.subheader("Handled Alerts")
    handled_alerts = [alert for alert in alerts if alert["handled"]]
    
    if handled_alerts:
        # Convert to DataFrame for better display
        df_handled = pd.DataFrame(handled_alerts)
        st.dataframe(df_handled, use_container_width=True)
    else:
        st.info("No handled alerts to display.")
    
    # Alert configuration
    st.subheader("Alert Configuration")
    
    with st.expander("Emergency Contacts"):
        st.markdown("- Jane Doe (Daughter): 555-123-4567")
        st.markdown("- Dr. Smith: 555-987-6543")
        
        st.subheader("Add New Contact")
        with st.form("contact_form"):
            name = st.text_input("Name")
            relationship = st.text_input("Relationship")
            phone = st.text_input("Phone Number")
            submitted = st.form_submit_button("Add Contact")
            if submitted:
                st.success(f"Contact {name} added successfully!")
    
    with st.expander("Alert Thresholds"):
        st.subheader("Health Thresholds")
        col1, col2 = st.columns(2)
        with col1:
            hr_low = st.number_input("Heart Rate Low Threshold", value=60)
            bp_high_sys = st.number_input("Blood Pressure High Threshold (Systolic)", value=140)
            glucose_low = st.number_input("Glucose Low Threshold", value=70)
        with col2:
            hr_high = st.number_input("Heart Rate High Threshold", value=100)
            bp_high_dia = st.number_input("Blood Pressure High Threshold (Diastolic)", value=90)
            glucose_high = st.number_input("Glucose High Threshold", value=140)
        
        st.subheader("Activity Thresholds")
        inactivity_threshold = st.slider("Inactivity Alert Threshold (minutes)", 30, 180, 60)
        
        if st.button("Save Thresholds"):
            st.success("Alert thresholds updated successfully!")
    
    with st.expander("Notification Methods"):
        st.checkbox("SMS to primary caregiver", value=True)
        st.checkbox("Push notification to app", value=True)
        st.checkbox("Voice call for critical alerts", value=True)
        st.checkbox("Email notifications", value=False)
        
        if st.button("Save Notification Preferences"):
            st.success("Notification preferences updated successfully!")

# Social Engagement page
elif page == "Social Engagement":
    st.title("Social Engagement")
    
    # Get social data
    df_interactions, df_weekly = get_mock_social_data()
    
    # Social overview
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Interaction Types")
        fig = px.pie(df_interactions, values='value', names='type', 
                    title='Social Interaction Distribution')
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        st.subheader("Weekly Interaction Trend")
        fig = px.line(df_weekly, x='day', y='interactions', markers=True,
                     title='Daily Social Interactions',
                     labels={'interactions': 'Interactions', 'day': 'Day'})
        st.plotly_chart(fig, use_container_width=True)
    
    # Social well-being score
    st.subheader("Social Well-being Score")
    score = 75  # Mock score
    st.progress(score/100)
    
    if score >= 80:
        st.success(f"Excellent - {score}%")
    elif score >= 60:
        st.info(f"Good - {score}%")
    else:
        st.warning(f"Needs Improvement - {score}%")
    
    # Upcoming social events
    st.subheader("Upcoming Social Events")
    
    events = [
        {"id": 1, "title": "Family Dinner", "date": "Tomorrow, 6:00 PM", 
         "type": "in-person", "participants": ["Daughter", "Son-in-law", "Grandchildren"]},
        {"id": 2, "title": "Doctor Follow-up", "date": "Wed, May 3, 10:00 AM", 
         "type": "appointment", "participants": ["Dr. Smith"]},
        {"id": 3, "title": "Weekly Video Call", "date": "Sun, May 7, 2:00 PM", 
         "type": "video", "participants": ["Sister", "Brother-in-law"]},
    ]
    
    for event in events:
        with st.expander(f"{event['title']} - {event['date']}"):
            st.markdown(f"**Type:** {event['type']}")
            st.markdown("**Participants:**")
            for person in event['participants']:
                st.markdown(f"- {person}")
            
            col1, col2 = st.columns(2)
            with col1:
                st.button(f"Add to Calendar #{event['id']}")
            with col2:
                st.button(f"Set Reminder #{event['id']}")
    
    # Add new social event
    st.subheader("Add New Social Event")
    with st.form("social_event_form"):
        title = st.text_input("Event Title")
        col1, col2 = st.columns(2)
        with col1:
            date = st.date_input("Date")
        with col2:
            time = st.time_input("Time")
        
        event_type = st.selectbox("Event Type", ["in-person", "video", "phone", "appointment"])
        participants = st.text_area("Participants (one per line)")
        
        submitted = st.form_submit_button("Save Event")
        if submitted:
            st.success(f"Event '{title}' saved successfully!")
    
    # Social achievements
    st.subheader("Social Achievements")
    
    achievements = [
        {"id": 1, "title": "Social Butterfly", "description": "5 social interactions in one day"},
        {"id": 2, "title": "Tech Savvy", "description": "First video call initiated independently"},
        {"id": 3, "title": "Community Member", "description": "Joined online senior community group"},
    ]
    
    achievement_cols = st.columns(3)
    for i, achievement in enumerate(achievements):
        with achievement_cols[i]:
            st.markdown(f"**{achievement['title']}**")
            st.markdown(achievement['description'])
            st.progress(1.0)  # Completed achievement
    
    # AI Recommendations
    st.subheader("AI Recommendations")
    recommendations = social_agent.get_recommendations()
    for rec in recommendations:
        st.markdown(f"- {rec}")

# Agent Chat page
elif page == "Agent Chat":
    st.title("Agent Chat")
    
    # Initialize chat history
    if "messages" not in st.session_state:
        st.session_state.messages = [
            {"role": "assistant", "content": "Hello! I'm your ElderCare assistant. How can I help you today?"}
        ]
    
    # Display chat messages
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])
    
    # Chat input
    if prompt := st.chat_input("Type your message here..."):
        # Add user message to chat history
        st.session_state.messages.append({"role": "user", "content": prompt})
        
        # Display user message
        with st.chat_message("user"):
            st.markdown(prompt)
        
        # Process with appropriate agent based on content
        response = ""
        
        if "health" in prompt.lower() or "heart" in prompt.lower() or "blood pressure" in prompt.lower():
            response = health_agent.respond_to_query(prompt)
        elif "activity" in prompt.lower() or "movement" in prompt.lower() or "exercise" in prompt.lower():
            response = activity_agent.respond_to_query(prompt)
        elif "reminder" in prompt.lower() or "medication" in prompt.lower() or "appointment" in prompt.lower():
            response = reminder_agent.respond_to_query(prompt)
        elif "alert" in prompt.lower() or "emergency" in prompt.lower() or "help" in prompt.lower():
            response = alert_agent.respond_to_query(prompt)
        elif "social" in prompt.lower() or "family" in prompt.lower() or "friend" in prompt.lower():
            response = social_agent.respond_to_query(prompt)
        else:
            # Default response when no specific agent is matched
            response = "I'll help you with that. Our multi-agent system is monitoring all aspects of elderly care. What specific information are you looking for?"
        
        # Add assistant response to chat history
        st.session_state.messages.append({"role": "assistant", "content": response})
        
        # Display assistant response
        with st.chat_message("assistant"):
            st.markdown(response)

# Footer
st.sidebar.markdown("---")
st.sidebar.markdown("© 2023 ElderCare AI")
st.sidebar.markdown("Version 1.0.0")
