# rl-frontend

Frontend for [real-calendar](https://github.com/j0a0castr0/real-calendar), a paused proof of concept for booking house visits based on an agent's real availability.

- **Agents** log in (AWS Cognito), manage listings and availability slots, and see their upcoming visits grouped by day.
- **Buyers** use a public booking page to pick a free slot and book a visit.

**Stack:** React 18, TypeScript, React Router. Hosted on S3, with CloudFormation and a GitHub Actions workflow for deployment (`aws/`, `.github/`). The live app is gatolizo.click, behind a login.

## Running it locally

```bash
npm install
npm start
```

Set `REACT_APP_API_BASE_URL` in `.env` to point to the real-calendar API.
