# Nextwork System – Frontend

## Introduction

The **Nextwork Internal Messaging System** frontend provides an efficient and user-friendly communication platform for organizations and work teams. Built with modern web technologies, it optimizes information exchange, minimizes errors, and fosters a cohesive, flexible work environment.

## Key Features

### 👤 User Features

**Registration & Authentication**

* Register new accounts with email verification
* Secure login with email/password  
* OAuth integration (Google, Auth0)

**Workspace Management**

* Create or join workspaces (projects, teams, departments)
* View and manage joined/owned workspaces

**Messaging & Communication**

* Personal messaging (Direct Messages)
* Group messaging (Channel Messages)
* Support for text, emojis, images, and file attachments
* Chat history and keyword search
* Message reactions, editing, and deletion

**Personal Profile**

* View and edit profile information (name, avatar, description, title)
* Password management

**AI Assistant**

* Chat with AI Assistant powered by Azure OpenAI
* Get system usage guidance and work-related support

**Notifications**

* Real-time notifications for messages, invitations, and workspace updates

### 💼 Workspace Administrator

**Channel Management**

* Create, edit, and delete group channels
* Organize channels by topic, project, or department

**Member Management**

* Invite new users via email
* Assign workspace roles (member, admin)
* Remove users from workspace
* Monitor workspace activities

### 📢 Channel Administrator

**Channel Operations**

* View current channel members
* Manage member roles within channels
* Remove users from specific channels

### 👑 System Administrator

**Dashboard Overview**

* Comprehensive view of managed users and workspaces

**System-Wide User Management**

* View all system users
* Lock/unlock user accounts
* Update user access rights and system roles

**System-Wide Workspace Management**

* Monitor, create, and delete workspaces across the system

## Technology Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Frontend Framework** | ReactJS | Dynamic user interface development |
| **Build Tool** | Vite | Fast and lightweight build system |
| **Styling** | TailwindCSS | Utility-first CSS framework |
| **HTTP Client** | Axios | Promise-based API requests |
| **Real-time** | Socket.IO Client | Real-time communication |
| **Language** | TypeScript | Type-safe JavaScript development |
| **State Management** | Redux Toolkit | Global application state |
| **Authentication** | Auth0 | User authentication and authorization |
| **Containerization** | Docker | Application packaging and deployment |
| **CI/CD** | GitHub Actions | Automated deployment pipeline |
| **Web Server** | Nginx | High-performance web server and load balancer |
| **Hosting** | Azure App Service / Static Web Apps | Cloud hosting platform |

## Quick Start

### Prerequisites

* **Node.js** (version 18.x or higher)
* **npm** or **Yarn** package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/nextwork-frontend.git
   cd nextwork-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory with the following variables:
   ```env
   VITE_BACKEND_API_URL="http://localhost:8099/api"
   VITE_SOCKET_URL="http://localhost:8099"
   VITE_AUTH0_DOMAIN="dev-sss.us.auth0.com"
   VITE_AUTH0_CLIENT_ID="your-auth0-client-id"
   ```
   
   **Note:** Replace `http://localhost:8099` with your actual backend URL if deployed elsewhere.

### Running the Application

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Running with Docker

You can also run the application using Docker:

1. **Build the Docker image**
   ```bash
   docker build -t nextwork-frontend .
   ```

2. **Run the container**
   ```bash
   docker run -p 8080:80 nextwork-frontend
   ```

The application will be available at `http://localhost:8080`.

## Deployment

The frontend is automatically deployed using **GitHub Actions** to **Azure App Service** or **Azure Static Web Apps**. The deployment process uses Docker containerization with **Nginx** as the web server to ensure consistent environments from development to production with high performance and load balancing capabilities.

### Deployment Pipeline

1. Code push triggers GitHub Actions
2. Docker image is built and tested
3. Application is deployed to Azure infrastructure
4. Production environment is updated

## Contributing

We welcome contributions to improve the Nextwork system!

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

* Follow TypeScript best practices
* Maintain consistent code style with existing codebase
* Write meaningful commit messages
* Test your changes thoroughly

## Support

For questions, issues, or suggestions, please:

* Contact the development team
* Check the documentation for common solutions
