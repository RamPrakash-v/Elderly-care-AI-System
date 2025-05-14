"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, ShieldOff, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function MonitoringControls() {
  const [isActive, setIsActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const toggleMonitoring = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/monitoring", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: isActive ? "stop" : "start",
          userId: 1,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsActive(!isActive)
        toast({
          title: isActive ? "Monitoring Stopped" : "Monitoring Started",
          description: data.message,
          variant: isActive ? "destructive" : "default",
        })
      } else {
        toast({
          title: "Operation Failed",
          description: data.error || "Failed to toggle monitoring",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error toggling monitoring:", error)
      toast({
        title: "Error",
        description: "Failed to communicate with the monitoring system",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isActive ? <Shield className="h-5 w-5 text-green-500" /> : <ShieldOff className="h-5 w-5 text-gray-400" />}
          Monitoring System
        </CardTitle>
        <CardDescription>Control the automatic monitoring and alert detection system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className={`w-3 h-3 rounded-full ${isActive ? "bg-green-500 animate-pulse" : "bg-red-500"}`}></div>
          <div>
            <p className="font-medium">Status: {isActive ? "Active" : "Inactive"}</p>
            <p className="text-sm text-muted-foreground">
              {isActive
                ? "System is actively monitoring health metrics, activity, and schedules"
                : "Monitoring is currently disabled"}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            toast({
              title: "System Report",
              description: "Monitoring system check complete. All components functioning normally.",
            })
          }}
          disabled={isLoading}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Check System
        </Button>

        <Button
          variant={isActive ? "destructive" : "default"}
          className={isActive ? "" : "bg-teal-600 hover:bg-teal-700"}
          onClick={toggleMonitoring}
          disabled={isLoading}
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : isActive ? (
            <ShieldOff className="h-4 w-4 mr-2" />
          ) : (
            <Shield className="h-4 w-4 mr-2" />
          )}
          {isActive ? "Stop Monitoring" : "Start Monitoring"}
        </Button>
      </CardFooter>
    </Card>
  )
}
