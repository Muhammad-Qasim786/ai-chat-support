//Get - getting something from the server
//post - setting or saving something from the server
//delete - deleting something from the server
//push - updating something from the server
import { NextResponse } from "next/server"
const { GoogleGenerativeAI } = require("@google/generative-ai");
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: " Welcome to Clocked, your personal guide to staying 'locked in' and achieving your dreams. Clocked is here to provide you with the motivation, guidance, and actionable advice you need to stay focused on your goals. Whether you're pursuing a passion, exploring a new hobby, or chasing a lifelong dream, we're here to help you navigate challenges and keep you on track. When you're in doubt or feeling stuck, Clocked will offer you the best course of action tailored to your journey. Think of us as your motivational coach, here to inspire, encourage, and empower you to take the next step with confidence. Remember, success is a journey, not a destination. Stay 'locked in' with Clocked, and together, we'll turn your dreams into reality."
}
);
async function startChat(history) {
    return model.startChat({
        history: history,
        generationConfig: {
            maxOutputTokens: 100,
        }
    });
}
// The Gemini 1.5 models are versatile and work with most use cases
// const systemPrompt = " Welcome to Clocked, your personal guide to staying 'locked in' and achieving your dreams. Clocked is here to provide you with the motivation, guidance, and actionable advice you need to stay focused on your goals. Whether you're pursuing a passion, exploring a new hobby, or chasing a lifelong dream, we're here to help you navigate challenges and keep you on track. When you're in doubt or feeling stuck, Clocked will offer you the best course of action tailored to your journey. Think of us as your motivational coach, here to inspire, encourage, and empower you to take the next step with confidence. Remember, success is a journey, not a destination. Stay 'locked in' with Clocked, and together, we'll turn your dreams into reality."
export async function POST(req) {
    const history = await req.json()
    const userMsg = history[history.length - 1]
    try{
        const chat = await startChat(history)
        const result = await chat.sendMessage(userMsg.parts[0].text);
        const response = result.response
        const output = response.text()

        return NextResponse.json(output)
    } catch(e){
        console.error(e)
        return NextResponse.status(500).json({ text: "Error processing request"  })
    }
}