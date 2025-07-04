# Connectify 🌐

A modern social media platform built with Next.js that combines traditional social networking with innovative video chat features. Connect with friends, share content, and meet new people through anonymous video conversations.

## ✨ Features

### 🔐 User Management
- **User Authentication** - Secure login/logout system with Better-Auth
- **Profile Management** - Customizable user profiles with avatars, bio, and social links
- **Follow System** - Follow/unfollow users and build your network
- **User Statistics** - Track followers, following, and engagement metrics

### 📱 Social Features
- **Posts & Content** - Create, like, and share posts with image support
- **Comments** - Interactive comment system on posts
- **Bookmarks** - Save posts for later reading
- **Trending Topics** - Discover what's popular with hashtag tracking
- **User Suggestions** - Find new people to follow
- **Search** - Search for posts, users, and hashtags

### 🎥 Video Chat
- **Anonymous Matching** - Connect with random strangers safely
- **Preferences** - Set country, interest, and age preferences
- **Auto-Skip** - Automatically skip to next person
- **Reporting System** - Report inappropriate behavior
- **Real-time Chat** - Text messaging during video calls

### ⚙️ Settings & Customization
- **Theme Support** - Light, dark, and system themes
- **Accessibility** - Font size, reduced motion, high contrast options
- **Notifications** - Granular control over email and push notifications
- **Privacy Controls** - Manage profile visibility and interaction permissions

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Zustand** - Lightweight state management
- **Lucide React** - Beautiful icons

### Backend
- **PostgreSQL** - Robust relational database
- **Prisma** - Type-safe ORM with migrations
- **Better-Auth** - Modern authentication system
- **Zod** - Schema validation and type safety
- **bcryptjs** - Password hashing

### Infrastructure
- **Vercel** - Deployment and hosting
- **Database** - PostgreSQL (local or cloud)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and yarn
- PostgreSQL database (local or cloud)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd connectify
yarn install
```

### 2. Environment Setup
Copy the example environment file and configure it:
```bash
cp .env.example .env.local
```

Update `.env.local` with your configuration:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/connectify"

# Better Auth
BETTER_AUTH_SECRET="your-super-secret-key-change-this-in-production"
BETTER_AUTH_URL="http://localhost:3000"

# Social Auth (optional)
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 3. Database Setup

#### Option A: Local PostgreSQL
1. Install PostgreSQL on your system
2. Create a database: `createdb connectify`
3. Update the `DATABASE_URL` in `.env.local`

#### Option B: Cloud Database (Recommended)
Use a cloud PostgreSQL service like:
- **Supabase** (free tier available)
- **Neon** (serverless PostgreSQL)
- **Railway** (simple deployment)
- **PlanetScale** (MySQL alternative)

### 4. Run Database Migrations
```bash
# Generate Prisma client
npx prisma generate

# Run migrations to create tables
npx prisma migrate dev --name init

# Seed the database with sample data
npx prisma db seed
```

### 5. Start Development Server
```bash
yarn dev
```

Visit `http://localhost:3000` to see your app!

## 📁 Project Structure

```
connectify/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Database migrations
│   └── seed.ts               # Sample data seeding
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   ├── users/        # User management
│   │   │   ├── posts/        # Posts and social features
│   │   │   ├── search/       # Search functionality
│   │   │   ├── trending/     # Trending content
│   │   │   └── video-chat/   # Video chat sessions
│   │   ├── video-chat/       # Video chat page
│   │   └── page.tsx          # Home feed
│   ├── components/           # Reusable UI components
│   ├── stores/               # Zustand state management
│   ├── lib/
│   │   ├── auth.ts           # Better-Auth server config
│   │   ├── auth-client.ts    # Better-Auth client config
│   │   ├── db.ts             # Prisma client
│   │   ├── validations/      # Zod schemas
│   │   └── utils/            # Utility functions
│   └── generated/
│       └── prisma/           # Generated Prisma client
└── ...
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/sign-in` - User login
- `POST /api/auth/sign-up` - User registration
- `POST /api/auth/sign-out` - User logout

### Users
- `GET /api/users` - Get users list (with search)
- `PUT /api/users` - Update user profile
- `GET /api/users/[id]` - Get user profile
- `POST /api/users/[id]/follow` - Follow/unfollow user

### Posts
- `GET /api/posts` - Get posts feed
- `POST /api/posts` - Create new post
- `POST /api/posts/[id]/like` - Like/unlike post
- `POST /api/posts/[id]/bookmark` - Bookmark/unbookmark post

### Search & Discovery
- `GET /api/search` - Search posts, users, hashtags
- `GET /api/trending` - Get trending content and suggested users

### Video Chat
- `POST /api/video-chat/sessions` - Create video chat session
- `GET /api/video-chat/sessions` - Get active sessions

## 🔒 Authentication

The app uses **Better-Auth** for authentication, supporting:
- Email/password authentication
- Social login (GitHub, Google)
- Session management
- Email verification
- Password reset

## 📊 Database Schema

The database includes these main entities:
- **Users** - User accounts and profiles
- **Posts** - User-generated content
- **Comments** - Post comments and replies
- **Likes** - Post and comment likes
- **Follows** - User relationships
- **Bookmarks** - Saved posts
- **Hashtags** - Trending topics
- **VideoChatSessions** - Video chat data
- **UserSettings** - User preferences

## 🧪 Development

### Database Management
```bash
# View database in Prisma Studio
npx prisma studio

# Reset database
npx prisma migrate reset

# Deploy migrations to production
npx prisma migrate deploy
```

### Code Quality
```bash
# Type checking
yarn type-check

# Linting
yarn lint

# Formatting
yarn format
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on git push

### Environment Variables for Production
```env
DATABASE_URL="your-production-database-url"
BETTER_AUTH_SECRET="secure-random-secret"
BETTER_AUTH_URL="https://your-domain.com"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** team for the amazing framework
- **Prisma** for the excellent database toolkit
- **Better-Auth** for modern authentication
- **Tailwind CSS** for utility-first styling
- **Zustand** for simple state management

---

Built with ❤️ using modern web technologies
