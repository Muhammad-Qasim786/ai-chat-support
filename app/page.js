"use client"
import { Box, Stack, TextField, Button, Typography } from "@mui/material";
import { useState, useRef, useEffect } from "react"

export default function Home() {
  const [history, setHistory] = useState([])
  const firstMessage = "I am A-Train, your personal guide to staying 'locked in'. I am here to provide you with the motivation, guidance, and actionable advice you need to stay focused on your goals. Let me know how I can help you today."
  const messagesEndRef = useRef(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  useEffect(() => {
    scrollToBottom()
  }, [history])

  const [historyInput, setHistoryInput] = useState("")

  const sendMessage = async () => {
    setHistoryInput('')
    setHistory((history) => [...history, { role: 'user', parts: [{ text: historyInput }] }])

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([...history, { role: 'user', parts: [{ text: historyInput }] }])
    })
    const data = await res.json()
    setHistory((history) => [...history, { role: 'model', parts: [{ text: data }] }])


  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >

        <Stack
          direction={'column'}
          width="400px"
          height="700px"
          spacing={2}
          borderRadius={15}
          border="10px solid black"
          p={2}>

          <Stack
            direction={'column'}
            spacing={1}
            flexGrow={1}
            overflow="auto"
            maxHeight={"100%"}
          >
            <Box
              display={"flex"}
              justifyContent="flex-start"
              bgcolor={'secondary.main'}
              borderRadius={11}
              maxWidth={"70%"}
              p={2}
            >
              <Typography
                justifyContent={"flex-start"}
                bgcolor={'secondary.main'}
                color="white"
                maxWidth={"100%"}
              >
                {firstMessage}
              </Typography>

            </Box>
            {history.map((textObject, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={textObject.role === 'user' ? 'flex-end' : 'flex-start'}
              >
                <Box
                  bgcolor={textObject.role === 'user' ? 'primary.main' : 'secondary.main'}
                  color="white"
                  borderRadius={16}
                  p={3}
                  maxWidth={"70%"}
                >
                  {textObject.parts[0].text}

                </Box>
              </Box>
            ))
            }
            <div ref={messagesEndRef} />

          </Stack>
          <Stack direction={'row'} spacing={2} display={"flex"} alignItems={"center"} justifyContent={"center"}>
            <TextField

              fullWidth
              label="Message"
              value={historyInput}
              onChange={(e => setHistoryInput(e.target.value))}
              onKeyDown={(ev) => { if (ev.key === 'Enter') sendMessage() }}
            />
            <Button variant="contained" onClick={sendMessage}
            >
              Send</Button>
          </Stack>
        </Stack>
      </Box >
  );
}
