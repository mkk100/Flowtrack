# Flowtrack
---
Flowtrack is a social platform for knowledge workers to track and share their deep work sessions. It combines productivity tracking with social features like groups, leaderboards, and follower/following systems.

## Features

### Current Features
- **Main Feed:**
![Screenshot 2024-11-29 at 1 09 20 PM](https://github.com/user-attachments/assets/380cb19f-bb2b-4f42-8d1a-7a2b7bc3d520)


- **User Profiles with Followers and Followings:** Customizable user profiles.
![Screenshot 2024-11-29 at 1 10 46 PM](https://github.com/user-attachments/assets/bf20e491-eff7-43fb-9e1a-3cde32426557)

- **Groups and Leaderboards:** Join or create groups to compete on leaderboards for weekly deep work champions.
![Screenshot 2024-11-29 at 1 13 59 PM](https://github.com/user-attachments/assets/d8b50580-165e-416d-b3d1-3b15e42d41ab)


- **Authentication:** Secure user login and signup using [Clerk](https://clerk.dev/).
- **Built-in Deep Work Timer:** Track your focused work sessions and log them.

### Planned Features

- **Search Bar:** Search for groups and users.
- **Posts and Main Feed:** Share updates and see what others are working on.
- **Analytics:** Gain insights from your deep work logs.

---

## Technology Stack

### Frontend

- **Framework:** [Next.js](https://nextjs.org/)
- **CSS:** Tailwind CSS
- **Authentication:** Clerk

### Backend

- **Framework:** Node.js
- **ORM:** [Prisma](https://www.prisma.io/)
- **Database:** MySQL
- **API:** REST

### DevOps
- **Frontend Hosting**: Vercel
- **Hosting:** Railway
- **Database Hosting:** Railway (MySQL)

---

## Setup Guide

### Prerequisites

- [Node.js](https://nodejs.org/) installed
- [PostgreSQL](https://www.postgresql.org/) or [MySQL](https://www.mysql.com/) installed
- Clerk account for authentication

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/deepworktracker.git
   cd deepworktracker
   ```
