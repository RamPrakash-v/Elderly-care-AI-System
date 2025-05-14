"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar, Plus, Edit, Trash, Bell, MessageSquare, Check } from "lucide-react"

// Mock reminder data
const initialReminders = [
  {
    id: 1,
    message: "Take blood pressure medication",
    time: "08:00",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "medication",
    status: "completed",
  },
  {
    id: 2,
    message: "Drink water",
    time: "10:00",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "health",
    status: "pending",
  },
  {
    id: 3,
    message: "Doctor's appointment",
    time: "14:30",
    days: ["Wed"],
    type: "appointment",
    status: "pending",
  },
  {
    id: 4,
    message: "Take glucose measurement",
    time: "18:00",
    days: ["Mon", "Thu"],
    type: "health",
    status: "missed",
  },
  {
    id: 5,
    message: "Call daughter",
    time: "19:00",
    days: ["Tue", "Sun"],
    type: "social",
    status: "pending",
  },
]

export function ReminderManager() {
  const [reminders, setReminders] = useState(initialReminders)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newReminder, setNewReminder] = useState({
    message: "",
    time: "",
    type: "health",
  })

  const handleAddReminder = () => {
    if (!newReminder.message || !newReminder.time) return

    setReminders((prev) => [
      ...prev,
      {
        id: Math.max(...prev.map((r) => r.id)) + 1,
        message: newReminder.message,
        time: newReminder.time,
        days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        type: newReminder.type,
        status: "pending",
      },
    ])

    setNewReminder({
      message: "",
      time: "",
      type: "health",
    })

    setShowAddForm(false)
  }

  const handleDeleteReminder = (id: number) => {
    setReminders((prev) => prev.filter((r) => r.id !== id))
  }

  const handleStatusChange = (id: number, status: string) => {
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "missed":
        return <Badge className="bg-red-100 text-red-800">Missed</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "medication":
        return <Bell className="h-4 w-4 text-blue-500" />
      case "appointment":
        return <Calendar className="h-4 w-4 text-purple-500" />
      case "social":
        return <MessageSquare className="h-4 w-4 text-pink-500" />
      case "health":
      default:
        return <Clock className="h-4 w-4 text-teal-500" />
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Reminders & Scheduling</CardTitle>
          <CardDescription>Manage medications, appointments, and activities</CardDescription>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-teal-600 hover:bg-teal-700">
          <Plus className="h-4 w-4 mr-2" />
          New Reminder
        </Button>
      </CardHeader>
      <CardContent>
        {showAddForm && (
          <Card className="mb-6 border-dashed">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Input
                    placeholder="What to remind about?"
                    value={newReminder.message}
                    onChange={(e) => setNewReminder({ ...newReminder, message: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time</label>
                  <Input
                    type="time"
                    value={newReminder.time}
                    onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select
                    value={newReminder.type}
                    onValueChange={(value) => setNewReminder({ ...newReminder, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medication">Medication</SelectItem>
                      <SelectItem value="appointment">Appointment</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddReminder} className="bg-teal-600 hover:bg-teal-700">
                  Save Reminder
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Reminder</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reminders.map((reminder) => (
              <TableRow key={reminder.id}>
                <TableCell>{getTypeIcon(reminder.type)}</TableCell>
                <TableCell>{reminder.message}</TableCell>
                <TableCell>{reminder.time}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {reminder.days.map((day) => (
                      <span key={day} className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">
                        {day}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(reminder.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {reminder.status === "pending" && (
                      <Button size="sm" variant="ghost" onClick={() => handleStatusChange(reminder.id, "completed")}>
                        <Check className="h-4 w-4 text-green-500" />
                      </Button>
                    )}
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteReminder(reminder.id)}>
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-6 border-t pt-4">
          <h3 className="font-medium mb-2">Voice Reminder Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Voice Type</label>
              <Select defaultValue="female">
                <SelectTrigger>
                  <SelectValue placeholder="Select voice" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Reminder Lead Time</label>
              <Select defaultValue="5">
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 minute</SelectItem>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
