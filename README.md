# 🌿 Grove Social App

A modern social media web application built with **React** and **Vite**, designed to provide a smooth and interactive social networking experience.

Grove focuses on a clean, modern UI with responsive layouts, reusable components, and a scalable frontend architecture.

---

## 🚀 Features

- 🔐 User Authentication
  - Sign Up
  - Sign In
  - Form validation
  - Password validation

- 📝 Posts
  - Create posts
  - View posts
  - Like posts
  - Comment on posts
  - Share posts
  - Bookmark posts
  - Delete and edit posts

- 👤 User Profiles
  - View user information
  - Profile photos
  - User posts
  - Follow / Unfollow functionality

- 🔔 Notifications & Alerts
  - Toast notifications using Sonner
  - Interactive alerts using SweetAlert2

- 📱 Responsive Design
  - Desktop
  - Tablet
  - Mobile

- 🎨 Modern UI
  - Tailwind CSS
  - Font Awesome
  - Lucide Icons
  - Poppins Font

---

## 🛠️ Technologies Used

### Frontend

- **React 19**
- **React Router**
- **Vite**
- **Tailwind CSS**
- **Axios**

### Forms & Validation

- **Formik**
- **Yup**

### UI & Icons

- **Tailwind CSS**
- **Font Awesome**
- **Lucide React**
- **Sonner**
- **SweetAlert2**
- **Typewriter Effect**
- **Poppins**

### Development Tools

- **ESLint**
- **Git & GitHub**
- **gh-pages**

---

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/your-username/grove-social-app.git
```

Navigate to the project:

```bash
cd grove-social-app
```

Install dependencies:

```bash
npm install
```

---

## 💻 Running the Project

Start the development server:

```bash
npm run dev
```

The application will be available at the local Vite development URL.

---

## 🏗️ Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 🚀 Deployment

The project is configured to be deployed using **GitHub Pages**.

Run:

```bash
npm run deploy
```

The `predeploy` script automatically runs the production build before deployment.

---

## 📜 Available Scripts

| Command           | Description                      |
| ----------------- | -------------------------------- |
| `npm run dev`     | Start development server         |
| `npm run build`   | Create production build          |
| `npm run preview` | Preview production build         |
| `npm run lint`    | Run ESLint                       |
| `npm run deploy`  | Build and deploy to GitHub Pages |

---

## 📂 Project Structure

```text
grove-social-app/
│
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── context/
│   ├── hooks/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
│
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

> The exact folder structure may vary depending on the current project implementation.

---

## 🔌 API

Grove communicates with a backend REST API to handle application data and user interactions.

Axios is used to make HTTP requests between the frontend and backend.

Example:

```javascript
import axios from "axios";

const response = await axios.get("API_ENDPOINT");
```

---

## 🔐 Environment Variables

If the project uses environment variables, create a `.env` file in the project root:

```env
VITE_API_URL=your_api_url
```

Then access it in the application using:

```javascript
const API_URL = import.meta.env.VITE_API_URL;
```

> Never commit sensitive API keys, tokens, or private credentials to GitHub.

---

## 🎯 Project Goals

Grove was built to practice and demonstrate modern frontend development concepts, including:

- React component architecture
- React Hooks
- Client-side routing
- REST API integration
- Authentication
- Form handling
- Form validation
- State management
- Responsive UI development
- Reusable components
- Modern CSS and Tailwind CSS
- Git and GitHub workflow
- Production deployment

---

## 📸 Screenshots

Add screenshots of the application here:

```text
screenshots/
├── home.png
├── login.png
├── signup.png
├── profile.png
└── post.png
```

---

## 🔮 Future Improvements

- 💬 Real-time chat
- 🔔 Real-time notifications
- 🌙 Dark mode
- 🔎 Advanced search
- 📸 Stories
- 🎥 Video posts
- 📊 User analytics
- ⚡ Performance optimization
- 🔒 Improved authentication and security
- 📱 Progressive Web App (PWA)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

If you'd like to contribute:

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature/your-feature
```

3. Make your changes
4. Commit your changes

```bash
git commit -m "Add: your feature"
```

5. Push the branch

```bash
git push origin feature/your-feature
```

6. Open a Pull Request

---

## 📄 License

This project is currently available for educational and portfolio purposes.

---

## 👨‍💻 Author

**Yassen Samer**

Frontend Developer & Computer Science Student

Built with ❤️ and 🌿
