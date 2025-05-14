"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SendHorizontal, Bot, Loader2 } from "lucide-react"
import { useChat } from "ai/react"
import { cn } from "@/lib/utils"

export function EnhancedAgentChat() {
  const [isInitializing, setIsInitializing] = useState(true)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/agent-chat",
    onFinish: () => {
      // Scroll to bottom when a message is received
      setTimeout(() => scrollToBottom(), 100)
    },
  })

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsInitializing(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Scroll to bottom on initial load
    if (!isInitializing) {
      scrollToBottom()
    }
  }, [isInitializing])

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-teal-600" />
          Agent Assistant
        </CardTitle>
        <CardDescription>Ask about status or send commands to the ElderCare system</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          {isInitializing ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
            </div>
          ) : (
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 h-64 text-center">
                  <Bot className="h-12 w-12 text-teal-600" />
                  <h3 className="font-medium text-lg">ElderCare AI Agent</h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    I can help you monitor health metrics, check activity status, manage reminders, and respond to
                    alerts. How can I assist you today?
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
                  >
                    {message.role === "assistant" && (
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback className="bg-teal-100 text-teal-800">AI</AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={cn(
                        "rounded-lg px-4 py-2 max-w-[80%]",
                        message.role === "user" ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-800",
                      )}
                    >
                      {message.content}
                    </div>

                    {message.role === "user" && (
                      <Avatar className="h-8 w-8 ml-2">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                        <AvatarFallback>CG</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))
              )}

              {isLoading && (
                <div className="flex justify-start">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarFallback className="bg-teal-100 text-teal-800">AI</AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 rounded-lg px-4 py-2 max-w-[80%]">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-teal-600 animate-pulse"></div>
                      <div className="h-2 w-2 rounded-full bg-teal-600 animate-pulse delay-150"></div>
                      <div className="h-2 w-2 rounded-full bg-teal-600 animate-pulse delay-300"></div>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex justify-center">
                  <div className="bg-red-100 text-red-800 rounded-lg px-4 py-2 max-w-[80%] text-sm">
                    Error: {error.message || "Failed to communicate with the agent system"}
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>

      <CardFooter className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2 w-full">
          <Input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={handleInputChange}
            disabled={isLoading || isInitializing}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={isLoading || isInitializing || !input.trim()}
            className="bg-teal-600 hover:bg-teal-700"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizontal className="h-4 w-4" />}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
