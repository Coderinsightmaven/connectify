# Connectify 🌐

A modern social media platform built with Next.js that combines traditional social networking with innovative video chat features. Connect with friends, share content, and meet new people through anonymous video conversations.

## ✨ Features

### 🔐 User Management
- **User Authentication** - Secure login/logout system
- **Profile Management** - Customizable user profiles with avatars, bio, and social links
- **Follow System** - Follow/unfollow users and build your network
- **User Statistics** - Track followers, following, and engagement metrics

### 📱 Social Features
- **Posts & Content** - Create, like, and share posts with image support
- **Comments** - Interactive comment system on posts
- **Bookmarks** - Save posts for later viewing
- **Trending Topics** - Discover what's popular on the platform
- **User Suggestions** - Find new people to follow

### 🎥 Video Chat
- **Anonymous Video Chat** - Connect with random strangers worldwide
- **Smart Matching** - Advanced matching algorithm based on preferences
- **Country Preferences** - Filter matches by geographic location
- **Interest-Based Matching** - Connect with people who share your interests
- **Auto-Skip** - Automatic partner switching for continuous conversations
- **Report System** - Keep the community safe with built-in reporting

### ⚙️ Settings & Customization
- **Theme Management** - Light/dark mode with system preference detection
- **Notification Controls** - Granular notification preferences
- **Privacy Settings** - Control who can see your content and contact you
- **Accessibility** - Font size, animation controls, and high contrast options
- **Account Management** - Update profile, change password, manage account

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Package Manager**: [Yarn](https://yarnpkg.com/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- Yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd connectify
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Start the development server**
   ```bash
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
# Start development server
yarn dev

# Build for production
yarn build

# Start production server
yarn start

# Run linting
yarn lint
```

## 📁 Project Structure

```
connectify/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Home page with posts feed
│   │   ├── layout.tsx         # Root layout component
│   │   └── video-chat/        # Video chat feature pages
│   ├── components/            # Reusable UI components
│   │   ├── layout/           # Layout components (header, sidebar)
│   │   ├── post/             # Post-related components
│   │   └── settings/         # Settings page components
│   └── stores/               # Zustand state management
│       ├── user-store.ts     # User authentication & profiles
│       ├── posts-store.ts    # Posts, comments, social features
│       ├── video-chat-store.ts # Video chat & matching
│       ├── settings-store.ts # App settings & preferences
│       └── index.ts          # Store exports
├── public/                   # Static assets
└── docs/                    # Documentation files
```

## 🏪 State Management

The application uses [Zustand](https://zustand-demo.pmnd.rs/) for state management with the following stores:

### User Store (`useUserStore`)
- Current user authentication state
- Profile management
- Following/followers relationships
- User statistics and verification status

### Posts Store (`usePostsStore`)
- Posts feed and CRUD operations
- Comments system
- Likes, bookmarks, and shares
- Trending topics and user suggestions
- Search functionality

### Video Chat Store (`useVideoChatStore`)
- Anonymous video chat matching
- Chat messaging system
- User preferences and filters
- Report and moderation features

### Settings Store (`useSettingsStore`)
- Theme and appearance settings
- Notification preferences
- Privacy controls
- Accessibility options
- Settings persistence

## 🎨 Theming & Customization

The app supports comprehensive theming:

- **Light/Dark Mode**: Automatic system preference detection
- **Custom Themes**: Easily extendable theme system
- **Accessibility**: High contrast mode, font size controls
- **Animations**: Configurable animation preferences

## 🔒 Privacy & Safety

- **Anonymous Chat**: Video chats don't require personal information
- **Report System**: Users can report inappropriate behavior
- **Privacy Controls**: Granular privacy settings for profiles and content
- **Content Moderation**: Built-in systems to maintain community standards

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Icons by [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- State management by [Zustand](https://zustand-demo.pmnd.rs/)

---

**Connectify** - Where connections matter. 🌟
