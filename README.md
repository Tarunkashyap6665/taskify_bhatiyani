# Taskify - Todo App

Taskify is a simple, modern task manager with a FastAPI backend and a React + Vite + TypeScript frontend. It supports CRUD for tasks, filtering, search, sorting, and an analytics dashboard powered by Chart.js.

## Features

- **Task management**: create, read, update, delete
- **Filters & search**: status, priority, text search
- **Sorting**: by created date, due date, title, priority, status
- **Analytics**: weekly trends, status and priority distribution
- **Modern UI**: shadcn-style components, Framer Motion animations

## Tech Stack

### Frontend

- React with TypeScript
- shadcn/ui for UI components
- Chart.js for data visualization
- Framer Motion for animations
- Tailwind CSS for styling

### Backend

- FastAPI (Python)
- SQLite database
- SQLAlchemy ORM

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Python (v3.8 or higher)

### Installation

1. Clone the repository

```bash
git clone https://github.com/Tarunkashyap6665/taskify_bhatiyani.git
cd taskify_bhatiyani
```

2. Set up the frontend

```bash
cd frontend
npm install
```

3. Set up the backend

```bash
cd ../backend
pip install -r requirements.txt
```

### Running the Application

1. Start the frontend development server

```bash
cd frontend
npm run dev
```

2. Start the JSON server for development (optional)

```bash
cd frontend
npm run server
```

3. Start the backend server

```bash
cd backend
uvicorn main:app --reload
```

## Project Structure

```
├── backend/
│   ├── main.py          # FastAPI application
│   ├── models.py        # Database models
│   ├── database.py      # Database configuration
│   └── requirements.txt # Python dependencies
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API services
│   │   ├── types/       # TypeScript interfaces
│   │   └── App.tsx      # Main application component
│   ├── db.json          # JSON Server mock data
│   └── package.json     # Node.js dependencies
└── README.md
```

## Deployment

- Frontend: Deployed on Vercel
- Backend: Deployed on Render
