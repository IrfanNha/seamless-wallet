# Bitcoin Wallet - Modern Web Application

A professional, modern Bitcoin wallet application built with Next.js 15, featuring real-time mempool data integration, beautiful animations, and a sleek slate blue design.

## ✨ Features

- **Real-time Bitcoin Monitoring**: Track wallet balances and transactions using Mempool.space API
- **Modern UI/UX**: Beautiful slate blue theme with futuristic animations and effects
- **State Management**: Robust state management with Zustand and Immer
- **Responsive Design**: Fully responsive design that works on all devices
- **Real-time Updates**: WebSocket integration for live mempool data
- **Professional Architecture**: Clean, scalable code structure following best practices
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Server Actions**: Secure server-side operations for wallet management

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom slate blue theme
- **UI Components**: shadcn/ui
- **State Management**: Zustand with Immer middleware
- **Animations**: Framer Motion
- **API Integration**: Axios for HTTP requests
- **Form Handling**: React Hook Form with Zod validation
- **Real-time Data**: WebSocket connections to Mempool.space

## 📁 Project Structure

```
src/
├── actions/           # Server actions for wallet operations
├── components/        # React components
│   ├── animations/    # Animation components
│   ├── common/        # Shared components
│   ├── layout/        # Layout components
│   ├── ui/           # shadcn/ui components
│   └── wallet/       # Wallet-specific components
├── constants/        # Application constants
├── hooks/           # Custom React hooks
├── services/        # API services and external integrations
├── stores/          # Zustand stores
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-next-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Bitcoin Wallet Environment Variables
   NEXT_PUBLIC_APP_NAME="Bitcoin Wallet"
   NEXT_PUBLIC_APP_VERSION="1.0.0"
   
   # Mempool API Configuration
   NEXT_PUBLIC_MEMPOOL_API_URL="https://mempool.space/api"
   NEXT_PUBLIC_MEMPOOL_WS_URL="wss://mempool.space"
   
   # Security (Change these in production!)
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   ENCRYPTION_KEY="your-encryption-key-32-chars-long"
   
   # Feature Flags
   NEXT_PUBLIC_ENABLE_ANIMATIONS="true"
   NEXT_PUBLIC_ENABLE_DEBUG="false"
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Design System

### Color Palette
- **Primary**: Slate blue gradients (#64748b → #334155)
- **Accent**: Modern slate tones with subtle animations
- **Background**: Clean whites and dark slate variants
- **Interactive**: Hover effects with smooth transitions

### Animations
- **Scroll Reveal**: Elements animate in as you scroll
- **Floating Elements**: Subtle floating animations for visual interest
- **Hover Effects**: Smooth lift and glow effects on interactive elements
- **Loading States**: Shimmer effects and skeleton loaders

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📱 Features Overview

### Wallet Management
- Create and manage multiple Bitcoin wallets
- Real-time balance tracking
- Address validation and verification
- Secure wallet storage with Zustand persistence

### Transaction Monitoring
- Real-time transaction updates
- Detailed transaction information
- Confirmation tracking
- Fee analysis

### Mempool Integration
- Live mempool data from Mempool.space
- WebSocket connections for real-time updates
- Transaction fee recommendations
- Network statistics

## 🔒 Security Considerations

- All sensitive operations use server actions
- Client-side state is properly sanitized
- Environment variables for configuration
- Input validation with Zod schemas

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Mempool.space](https://mempool.space) for providing the Bitcoin API
- [shadcn/ui](https://ui.shadcn.com) for the beautiful component library
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Zustand](https://zustand-demo.pmnd.rs/) for state management

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the development team.

---

Built with ❤️ using Next.js and modern web technologies.
