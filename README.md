# EdTech Task Manager

A full-stack task management application tailored for the EdTech ecosystem.  
It helps **students, mentors, and educators** organize tasks, track progress, and manage day-to-day learning activities in a clean, simple UI.



##  Features

- ✅ **User Authentication**
  - Register, login, and secure access to personal task boards.
- 📝 **Task Management**
  - Create, update, delete tasks.
  - Set status (e.g., Pending, In-Progress, Completed).
- 🎯 **EdTech-Focused Workflow**
  - Tasks aligned to courses, modules, or learning goals.
- 🔍 **Filter & Search (if implemented)**
  - Quickly find tasks based on title, status, or due date.
- 📱 **Responsive UI**
  - Optimized for desktop; works on mobile/tablet with responsive layout.
- 🔐 **Secure Backend**
  - API endpoints protected for authenticated users only.

# DashBoards
<img width="1366" height="1029" alt="Screenshot 2025-11-19 230254" src="https://github.com/user-attachments/assets/61e7cbf3-57ed-413d-82ba-43ce255dccc2" />

# Login Page 
<img width="990" height="933" alt="Screenshot 2025-11-19 230354" src="https://github.com/user-attachments/assets/81638018-98d9-48a0-a98b-2d34e89413f4" />



## 🧰 Tech Stack

**Frontend (TakeHome folder)**  
- React (or similar JS framework)
- HTML, CSS
- Fetch/Axios for API calls

**Backend (Backend folder)**  
- Node.js  
- Express.js  
- RESTful API architecture

👥 Role Functionality & Access Logic
👨‍🎓 Student Role
Create personal tasks
Update task status
Delete tasks
View only their own dashboard

👨‍🏫 Teacher Role
Teachers have read-only access to student tasks.
✔ Teacher Task-View Logic:
Teachers can:
View all students’ tasks
Track progress (Pending → Completed)
Monitor activity to help students improve
Teachers cannot:
Edit student tasks
Delete student tasks
Change student accounts
This ensures data integrity & a safe workflow.

🤖 AI Assistance Disclosure:
This project includes AI assistance for selected features such as recommendations, summaries, or smart suggestions. AI does not override user decisions and is used only to improve productivity.

🧩 API Overview (Update based on your backend routes)
Examples:
Auth Routes
POST /api/auth/register — Create user
POST /api/auth/login — Login & get JWT

Task Routes
GET /api/tasks — Fetch tasks
POST /api/tasks — Create task
PUT /api/tasks/:id — Update task
DELETE /api/tasks/:id — Delete task

🪲 Known Issues
⚠ UI misalignment: Login/register not centered
⚠ Black background overlay hiding tasks due to CSS conflict
⚠ Tasks not loading when token not sent in headers

🚀 Suggestions for Improvement
✨ Add responsive design for mobile/tablet
✨ Improve UI with cleaner theme
✨ Add analytics for teachers
✨ Add deadline reminders
✨ Integrate AI for smart suggestions
✨ Deploy frontend + backend:
Backend → Render / Railway
Frontend → Vercel / Netlify
Database → MongoDB Atlas / PlanetScale
