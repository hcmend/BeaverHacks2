const express = require('express');
const fetch = require('node-fetch'); 
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/api/gemini', async (req, res) => {
    const { userMessage } = req.body;

    if (!userMessage) {
        return res.status(400).json({ error: 'User message is required' });
    }

    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: {
                    text: `Explain PEMDAS to a child: ${userMessage}`
                },
                temperature: 0.7,
                candidateCount: 1
            })
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error with Gemini API:', error);
        res.status(500).json({ error: 'Failed to fetch response from Gemini API' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});