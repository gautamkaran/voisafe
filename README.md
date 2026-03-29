# VoiSafe

## Run With Docker

This project now includes Docker support for:
- `mongo` (MongoDB)
- `backend` (Node/Express API)
- `frontend` (Vite build served by Nginx)

### Prerequisites
- Docker Desktop (with Compose support)

### Start Everything

From the project root, run:

```bash
docker compose up --build
```

### Access
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`
- MongoDB: `mongodb://localhost:27017/voisafe`

### Stop

```bash
docker compose down
```

To also remove MongoDB data volume:

```bash
docker compose down -v
```
