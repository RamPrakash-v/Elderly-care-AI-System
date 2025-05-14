"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { HealthMonitor } from "@/components/health-monitor"
import { ActivityMonitor } from "@/components/activity-monitor"
import { ReminderManager } from "@/components/reminder-manager"
import { AlertsPanel } from "@/components/alerts-panel"
import { SocialEngagement } from "@/components/social-engagement"
import { EnhancedAgentChat } from "@/components/enhanced-agent-chat"

export function DashboardShell() {
  const [activeTab, setActiveTab] = useState("health")
  const [alerts, setAlerts] = useState<string[]>([
    "Blood pressure reading high at 9:15 AM",
    "Medication reminder missed at 8:00 AM",
    "Unusual inactivity detected between 2-4 PM",
  ])

  // Function to render the active content
  const renderContent = () => {
    switch (activeTab) {
      case "health":
        return <HealthMonitor />
      case "activity":
        return <ActivityMonitor />
      case "reminders":
        return <ReminderManager />
      case "alerts":
        return <AlertsPanel alerts={alerts} />
      case "social":
        return <SocialEngagement />
      case "chat":
        return (
          <div className="max-w-3xl mx-auto">
            <EnhancedAgentChat />
          </div>
        )
      default:
        return <HealthMonitor />
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-b from-teal-50 to-blue-50">
      <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-teal-700">
              {activeTab === "health" && "Health Monitoring"}
              {activeTab === "activity" && "Activity Tracking"}
              {activeTab === "reminders" && "Reminders & Scheduling"}
              {activeTab === "alerts" && "Alert Management"}
              {activeTab === "social" && "Social Engagement"}
              {activeTab === "chat" && "Agent Assistant"}
            </h1>
            <p className="text-slate-600 mt-1">
              {activeTab === "health" && "Track vital signs and health metrics"}
              {activeTab === "activity" && "Monitor daily movements and activity levels"}
              {activeTab === "reminders" && "Manage medications, appointments, and activities"}
              {activeTab === "alerts" && "Monitor and respond to system alerts"}
              {activeTab === "social" && "Track and encourage social interactions"}
              {activeTab === "chat" && "Interact with the ElderCare AI system"}
            </p>
          </header>

          {renderContent()}
        </div>
      </div>
    </div>
  )
}
