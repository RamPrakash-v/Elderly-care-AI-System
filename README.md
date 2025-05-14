# Elderly Care Multi-Agent AI System

A Python-based multi-agent AI system for monitoring, providing reminders, and safety alerts for elderly care.

## Overview

This system uses multiple AI agents to monitor health metrics, activity patterns, manage reminders, detect anomalies, and encourage social engagement for elderly individuals. The agents work together to create a comprehensive care system that can alert caregivers in case of emergencies.

## Features

- **Health Monitoring**: Track vital signs like heart rate, blood pressure, and glucose levels
- **Activity Monitoring**: Monitor movement patterns and daily activities
- **Reminder Management**: Manage medication schedules and appointments
- **Alert System**: Detect anomalies and send appropriate alerts
- **Social Engagement**: Track and encourage social interactions

## System Architecture

The system consists of the following components:

1. **Database Layer**: SQLite database for storing health data, activity logs, reminders, and alerts
2. **Agent Framework**: Multiple specialized agents for different aspects of elderly care
3. **API Layer**: Flask API for communication between components
4. **Dashboard**: Streamlit dashboard for visualization and interaction

## Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/elderly-care-ai.git
cd elderly-care-ai
\`\`\`

2. Create a virtual environment:
\`\`\`bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
\`\`\`

3. Install dependencies:
\`\`\`bash
pip install -r requirements.txt
\`\`\`

4. Install Ollama (for LLM support):
\`\`\`bash
# On 
\`\`\`bash
pip install -r requirements.txt
\`\`\`

4. Install Ollama (for LLM support):
\`\`\`bash
# On macOS
brew install ollama

# On Linux
curl -fsSL https://ollama.com/install.sh | sh
\`\`\`

5. Start the Ollama server:
\`\`\`bash
ollama serve
\`\`\`

6. Pull the required models:
\`\`\`bash
ollama pull llama3
\`\`\`

## Running the System

1. Start the Flask API server:
\`\`\`bash
python api/api.py
\`\`\`

2. Start the Streamlit dashboard:
\`\`\`bash
streamlit run app.py
\`\`\`

3. Access the dashboard at http://localhost:8501

## Agent System

The system includes the following specialized agents:

- **Health Monitor Agent**: Analyzes vital signs and detects anomalies
- **Activity Monitor Agent**: Tracks movement patterns and detects unusual behavior
- **Reminder Agent**: Manages medication schedules and daily routines
- **Alert Agent**: Triggers alerts for critical situations
- **Social Agent**: Encourages social engagement
- **Agent Coordinator**: Orchestrates all agents and manages communication

## Database Schema

The SQLite database includes the following tables:

- `health_data`: Stores vital sign measurements
- `activity_log`: Tracks movement and activities
- `reminders`: Manages scheduled reminders
- `alerts`: Handles system alerts
- `social_interactions`: Tracks social interactions
- `social_events`: Manages upcoming social events

## API Endpoints

The Flask API provides the following endpoints:

- `/api/health`: Record and retrieve health data
- `/api/activity`: Track movement and activities
- `/api/reminders`: Manage scheduled reminders
- `/api/alerts`: Handle system alerts
- `/api/social/interactions`: Track social interactions
- `/api/social/events`: Manage social events
- `/api/agents/status`: Get agent status
- `/api/agents/run`: Run specific agents
- `/api/agents/query`: Query the agent system

## Future Enhancements

- Add machine learning models for anomaly detection
- Implement voice interface for elderly users
- Develop mobile app for caregivers
- Add integration with wearable devices
- Implement more sophisticated agent coordination

## License

MIT
