# Local Database Setup Guide

It seems you have pgAdmin 4 installed but might only be connected to a remote database. This guide will help you refer to your **local** PostgreSQL installation.

## Step 1: Check for Local Server in pgAdmin 4

1.  Open **pgAdmin 4**.
2.  Look at the "Servers" list on the left sidebar.
3.  Do you see a server named "PostgreSQL 16" (or 15, 14, etc.)?
    *   **YES**: Expand it. If it asks for a password, try the one in your `.env` file: `ASharish_18052005`.
    *   **NO**: You need to register your local server.

### How to Register Local Server (if missing)
1.  Right-click on **Servers** -> **Register** -> **Server...**
2.  **General** tab:
    *   Name: `Localhost`
3.  **Connection** tab:
    *   Host name/address: `localhost`
    *   Port: `5432`
    *   Maintenance database: `postgres`
    *   Username: `postgres`
    *   Password: `ASharish_18052005` (Copy this exactly)
    *   Save password? [x] Yes
4.  Click **Save**.

> **Note:** If connection fails with "Connection refused", it means **PostgreSQL is not installed** or **not running** on your actual computer. pgAdmin is just a viewer; it needs the database engine installed separately.
>
> If you don't have PostgreSQL installed, download it here: [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)

---

## Step 2: Create the Database

Once you are connected to your Localhost server:

1.  Right-click on **Databases**.
2.  Select **Create** -> **Database...**
3.  **General** tab:
    *   Database: `portfolio_db`
4.  Click **Save**.

---

## Step 3: Verify Connection

1.  Go back to your code editor terminal.
2.  Run the command:
    ```bash
    npm start
    ```

3.  If successful, you will see:
    > 🚀 Starting Database Deployment...
    > ...
    > Server running on http://localhost:3000

---

## Troubleshooting

-   **Error: `password authentication failed`**
    -   Your local database has a different password than `ASharish_18052005`.
    -   **Fix**: Update the `DATABASE_URL` in your `.env` file with the correct password.

-   **Error: `database "portfolio_db" does not exist`**
    -   You didn't complete Step 2. Go back and create the database in pgAdmin.

-   **Error: `connect ECONNREFUSED 127.0.0.1:5432`**
    -   The PostgreSQL service is not running.
    -   Open Windows Services (Win+R -> `services.msc`), find `postgresql-x64-16`, and right-click -> **Start**.
