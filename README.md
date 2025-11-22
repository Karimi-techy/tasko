# Tasko - Task Marketplace Platform

A modern task marketplace connecting clients with skilled workers in Kenya.

## 🌟 Features

### For Clients
- 📝 Post tasks with descriptions and pricing
- 🔍 Find verified workers
- 💳 Secure M-PESA payments with escrow
- ⭐ Rate and review workers
- 📊 Track task progress

### For Workers
- 🔎 Browse available tasks
- 📍 Location-based task discovery
- 💼 Build your reputation
- 💰 Guaranteed payments
- 🏆 Earn badges and ratings

## 🛠️ Tech Stack

**Frontend:** React, React Router, Axios
**Backend:** Node.js, Express, MongoDB, Mongoose
**Authentication:** JWT
**Payment:** M-PESA Integration (Mock)

## 📦 Installation

### Prerequisites
- Node.js (v14+)
- MongoDB
- npm or yarn

### Backend Setup
```bash
cd backend
npm install

# Create .env file
echo "MONGO_URI=mongodb://localhost:27017/tasko" > .env
echo "JWT_SECRET=your_secret_key_here" >> .env
echo "PORT=5000" >> .env

# Start server
npm start
```

### Frontend Setup
```bash
cd frontend
npm install

# Start development server
npm start
```

The app will run on:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 📁 Project Structure
```
tasko/
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── context/      # Auth context
│   │   └── App.js
│   └── package.json
├── backend/           # Express backend
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   └── server.js
└── README.md
```

## 🔐 Environment Variables

**backend/.env:**
```env
MONGO_URI=mongodb://localhost:27017/tasko
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

## 🚀 Usage

1. Register as a Client or Worker
2. **Clients:** Create tasks with details, location, and pricing
3. **Workers:** Browse and accept available tasks
4. **Clients:** Deposit payment via M-PESA
5. **Workers:** Complete the task
6. **Clients:** Review and release payment

## 📸 Screenshots

(Add screenshots here)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License

## 👨‍💻 Author

Built with ❤️ by [Karimi-techy](https://github.com/Karimi-techy)

## 🔗 Links

- [GitHub Repository](https://github.com/Karimi-techy/tasko)
- [Live Demo](#) (Coming soon)
