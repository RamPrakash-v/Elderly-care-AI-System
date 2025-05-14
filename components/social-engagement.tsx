"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MessageSquare, Phone, Users, Video, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"

// Mock data
const socialData = {
  interactions: [
    { name: "Family Calls", value: 5, color: "#ec4899" },
    { name: "Video Chats", value: 2, color: "#8b5cf6" },
    { name: "Messages", value: 12, color: "#3b82f6" },
    { name: "In-Person", value: 1, color: "#10b981" },
  ],
  weekly: [
    { day: "Mon", interactions: 2 },
    { day: "Tue", interactions: 4 },
    { day: "Wed", interactions: 1 },
    { day: "Thu", interactions: 3 },
    { day: "Fri", interactions: 5 },
    { day: "Sat", interactions: 6 },
    { day: "Sun", interactions: 2 },
  ],
  upcomingEvents: [
    {
      id: 1,
      title: "Family Dinner",
      date: "Tomorrow, 6:00 PM",
      type: "in-person",
      participants: ["Daughter", "Son-in-law", "Grandchildren"],
    },
    {
      id: 2,
      title: "Doctor Follow-up",
      date: "Wed, May 3, 10:00 AM",
      type: "appointment",
      participants: ["Dr. Smith"],
    },
    {
      id: 3,
      title: "Weekly Video Call",
      date: "Sun, May 7, 2:00 PM",
      type: "video",
      participants: ["Sister", "Brother-in-law"],
    },
  ],
  achievements: [
    { id: 1, title: "Social Butterfly", description: "5 social interactions in one day", icon: <Users /> },
    { id: 2, title: "Tech Savvy", description: "First video call initiated independently", icon: <Video /> },
    { id: 3, title: "Community Member", description: "Joined online senior community group", icon: <Heart /> },
  ],
}

export function SocialEngagement() {
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null)

  const getTotalInteractions = () => {
    return socialData.interactions.reduce((sum, item) => sum + item.value, 0)
  }

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case "in-person":
        return <Users className="h-5 w-5 text-emerald-500" />
      case "video":
        return <Video className="h-5 w-5 text-purple-500" />
      case "appointment":
        return <Calendar className="h-5 w-5 text-blue-500" />
      default:
        return <MessageSquare className="h-5 w-5 text-pink-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Engagement</CardTitle>
        <CardDescription>Track and encourage social interactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-medium mb-4">Interaction Types</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={socialData.interactions}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {socialData.interactions.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 text-center">
              <p className="text-sm text-gray-500">Total Interactions This Week</p>
              <p className="text-2xl font-bold">{getTotalInteractions()}</p>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-4">Weekly Interaction Trend</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={socialData.weekly} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="interactions" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 text-center">
              <p className="text-sm text-gray-500">Social Well-being Score</p>
              <Progress value={75} className="h-2 mt-1" />
              <p className="text-sm mt-1 text-teal-600">Good - 75%</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-medium mb-4">Upcoming Social Events</h3>
          <div className="space-y-4">
            {socialData.upcomingEvents.map((event) => (
              <div
                key={event.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedEvent === event.id ? "border-teal-600 bg-teal-50" : "hover:border-teal-200"
                }`}
                onClick={() => setSelectedEvent(event.id === selectedEvent ? null : event.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-gray-100 rounded-full p-2">{getInteractionIcon(event.type)}</div>
                  <div className="flex-1">
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-gray-600">{event.date}</p>

                    {selectedEvent === event.id && (
                      <div className="mt-2 text-sm">
                        <p className="font-medium mt-2">Participants:</p>
                        <ul className="list-disc pl-5 mt-1">
                          {event.participants.map((person, idx) => (
                            <li key={idx}>{person}</li>
                          ))}
                        </ul>
                        <div className="mt-3 flex gap-2">
                          <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                            <Calendar className="h-4 w-4 mr-1" />
                            Add to Calendar
                          </Button>
                          <Button size="sm" variant="outline">
                            <Phone className="h-4 w-4 mr-1" />
                            Remind
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-medium mb-4">Social Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {socialData.achievements.map((achievement) => (
              <div key={achievement.id} className="border rounded-lg p-4 text-center">
                <div className="mx-auto bg-teal-100 text-teal-700 rounded-full h-10 w-10 flex items-center justify-center mb-2">
                  {achievement.icon}
                </div>
                <h4 className="font-medium">{achievement.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-medium mb-4">AI Recommendations</h3>
          <div className="space-y-3">
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg">
              <p className="text-sm">
                <span className="font-medium">Social schedule:</span> Friday and Saturday show the highest interaction
                levels. Consider scheduling important conversations during these days.
              </p>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm">
                <span className="font-medium">Interaction recommendation:</span> Video calls have shown positive impacts
                on mood. Consider increasing video interactions with family members.
              </p>
            </div>
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-sm">
                <span className="font-medium">Community engagement:</span> Local senior center has weekly activities.
                Consider attending the gardening workshop on Thursdays.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
