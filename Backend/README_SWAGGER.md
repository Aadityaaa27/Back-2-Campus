Swagger UI

This backend has an OpenAPI spec at `openapi.yaml` and a Swagger UI mounted at `/docs`.

Setup

1. Install new dependencies from the `Backend` folder:

```bash
cd Backend
npm install
```

2. Start the server:

```bash
npm run dev
# or
npm start
```

3. Open the Swagger UI in your browser:

http://localhost:5000/docs

Notes

- `openapi.yaml` is generated from the frontend and lives in the `Backend` folder.
- If you add or update the spec, restart the server to refresh Swagger UI.
