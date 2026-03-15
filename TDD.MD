# TDD — Japan Hospital Finder Agent

## Objective 
Create the smartest and intelligent Doc Hunter Multi-agentic solution, reliable, effective.

## Framework
- Langchain 
- Langgraph
- supabase
- typescript
- React
- Vite
- Vercel
- Docker

## LLM Models
- OpenAi GPT 5.4 
- Opus 4.6


## Multi-agent architecure design
Using Supervisor agent design pattern. 
Main agent - Supervisor agent (OpenAI 5.4)
Symptom analyse agent - (openAI, Gemini, Antropic, KIMI K2)
Hospitals and Clinics lookup agent - (openAI, Gemini, Antropic, KIMI K2)


## Agents
Main Agent - Analyse the user input and assing tasks to sub-agents and review and ouput the final result to user
Symtpom agent - Response to analyse the patient's symptom to summary it and decide what hospital or clinic to book.
Look up agent - Response to look up the nearest and available hospital whose approriately according to the symptom. The Look up agent will intelligently communicate with the hospital and clinic to mention the current situation and urgency. 



