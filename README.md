# Remote Attendance Tracker

![CI/CD](https://github.com/NiteeshL/remote-attendance-tracker/actions/workflows/main.yml/badge.svg)
[![Docker](https://img.shields.io/docker/pulls/niteesh0303/attendance-tracker-frontend.svg)](https://hub.docker.com/r/niteesh0303/attendance-tracker-frontend)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A Discord-based attendance tracking system with voice channel monitoring and real-time reporting.

## 🌟 Features

- Discord OAuth2 Integration
- Real-time Voice Channel Tracking
- Attendance Reports & Analytics
- Admin Dashboard
- User Activity Monitoring
- AWS EKS Deployment
- CI/CD with GitHub Actions

## 🛠️ Tech Stack

- **Frontend:** React, TailwindCSS, DaisyUI
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Infrastructure:** AWS EKS, Docker
- **CI/CD:** GitHub Actions
- **Bot:** Discord.js

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Discord Application & Bot Token
- MongoDB Atlas Account

### Local Development
```bash
# Clone the repository
git clone https://github.com/NiteeshL/remote-attendance-tracker.git
cd remote-attendance-tracker

# Install dependencies
npm install
cd frontend && npm install
cd ../backend && npm install

# Set up environment variables
cp .env.example .env

# Start development servers
docker-compose up --build
```

## 🌐 Kubernetes Deployment

```bash
# Update kubeconfig
aws eks update-kubeconfig --name attendance-tracker

# Apply Kubernetes configurations
kubectl apply -f k8s/
```

## 🔑 Environment Variables

Required environment variables:
- `DISCORD_CLIENT_ID`: Discord OAuth application ID
- `DISCORD_CLIENT_SECRET`: Discord OAuth secret
- `DISCORD_BOT_TOKEN`: Discord bot token
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT authentication

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contact

Niteesh L  
Email: niteeshleela@gmail.com  GitHub: [NiteeshL](https://github.com/NiteeshL)

Arunabha Jana  
Email: arunabhajana@gmail.com  GitHub: [arunabha](https://github.com/arunabhajana)
