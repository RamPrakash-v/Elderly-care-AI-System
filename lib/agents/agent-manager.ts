import { Ollama } from "@langchain/community/llms/ollama"
import { AgentExecutor, createReactAgent } from "langchain/agents"
import { PromptTemplate } from "@langchain/core/prompts"
import { DynamicTool } from "@langchain/core/tools"
import { getLatestHealthData } from "@/lib/db"

// Configure the base model
const configureModel = () => {
  return new Ollama({
    baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
    model: "llama3",
  })
}

// Define tools that our agents can use
const createHealthMonitorTool = () => {
  return new DynamicTool({
    name: "HealthDataAnalyzer",
    description: "Analyzes health data to detect anomalies",
    func: async (input: string) => {
      try {
        const userId = Number.parseInt(input, 10) || 1
        const healthData = await getLatestHealthData(userId)

        if (!healthData) {
          return "No health data available for analysis."
        }

        // Analyze the health data
        const { heart_rate, bp, glucose } = healthData
        let analysis = "Health Data Analysis:\n"

        // Check heart rate
        if (heart_rate > 100) {
          analysis += "- Heart rate is elevated above normal range.\n"
        } else if (heart_rate < 60) {
          analysis += "- Heart rate is below normal range.\n"
        } else {
          analysis += "- Heart rate is within normal range.\n"
        }

        // Check blood pressure
        const [systolic, diastolic] = bp.split("/").map(Number)
        if (systolic > 140 || diastolic > 90) {
          analysis += "- Blood pressure is elevated above normal range.\n"
        } else if (systolic < 90 || diastolic < 60) {
          analysis += "- Blood pressure is below normal range.\n"
        } else {
          analysis += "- Blood pressure is within normal range.\n"
        }

        // Check glucose
        if (glucose > 140) {
          analysis += "- Glucose level is elevated above normal range.\n"
        } else if (glucose < 70) {
          analysis += "- Glucose level is below normal range.\n"
        } else {
          analysis += "- Glucose level is within normal range.\n"
        }

        return analysis
      } catch (error) {
        console.error("Error analyzing health data:", error)
        return "Failed to analyze health data"
      }
    },
  })
}

// Health Monitor Agent
export const createHealthMonitorAgent = async () => {
  const model = configureModel()

  const tools = [
    createHealthMonitorTool(),
    // Add more health-related tools as needed
  ]

  const prompt = PromptTemplate.fromTemplate(`
    You are a Health Monitoring Agent for an elderly care system.
    Your goal is to analyze health data and provide insights.
    
    {input}
    
    Think step by step to determine the best course of action.
  `)

  const agent = await createReactAgent({
    llm: model,
    tools,
    prompt,
  })

  return AgentExecutor.fromAgentAndTools({
    agent,
    tools,
    verbose: true,
  })
}

// Define similar functions for other agent types
// Activity Monitor Agent, Reminder Agent, Emergency Alert Agent, Social Agent
