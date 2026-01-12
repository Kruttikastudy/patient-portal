# Patient Portal – Runbook

## Requirements
- Node.js 18+
- MongoDB instance (local or hosted)
- Two terminal windows/tabs (one for the backend, one for the frontend)

## 1. Configure Environment Variables
Create `backend/.env`:
```
MONGO_URI=mongodb://<username>:<password>@<host>:<port>/<db>
CLIENT_ORIGIN=http://localhost:3000   # optional, defaults to localhost:3000
PORT=5000                             # optional
```

Create `.env` at the project root **only if** your API runs on a custom URL:
```
REACT_APP_API_BASE_URL=http://localhost:5000
```

## 2. Install Dependencies
```bash
npm install            # installs frontend dependencies
cd backend && npm install
```

## 3. Run the Backend (terminal window #1)
```bash
npm run backend        # runs `npm run dev` inside backend/
```
This starts nodemon on `http://localhost:5000` (or the `PORT` you set). Keep it running.

## 4. Run the Frontend (terminal window #2)
```bash
npm run frontend       # same as react-scripts start
```
The React dev server will open at `http://localhost:3000` and proxy API calls to the backend URL.

## 5. Login Data
The login expects:
- **Username**: patient’s first name (case-insensitive)
- **Password**: Mongo `_id` of that patient document

Seed the `patients` collection and share each patient’s `_id` with them, or adapt the auth logic to a different credential scheme.

## Useful Scripts
| Command            | Description                               |
|--------------------|-------------------------------------------|
| `npm run backend`  | Start backend in dev mode (nodemon)       |
| `npm run backend:start` | Start backend with `node server.js` |
| `npm run frontend` | Start React dev server (also `npm start`) |
| `npm run build`    | Build production React bundle             |
| `npm test`         | CRA test runner                           |
