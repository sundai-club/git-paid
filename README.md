# GitHub Bounty Platform

This full-stack web application allows GitHub repository owners to create bounties on issues and incentivize developers to contribute fixes. Bounties are held in escrow using the **Radius API** for secure payment release upon completion.

## Features

- **GitHub OAuth Login**: Users authenticate via GitHub (OAuth) to use the platform.
- **Bounty Creation**: Repository owners can create a bounty for any open GitHub issue in their repos by funding an escrow.
- **Bounty Listing**: Open bounties are publicly listed for developers to browse.
- **Claiming Bounties**: Developers claim a bounty (locking it for others) and work on the issue.
- **Approval & Payment**: Once a fix is merged (issue closed), the repo owner approves and the escrowed funds are released to the developer via Radius.
- **Escrow Management**: Funds are held, released, or refunded using the Radius payments API.

## Tech Stack

- **Backend**: Node.js + Express, Passport (GitHub OAuth), Prisma (PostgreSQL ORM), Axios (for GitHub & Radius API calls).
- **Frontend**: Next.js (React) for server-side rendering, TailwindCSS for UI styling, Axios for API calls.
- **Database**: PostgreSQL (via Prisma schema & client).
- **Payments**: Radius API for escrow and payments.
- **Deployment Targets**:
  - Frontend: Vercel (Next.js)
  - Backend: Railway or Render (Node.js service)
  - Database: Supabase or Railway PostgreSQL instance

## Getting Started

### Prerequisites
- **Node.js** and **npm** installed.
- A PostgreSQL database (local or cloud) for storing user and bounty data.
- A GitHub OAuth App set up (to obtain a Client ID and Client Secret).
- Radius API credentials for escrow (for testing, you can stub Radius API responses if needed).

### Installation
1. **Clone the repository** and navigate to the project directory.

2. **Configure environment variables**: Create a `.env` file in the root directory (as shown above) with the required keys:
   - GitHub OAuth credentials (`GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GITHUB_CALLBACK_URL`).
   - A JWT secret (`JWT_SECRET`) for signing authentication tokens.
   - Radius API URL and key (`RADIUS_API_URL`, `RADIUS_API_KEY`).
   - Your Postgres `DATABASE_URL`.
   - The frontend URL and API base (`FRONTEND_URL`, `NEXT_PUBLIC_API_BASE`).
   
3. **Install backend dependencies**:
   ```bash
   cd backend
   npm install
   ```
   
4. **Install frontend dependencies**:
   ```bash
   cd ../frontend
   npm install
   ```

5. **Set up the database**:
   - Update the `DATABASE_URL` in the `.env` with your Postgres connection string.
   - Run Prisma migrations to create tables:
     ```bash
     npx prisma migrate dev --name init
     ```
     This will create the `User` and `Bounty` tables as defined in `prisma/schema.prisma`.

### Running the Development Servers

**Backend** (Express API):
```bash
cd backend
npm run dev    # Starts the Express server on port 5000 (with nodemon)
```

**Frontend** (Next.js app):
```bash
cd frontend
npm run dev    # Starts the Next.js dev server on port 3000
```

