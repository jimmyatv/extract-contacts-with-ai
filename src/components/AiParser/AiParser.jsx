import './AiParser.css'
import { useState, useEffect } from 'react';
import { BsStars } from "react-icons/bs";
import { toast } from 'react-toastify';

const AiParser = ({ setContactsData }) => {
  const [note, setNote] = useState('');
  const [showExample, setShowExample] = useState(true);
  const [isExtracting, setIsExtracting] = useState(false);

  const exampleNote = `Today I had an interview with Alexandar Rasic. His email is rasic.alexandar@gmail.com, and his phone number is +381628684444. He successfully passed the first interview, and we scheduled the next one for June 20, 2025.`;

  //Example  click
  const handleExampleClick = () => {
    setNote(exampleNote);
    setShowExample(false);
  }

  //Show example
  useEffect(() => {
    if (note.trim() === '') {
      setShowExample(true);
    }
  }, [note]);

  // AI Parse
  const handleParse = async (e) => {
    e.preventDefault();

    setIsExtracting(true);

    try {
      const response = await fetch("http://localhost:8000/api/parse_ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: note }),
      });

      const data = await response.json();
      if (data.success) {
        const { first_name, last_name, phone, email } = data.data;

        if (!first_name && !last_name && !phone && !email) {
          toast.error("AI could not extract valid contact information.");
          setIsExtracting(false);
          return;
        }

        setContactsData(prev => [data.data, ...prev]);
        setNote('');
        toast.success("Contact has been added successfully");
      } else {
        console.error("Parsing error:", data.error);
        toast.error("Failed to parse contact.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("An error occurred while parsing.");
    } finally {
      setIsExtracting(false);
    }
  };




  return (
    <section className="ai-parser container">
      <div className='text-center'>
        <h1>Extract contacts with AI</h1>
        <p>Automatically extract and organize contact details from your meeting notes</p>
      </div>

      <div className="ai-form">
        <textarea
          className="form-control w-100 mb-3 pb-5"
          rows="4"
          placeholder="Add your meeting notes here..."
          value={note}
          onChange={e => setNote(e.target.value)}
          disabled={isExtracting}
        />
        <button
          onClick={handleParse}
          className="my-btn"
          aria-label='Parse AI'
          disabled={isExtracting}
        >
          <BsStars className='ai-icon me-1' />
          {isExtracting ? 'Extracting...' : 'Extract contact'}
        </button>
      </div>

      {showExample && (
        <div className="click-to-try text-start mt-4">
          <p className='mb-0'>Click to try this note</p>
          <button
            className='border border-secondary rounded-2 p-2'
            onClick={handleExampleClick}
            aria-label='Show example'
            disabled={isExtracting}
          >
            {exampleNote}
          </button>
        </div>
      )}

    </section>
  )
}

export default AiParser;
