"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Bell, Calendar, Heart, AlertCircle, MessageSquare, Users } from "lucide-react"
import { HealthMonitor } from "@/components/health-monitor"
import { ActivityMonitor } from "@/components/activity-monitor"
import { ReminderManager } from "@/components/reminder-manager"
import { AlertsPanel } from "@/components/alerts-panel"
import { SocialEngagement } from "@/components/social-engagement"

export function CaregiverDashboard() {
  const [activeTab, setActiveTab] = useState("health")
  const [alerts, setAlerts] = useState<string[]>([])

  // Mock function to fetch alerts - would connect to backend in real implementation
  useEffect(() => {
    // Simulating fetch from an API
    const mockAlerts = [
      "Blood pressure reading high at 9:15 AM",
      "Medication reminder missed at 8:00 AM",
      "Unusual inactivity detected between 2-4 PM",
    ]

    setAlerts(mockAlerts)

    // This would be a websocket or polling mechanism in reality
    const intervalId = setInterval(() => {
      // Check for new alerts
    }, 30000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Quick Stats Cards */}
      <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<Heart className="h-5 w-5 text-rose-500" />}
          title="Health Status"
          value="Normal"
          description="Last checked 5 mins ago"
          color="bg-rose-50"
        />
        <StatsCard
          icon={<Activity className="h-5 w-5 text-emerald-500" />}
          title="Activity Level"
          value="Moderate"
          description="Active for 3 hours today"
          color="bg-emerald-50"
        />
        <StatsCard
          icon={<Bell className="h-5 w-5 text-amber-500" />}
          title="Reminders"
          value="2 Pending"
          description="Next reminder in 30 mins"
          color="bg-amber-50"
        />
        <StatsCard
          icon={<AlertCircle className="h-5 w-5 text-red-500" />}
          title="Alerts"
          value={`${alerts.length} New`}
          description="2 high priority alerts"
          color="bg-red-50"
        />
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3">
        <Tabs defaultValue="health" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="health">
              <Heart className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Health</span>
            </TabsTrigger>
            <TabsTrigger value="activity">
              <Activity className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Activity</span>
            </TabsTrigger>
            <TabsTrigger value="reminders">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Reminders</span>
            </TabsTrigger>
            <TabsTrigger value="alerts">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="social">
              <Users className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Social</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="health">
            <HealthMonitor />
          </TabsContent>

          <TabsContent value="activity">
            <ActivityMonitor />
          </TabsContent>

          <TabsContent value="reminders">
            <ReminderManager />
          </TabsContent>

          <TabsContent value="alerts">
            <AlertsPanel alerts={alerts} />
          </TabsContent>

          <TabsContent value="social">
            <SocialEngagement />
          </TabsContent>
        </Tabs>
      </div>

      {/* Sidebar - Agent Chat */}
      <div className="lg:col-span-1">
        <AgentChat />
      </div>
    </div>
  )
}

interface StatsCardProps {
  icon: React.ReactNode
  title: string
  value: string
  description: string
  color: string
}

function StatsCard({ icon, title, value, description, color }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-full ${color}`}>{icon}</div>
          <div>
            <p className="text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function AgentChat() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "agent", content: "Hello! I'm your ElderCare assistant. How can I help you today?" },
  ])
  const [input, setInput] = useState("")

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: input }])
    setInput("")

    // Simulate agent response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          content:
            "I'll look into that for you. The system is currently monitoring all activities and everything appears normal.",
        },
      ])
    }, 1000)
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Agent Assistant
        </CardTitle>
        <CardDescription>Ask about status or send commands</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto mb-4">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                  msg.role === "user" ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-800"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-md"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button className="bg-teal-600 text-white p-2 rounded-md" onClick={handleSendMessage}>
            Send
          </button>
        </div>
      </div>
    </Card>
  )
}