Ensure the backend (http://localhost:5000) and frontend (http://localhost:3000) are running. The frontend is configured to call the backend API via `NEXT_PUBLIC_API_BASE`.

### Usage

1. Open the frontend in your browser: **http://localhost:3000**.  
2. Click "Login with GitHub". You will be redirected to GitHub to authorize the OAuth App. After authorizing, GitHub will redirect back to the app.
3. On successful login, you will land on the **Dashboard**:
   - **Dashboard**: Displays your posted bounties and any bounties you have claimed. From here you can navigate to:
     - **Create Bounty**: Fill in repository owner, repo name, issue number, and bounty amount to create a new bounty. The app will verify the issue via GitHub API and lock the funds via Radius.
     - **Browse Bounties**: View all open bounties posted by others. You can claim any open bounty which will assign it to you.
     - **Review**: (Visible to repo owners) See bounties you posted that have been claimed and are awaiting approval. Once you verify the issue is fixed (the GitHub issue is closed), you can release the funds to the developer.
   - **Logout**: Clears your session and token.

4. **Claiming a Bounty (Developer workflow)**:
   - Go to "Browse Bounties". A list of open issues with bounties (repository, issue number, amount) will be shown.
   - Click "Claim" on an issue you want to work on. The bounty will be marked as claimed (and no longer visible to others).
   - The platform (optionally) comments on the GitHub issue to indicate it's being worked on.
   - Work on the issue, submit a pull request on GitHub, and get it merged by the repo maintainer.

5. **Approving a Bounty (Repo owner workflow)**:
   - Once the issue is resolved/closed on GitHub, go to "Review" page on the platform.
   - You will see the list of your claimed bounties pending approval. Click "Release" to approve the solution.
   - The backend verifies the issue is closed via GitHub API, then calls the Radius API to release the escrowed funds to the developer.
   - The bounty status updates to **COMPLETED** and will no longer appear in active lists.

6. **Cancelling a Bounty**:
   - If a bounty needs to be withdrawn (no one has claimed it or the developer failed to deliver), the repo owner can cancel it. This triggers a refund via Radius back to the owner's account and marks the bounty as **CANCELLED**.
   - (In this app, cancellation is implemented via an API route, but no dedicated UI button is provided. It can be invoked with a proper API call if needed.)

### Project Structure

The repository is divided into a `backend` and `frontend` directory:
- **backend**: Node/Express server, OAuth authentication, API endpoints, database models (Prisma), and Radius integration.
- **frontend**: Next.js React application with pages for login, dashboard, creating/claiming bounties, and review. Uses Axios to communicate with the backend API.

Key backend files: 
- `controllers/` (`authController.js`, `bountyController.js`) implement the logic for auth and bounty actions.
- `routes/` (`authRoutes.js`, `bountyRoutes.js`) define the API endpoints.
- `models/` (`userModel.js`, `bountyModel.js`) define database interactions via Prisma.
- `config/` (`database.js`, `radius.js`) handle DB connection and Radius API calls.
- `middleware/authMiddleware.js` protects routes using JWT authentication.
- `prisma/schema.prisma` describes the database schema for users and bounties.

Key frontend files:
- `pages/` (`index.js`, `dashboard.js`, `create-bounty.js`, `claim-bounty.js`, `review.js`, `auth/callback.js`) define the routes and main page components.
- `components/` (`Login.js`, `BountyList.js`, `CreateBountyForm.js`, `ClaimBounty.js`) are reusable UI components.
- `api/bounty.js` contains helper functions for calling backend API endpoints.
- Styling is done with TailwindCSS (see `styles/global.css` and Tailwind config).

### Deployment

For production deployment, you can:
- Deploy the **frontend** to Vercel (import the project, set `NEXT_PUBLIC_API_BASE` to your API URL in Vercel environment settings).
- Deploy the **backend** to a service like Railway or Render. Set environment variables in the hosting platform for all keys in the `.env`.
- Provision a Postgres database (Railway, Supabase, etc.) and run the Prisma migrations. Update the `DATABASE_URL` accordingly in backend configuration.
- Ensure the OAuth callback URL in your GitHub OAuth App is updated to the production URL (e.g., `https://yourapp.com/auth/github/callback`).

### Notes

- **Error Handling**: The application includes basic error handling. For example, attempting to create a bounty on a non-existent issue or without sufficient permissions will return an error message. Ensure to handle such errors on the frontend (this demo shows error messages on forms).
- **Security**: JWT tokens are stored in `localStorage` for simplicity. In a production environment, consider using HTTP-only cookies or more secure token storage. Always protect sensitive routes (we use `ensureAuth` middleware for API protection).
- **Radius API**: This app assumes the Radius API will accept our internal user IDs as account identifiers for escrow. In a real scenario, you might need to create/link Radius accounts for each user and store a Radius-specific account ID.
- **Improvement**: Implementing webhooks or periodic checks could automate moving bounties to "ready for payout" when an issue is closed, instead of relying on manual refresh.

Enjoy building and contributing to open-source with the GitHub Bounty Platform!
