import './App.css';
import AiParser from './components/AiParser/AiParser';
import ContactManager from './components/ContactManager/ContactManager';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';

const  App = () => {
  return (
    <>
      <AiParser/>
      <ContactManager/>
      <ThemeToggle/>
    </>
  );
};

export default App;
