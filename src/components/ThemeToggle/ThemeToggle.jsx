import { useEffect, useState } from 'react';
import './ThemeToggle.css';

const ThemeToggle = () => {
    const [theme, setTheme] = useState('light');

    //Local Storage
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        document.body.classList.toggle('dark-mode', savedTheme === 'dark');
    }, []);

    //Toggle theme
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.body.classList.toggle('dark-mode', newTheme === 'dark');
        localStorage.setItem('theme', newTheme);
    };

    return (
        <div className="darkLight-mode">
            <button className="btn btn-outline-secondary d-flex align-items-center gap-2" onClick={toggleTheme} aria-label='Theme toggler'>
                {theme === 'light' ? (
                    <>
                        <i className="bi bi-moon-fill"></i>
                    </>
                ) : (
                    <>
                        <i className="bi bi-sun-fill"></i>
                    </>
                )}
            </button>
        </div>
    );
};

export default ThemeToggle;
