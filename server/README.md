# Cormex Control de Rutas - Server

## Database Configuration

The server connects to a PostgreSQL database with the following configuration:

- Database: Cormex_DB
- Host: localhost (connects to the PostgreSQL Docker container)
- User: postgres
- Password: controlRutas2025
- Port: 5432

## Setup Instructions

1. Install dependencies:
```bash
cd server
npm install
```

2. Create a `.env` file in the server directory with the following content:
```
DB_USER=postgres
DB_HOST=localhost
DB_NAME=Cormex_DB
DB_PASSWORD=controlRutas2025
DB_PORT=5432
PORT=3000
```

3. Test the database connection:
```bash
node src/test-connection.js
```

4. Start the server:
```bash
npm run dev
```

5. Access the test endpoint at:
```
http://localhost:3000/api/test-db
```

## API Endpoints

- `GET /api/health`: Basic health check endpoint
- `GET /api/test-db`: Test database connection 