import { NextResponse } from "next/server"
import { StreamingTextResponse } from "ai"
import { generateText, streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import { createHealthMonitorAgent } from "@/lib/agents/agent-manager"

export const runtime = "nodejs"

// System instruction for the agent
const SYSTEM_INSTRUCTION = `You are the ElderCare AI Assistant, a helpful agent designed to monitor and assist with elderly care.
You have access to health data, activity monitoring, reminders, alerts, and social engagement information.
Be concise, helpful, and informative in your responses. Prioritize health and safety concerns.
If you don't have specific data available, acknowledge this and offer to check the system.`

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    const lastMessage = messages[messages.length - 1]

    // If the request is not a streaming request, use generateText
    if (req.headers.get("accept") !== "text/event-stream") {
      let agentResponse: string

      // Process message to determine which agent to use
      if (
        lastMessage.content.toLowerCase().includes("health") ||
        lastMessage.content.toLowerCase().includes("heart") ||
        lastMessage.content.toLowerCase().includes("blood pressure")
      ) {
        const healthAgent = await createHealthMonitorAgent()
        const agentResult = await healthAgent.invoke({ input: lastMessage.content })
        agentResponse = agentResult.output
      } else {
        // Use AI SDK for general responses when no specific agent is needed
        const result = await generateText({
          model: openai("gpt-4o"),
          prompt: lastMessage.content,
          system: SYSTEM_INSTRUCTION,
        })

        agentResponse = result.text
      }

      // Return the response as a Message
      return NextResponse.json({
        messages: [
          ...messages,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: agentResponse,
          },
        ],
      })
    }

    // For streaming responses
    const result = await streamText({
      model: openai("gpt-4o"),
      system: SYSTEM_INSTRUCTION,
      prompt: lastMessage.content,
    })

    return new StreamingTextResponse(result.textStream)
  } catch (error) {
    console.error("Error in agent chat:", error)
    return NextResponse.json({ error: "An error occurred while processing your request" }, { status: 500 })
  }
}
