"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, Bell, Heart, Activity, Check, Users, User } from "lucide-react"

interface AlertsPanelProps {
  alerts: string[]
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  const [allAlerts, setAllAlerts] = useState([
    {
      id: 1,
      message: "Blood pressure reading high at 9:15 AM",
      type: "health",
      priority: "high",
      time: "9:15 AM",
      status: "new",
      handled: false,
    },
    {
      id: 2,
      message: "Medication reminder missed at 8:00 AM",
      type: "medication",
      priority: "medium",
      time: "8:00 AM",
      status: "new",
      handled: false,
    },
    {
      id: 3,
      message: "Unusual inactivity detected between 2-4 PM",
      type: "activity",
      priority: "high",
      time: "4:00 PM",
      status: "new",
      handled: false,
    },
    {
      id: 4,
      message: "Heart rate elevated during morning walk",
      type: "health",
      priority: "low",
      time: "7:30 AM",
      status: "handled",
      handled: true,
    },
    {
      id: 5,
      message: "No movement detected in bathroom for over 30 minutes",
      type: "safety",
      priority: "critical",
      time: "10:45 AM",
      status: "handled",
      handled: true,
    },
  ])

  const handleAlertAction = (id: number, action: string) => {
    if (action === "resolve") {
      setAllAlerts((prev) =>
        prev.map((alert) => (alert.id === id ? { ...alert, status: "handled", handled: true } : alert)),
      )
    }
  }

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case "health":
        return <Heart className="h-4 w-4 text-red-500" />
      case "medication":
        return <Bell className="h-4 w-4 text-blue-500" />
      case "activity":
        return <Activity className="h-4 w-4 text-green-500" />
      case "safety":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "social":
        return <Users className="h-4 w-4 text-purple-500" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical":
        return <Badge className="bg-red-500 text-white">Critical</Badge>
      case "high":
        return <Badge className="bg-orange-500 text-white">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-500 text-black">Medium</Badge>
      case "low":
        return <Badge className="bg-green-500 text-white">Low</Badge>
      default:
        return <Badge>{priority}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alert Management</CardTitle>
        <CardDescription>Monitor and respond to system alerts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Active Alerts</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Alert</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allAlerts
                  .filter((alert) => !alert.handled)
                  .map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell>{getAlertTypeIcon(alert.type)}</TableCell>
                      <TableCell>{alert.message}</TableCell>
                      <TableCell>{alert.time}</TableCell>
                      <TableCell>{getPriorityBadge(alert.priority)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleAlertAction(alert.id, "resolve")}>
                            <Check className="h-4 w-4 mr-1" />
                            Resolve
                          </Button>
                          <Button size="sm" variant="ghost">
                            <User className="h-4 w-4 mr-1" />
                            Assign
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                {allAlerts.filter((alert) => !alert.handled).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                      No active alerts
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Handled Alerts</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Alert</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allAlerts
                  .filter((alert) => alert.handled)
                  .map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell>{getAlertTypeIcon(alert.type)}</TableCell>
                      <TableCell>{alert.message}</TableCell>
                      <TableCell>{alert.time}</TableCell>
                      <TableCell>{getPriorityBadge(alert.priority)}</TableCell>
                      <TableCell className="text-right">
                        <Badge className="bg-gray-200 text-gray-800">Resolved</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>

          <div className="border rounded-md p-4">
            <h3 className="text-lg font-medium mb-2">Alert Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Emergency Contacts</label>
                <ul className="text-sm">
                  <li>Jane Doe (Daughter): 555-123-4567</li>
                  <li>Dr. Smith: 555-987-6543</li>
                </ul>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Alert Thresholds</label>
                <ul className="text-sm">
                  <li>Heart Rate: {"<60 or >100 bpm"}</li>
                  <li>Blood Pressure: {">140/90 mmHg"}</li>
                  <li>Inactivity: {">3 hours"}</li>
                </ul>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Notification Methods</label>
                <ul className="text-sm">
                  <li>SMS to primary caregiver</li>
                  <li>Push notification to app</li>
                  <li>Voice call for critical alerts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
