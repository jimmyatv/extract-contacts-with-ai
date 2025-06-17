# Extract contacts with AI

## Project Overview
This project is built with React frontend and Laravel backend.  
CRUD operations are handled on the backend side, even though Laravel has built-in pagination, pagination is intentionally implemented on the frontend for more flexibility and variety.  

We used the latest technologies including ES6 arrow functions, asynchronous fetch, ternary operators, and modern variable declarations.  

For better UI and responsiveness on smaller screens, we integrated `react-swiper`.  
For notifications, `react-toastify` is used.  
Bootstrap is primarily used for modals and triggers.  

The project also features instant search and filters, and the Lighthouse performance score was optimized to near maximum.  

**Note:** XAMPP or a similar local server environment is recommended to run the Laravel backend if you want a smooth local development setup.

---

## Technologies
- **Backend:** Laravel 10, MySQL  
- **Frontend:** React (Functional Components, Hooks, ES6+)  
- **UI Libraries:** Bootstrap, react-swiper, react-toastify  
- **AI Parsing:** OpenAI GPT-4 API (used securely via backend)  
- **Communication:** REST API with JSON  
- **Security:** `.env` file contains sensitive keys, including OpenAI API key, and is included in `.gitignore` to avoid exposure.

---

## Setup Instructions

### Backend Setup
Clone the repo, install dependencies, configure `.env` with database and OpenAI key, and start the Laravel server.  
XAMPP (or similar local PHP & MySQL environment) is recommended to run the Laravel backend smoothly during local development.

### Frontend Setup
Install npm dependencies and start the React dev server.  
All calls to OpenAI are proxied through the backend API to keep keys secure.

---

## API Endpoints
____________________________________________________________________________________________________________________
| Method | Route              | Description                                                                        |
|--------|--------------------|------------------------------------------------------------------------------------|
| GET    | `/api/contacts`    | Fetch all contacts (no server-side pagination)                                     |
| POST   | `/api/add_contact` | Add a new contact                                                                  |
| PUT    | `/api/edit_contact`| Update an existing contact                                                         |
| POST   | `/api/parse_ai`    | Parse contact info from text and save to DB (calls OpenAI API securely on backend) |

---

## AI Parser Feature (Frontend)

- User inputs meeting notes in a textarea.  
- Text is sent to the backend API endpoint `/api/parse_ai`, which calls OpenAI GPT-4 API securely server-side to extract JSON fields:  
  `first_name`, `last_name`, `email`, `phone`, `company`.  
- Parsed JSON is then saved in the backend database.  
- This approach keeps the OpenAI API key hidden from the client.

---

## Architecture Notes

- Laravel backend uses API routes, Eloquent models, and standard CRUD operations.  
- React frontend uses functional components with hooks (`useState`, `useEffect`, `useRef`).  
- Communication is via RESTful JSON APIs.  
- OpenAI API key is stored securely in the backend `.env` file, which is excluded from git with `.gitignore`.  
- Pagination is fully handled on the frontend: the backend returns **all contacts at once without pagination**, and frontend slices and displays contacts per page.

---

## Pagination Details

- Backend returns all contacts without server-side pagination.  
- Pagination logic is implemented entirely on the frontend, dynamically generating pagination buttons and managing page changes locally for a flexible UI experience.

---

## Important Commands

```bash
# Backend
composer install
php artisan serve

# Frontend
npm install
npm start
