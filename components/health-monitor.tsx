"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"

// Mock data - in a real app this would come from your API
const healthData = {
  heartRate: [
    { time: "00:00", value: 68 },
    { time: "03:00", value: 65 },
    { time: "06:00", value: 72 },
    { time: "09:00", value: 85 },
    { time: "12:00", value: 78 },
    { time: "15:00", value: 76 },
    { time: "18:00", value: 82 },
    { time: "21:00", value: 75 },
  ],
  bloodPressure: [
    { time: "00:00", systolic: 120, diastolic: 80 },
    { time: "03:00", systolic: 118, diastolic: 78 },
    { time: "06:00", systolic: 122, diastolic: 82 },
    { time: "09:00", systolic: 135, diastolic: 88 },
    { time: "12:00", systolic: 125, diastolic: 85 },
    { time: "15:00", systolic: 123, diastolic: 83 },
    { time: "18:00", systolic: 130, diastolic: 86 },
    { time: "21:00", systolic: 128, diastolic: 84 },
  ],
  glucose: [
    { time: "06:00", value: 110 },
    { time: "12:00", value: 145 },
    { time: "18:00", value: 115 },
  ],
}

export function HealthMonitor() {
  const [activeTab, setActiveTab] = useState("heart-rate")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Monitoring</CardTitle>
        <CardDescription>Track vital signs and health metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="heart-rate" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="heart-rate">Heart Rate</TabsTrigger>
            <TabsTrigger value="blood-pressure">Blood Pressure</TabsTrigger>
            <TabsTrigger value="glucose">Glucose</TabsTrigger>
          </TabsList>

          <TabsContent value="heart-rate" className="space-y-4">
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={healthData.heartRate} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[50, 110]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#f43f5e" fill="#fda4af" name="Heart Rate (BPM)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <h3 className="font-medium mb-2">Analysis</h3>
              <p>
                Heart rate is within normal range, with normal variation throughout the day. Peak activity observed
                around 9:00 AM.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="blood-pressure" className="space-y-4">
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={healthData.bloodPressure} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[60, 160]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="systolic" stroke="#6366f1" name="Systolic" strokeWidth={2} />
                  <Line type="monotone" dataKey="diastolic" stroke="#a5b4fc" name="Diastolic" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <h3 className="font-medium mb-2">Analysis</h3>
              <p>
                Blood pressure shows slight elevation at 9:00 AM. Overall values remain within acceptable range for the
                patient's age and condition.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="glucose" className="space-y-4">
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={healthData.glucose} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[80, 180]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#059669" strokeWidth={2} name="Glucose (mg/dL)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <h3 className="font-medium mb-2">Analysis</h3>
              <p>
                Glucose levels peaked after lunch at 12:00 PM (145 mg/dL). Values are within target range but monitoring
                post-meal levels is advised.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 border-t pt-4">
          <h3 className="font-medium mb-2">AI Recommendations</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Continue monitoring blood pressure as it shows slight elevation</li>
            <li>Maintain current medication schedule</li>
            <li>Consider light physical activity in the morning to improve circulation</li>
            <li>Schedule next healthcare provider check-in for next week</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
