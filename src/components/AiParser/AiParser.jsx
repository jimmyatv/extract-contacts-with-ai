import './AiParser.css'
import { useState, useEffect } from 'react';
import { BsStars } from "react-icons/bs";

const AiParser = () => {
    const [note, setNote] = useState('');
    const [showExample, setShowExample] = useState(true);
    const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

    const exampleNote = `Today I had an interview with Alexandar Rasic. His email is rasic.alexandar@gmail.com, and his phone number is +381628684444. He successfully passed the first interview, and we scheduled the next one for June 20, 2025.`;

    const handleExampleClick = () => {
        setNote(exampleNote);
        setShowExample(false);
    }

    useEffect(() => {
        if (note.trim() === '') {
            setShowExample(true);
        }
    }, [note]);

    const parseContactData = async (rawText) => {
  const prompt = `
Extract the following fields from this message:
- first_name
- last_name
- email
- phone
- company

Respond ONLY in valid JSON format.

Message:
"""${rawText}"""
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful assistant that extracts contact details from text." },
        { role: "user", content: prompt },
      ],
      temperature: 0,
    }),
  });

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  try {
    const parsed = JSON.parse(content);
    console.log(parsed);
    return parsed;
  } catch (err) {
    console.error("Invalid JSON from OpenAI:", content);
    return null;
  }
};

const handleParse = async () => {
  const parsedResult = await parseContactData(note); // note = your raw text

  if (!parsedResult) {
    console.error('Parsing failed or invalid JSON');
    return;
  }

  try {
    const response = await fetch('http://localhost:8000/api/parse_ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parsedResult),  // send parsed JSON directly
    });

    const data = await response.json();
    console.log('Insert response:', data);

    // Optionally update UI here, like clearing textarea or refreshing contacts list

  } catch (error) {
    console.error('Error sending parsed data:', error);
  }
};

    return (
        <section className="ai-parser container">
            <div className='text-center'>
                <h2>Extract contacts with AI</h2>
                <p>Automatically extract and organize contact details from your meeting notes</p>
            </div>

            <div className="ai-form">
                <textarea
                    className="form-control w-100 mb-3 fs-5 pb-5"
                    rows="4"
                    placeholder="Add your meeting notes here..."
                    value={note}
                    onChange={e => setNote(e.target.value)}
                />
                <button onClick={handleParse} className="my-btn"><BsStars className='ai-icon me-1' />Extract contact</button>
            </div>

            {showExample && (
                <div className="click-to-try text-start mt-4">
                    <p className='mb-0'>Click to try this note</p>
                    <button
                        className='border border-secondary rounded-2 p-2'
                        onClick={handleExampleClick}
                    >
                        {exampleNote}
                    </button>
                </div>
            )}

        </section>
    )
}

export default AiParser;
