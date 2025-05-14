"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Calendar } from "@/components/ui/calendar"

// Mock data
const activityData = {
  today: [
    { name: "Sleeping", hours: 8, color: "#8b5cf6" },
    { name: "Resting", hours: 6, color: "#93c5fd" },
    { name: "Light Activity", hours: 5, color: "#34d399" },
    { name: "Moderate Activity", hours: 3, color: "#fbbf24" },
    { name: "Social", hours: 2, color: "#f87171" },
  ],
  weekly: [
    { day: "Mon", steps: 1200, activity: 65 },
    { day: "Tue", steps: 1800, activity: 70 },
    { day: "Wed", steps: 2200, activity: 80 },
    { day: "Thu", steps: 1600, activity: 75 },
    { day: "Fri", steps: 2000, activity: 85 },
    { day: "Sat", steps: 1300, activity: 60 },
    { day: "Sun", steps: 900, activity: 45 },
  ],
  locations: [
    { time: "08:00", location: "Bedroom" },
    { time: "08:30", location: "Bathroom" },
    { time: "09:15", location: "Kitchen" },
    { time: "10:30", location: "Living Room" },
    { time: "12:00", location: "Kitchen" },
    { time: "13:30", location: "Living Room" },
    { time: "15:45", location: "Bedroom" },
    { time: "17:00", location: "Kitchen" },
    { time: "18:30", location: "Living Room" },
    { time: "21:00", location: "Bathroom" },
    { time: "21:30", location: "Bedroom" },
  ],
}

export function ActivityMonitor() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Monitoring</CardTitle>
        <CardDescription>Track daily movements and activity levels</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Activity Breakdown */}
          <div>
            <h3 className="text-md font-medium mb-4">Today's Activity</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activityData.today}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="hours"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {activityData.today.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weekly Activity Trend */}
          <div>
            <h3 className="text-md font-medium mb-4">Weekly Activity Trend</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData.weekly} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="activity" name="Activity (%" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Location Timeline */}
        <div className="mt-8">
          <h3 className="text-md font-medium mb-4">Location Timeline</h3>
          <div className="border rounded-md p-4 max-h-[250px] overflow-y-auto">
            <div className="space-y-4">
              {activityData.locations.map((item, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="bg-teal-100 text-teal-700 rounded-full h-6 w-6 flex items-center justify-center text-xs">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{item.time}</p>
                    <p className="text-sm text-gray-600">{item.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Calendar */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-md font-medium mb-4">Activity Calendar</h3>
            <div className="border rounded-md p-4">
              <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md" />
            </div>
          </div>

          <div>
            <h3 className="text-md font-medium mb-4">AI Analysis</h3>
            <div className="border rounded-md p-4 h-full">
              <p className="text-sm">
                Activity levels are consistent with established patterns. Wednesday showed the highest activity level
                (80%). There was a noticeable decrease in activity on Sunday (45%). No unusual movement patterns
                detected.
              </p>
              <div className="mt-4">
                <h4 className="font-medium text-sm">Recommendations:</h4>
                <ul className="list-disc pl-5 text-sm mt-2 space-y-1">
                  <li>Encourage more light activity on weekends</li>
                  <li>Current routine shows good balance between rest and activity</li>
                  <li>Bathroom visits are well-spaced, indicating good hydration</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
