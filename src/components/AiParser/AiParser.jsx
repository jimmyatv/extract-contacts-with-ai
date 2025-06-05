import './AiParser.css'
import { useState, useEffect } from 'react'

const AiParser = () => {
    const [note, setNote] = useState('');
    const [showExample, setShowExample] = useState(true);

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
                <button className="btn btn-primary">Extract contact</button>
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
