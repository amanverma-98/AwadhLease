# RentPilot AI Backend

Production-ready FastAPI backend for an AI-native property management SaaS platform.

## Requirements

- Python 3.12+
- MongoDB 6+

## Setup

1. Create a virtual environment and install dependencies:

```bash
python -m venv .venv
# PowerShell
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

2. Copy environment variables:

```bash
Copy .env.example to .env and update values.
```

Cloudinary is required for image uploads. Provide either `CLOUDINARY_URL` or the key/name/secret trio.

3. Run the API:

```bash
uvicorn app.main:app --reload
```

## Docker

```bash
docker build -t rentpilot-ai .
docker run --env-file .env -p 8000:8000 rentpilot-ai
```

## Seeding

- Insert seed data via MongoDB Compass or the Mongo shell for collections: properties, tenants, maintenance_tickets, payments.

## Key Endpoints

- `GET /health`
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `GET /auth/me` (current user profile, role, tenant/property IDs)
- `GET /properties` (marketplace search + filters)
- `GET /properties/{id}`
- `POST /maintenance`
- `POST /chat`
- `GET /analytics`
- `POST /ai/tenant-risk`
- `POST /ai/occupancy`
- `POST /ai/payment-delay`
- `GET /notifications`
- `POST /bookings`

## WebSockets

- `ws://localhost:8000/ws/notifications/{user_id}`
## Notes

- Uses async Motor + Beanie ODM for MongoDB.
- Gemini API access is required for AI agent workflows.
- Seed data can be inserted via MongoDB shell or a custom script.
