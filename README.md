# 🔍 GitHub Repository Explorer

A modern, responsive React application that allows users to search for GitHub users and explore their repositories with advanced features like keyboard navigation, accessibility support, and comprehensive error handling.

## 🌐 Live Demo

**🚀 [View Live Application](https://HuriatiPutri.github.io/GitHub-repositories-explorer/)**

> The application is automatically deployed to GitHub Pages via GitHub Actions on every push to the main branch.

## ✨ Features

### 🔎 **User Search**

- **Debounced Search**: Real-time search with 500ms debouncing for optimal performance
- **Keyboard Navigation**: Full arrow key navigation support with visual focus indicators
- **Smart Query Handling**: Searches any non-empty query with loading states
- **Error Resilience**: Comprehensive error handling with user-friendly messages

### 📚 **Repository Display**

- **Rich Repository Cards**: Display repository name, description, language, stars, forks, and last update
- **Language Colors**: Visual language indicators with authentic GitHub colors
- **External Links**: Direct links to GitHub repositories with proper security attributes
- **Private Repository Badges**: Clear indication of private repositories

### ♿ **Accessibility & UX**

- **ARIA Labels**: Full screen reader support with proper ARIA attributes
- **Keyboard Navigation**: Complete keyboard accessibility for all interactions
- **Focus Management**: Smart focus handling during navigation
- **Loading States**: Clear loading indicators for better user experience
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## 🛠️ Technology Stack

- **Frontend**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 7.1.7 with HMR (Hot Module Replacement)
- **Testing**: Vitest + React Testing Library
- **Styling**: Modern CSS with CSS Grid and Flexbox
- **Icons**: Tabler Icons React
- **API**: GitHub REST API v3
- **Code Quality**: ESLint with React-specific rules

## 📁 Project Structure

```
src/
├── api/                    # GitHub API integration
│   ├── github.ts          # API functions and types
│   └── __tests__/         # API tests
├── components/            # React components
│   ├── UserSearch.tsx     # User search with keyboard navigation
│   ├── UserCard.tsx       # Individual user display
│   ├── RepositoryList.tsx # Repository grid layout
│   ├── RepositoryCard.tsx # Individual repository display
│   └── __tests__/         # Component tests
├── utils/                 # Utility functions
│   └── function.ts        # Helper functions (language colors, etc.)
├── test/                  # Test configuration
│   ├── setup.ts           # Vitest setup
│   └── utils.tsx          # Test utilities
├── App.tsx                # Main application component
└── main.tsx               # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd github-repositories-explorer
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

## 📝 Available Scripts

| Command                 | Description                              |
| ----------------------- | ---------------------------------------- |
| `npm run dev`           | Start development server with hot reload |
| `npm run build`         | Build production bundle                  |
| `npm run preview`       | Preview production build locally         |
| `npm run lint`          | Run ESLint for code quality              |
| `npm test`              | Run test suite with Vitest               |
| `npm run test:ui`       | Run tests with interactive UI            |
| `npm run test:coverage` | Generate test coverage reports           |

## 🧪 Testing

The project includes comprehensive test coverage:

- **Unit Tests**: All components individually tested
- **Integration Tests**: Full user workflows tested
- **API Tests**: GitHub API integration tested with mocks
- **Accessibility Tests**: ARIA attributes and keyboard navigation tested

### Test Coverage

- **Total Tests**: 53 tests
- **Test Files**: 6 test files
- **Coverage**: Comprehensive coverage of all components and API functions

Run tests:

```bash
npm test                    # Run all tests
npm run test:ui            # Interactive test UI
npm run test:coverage      # Coverage reports
```

## 🚀 Deployment

### GitHub Pages (Automatic)

The project is automatically deployed to GitHub Pages using GitHub Actions:

1. **Push to main branch** triggers automatic deployment
2. **Tests run first** - deployment only proceeds if tests pass
3. **Build artifacts** are generated and deployed
4. **Live site** available at: https://HuriatiPutri.github.io/GitHub-repositories-explorer/

### Manual Deployment

You can also deploy manually using:

```bash
npm run build              # Build the project
npm run deploy             # Deploy to GitHub Pages (requires gh-pages setup)
```

### Local Development with Production Build

```bash
npm run build              # Build for production
npm run preview            # Preview production build locally
```

## 🎨 Component API

### UserSearch Component

```tsx
interface UserSearchProps {
  onUserSelect: (user: GitHubUser) => void;
  selectedUser: GitHubUser | null;
}
```

### RepositoryCard Component

```tsx
interface RepositoryCardProps {
  repository: GitHubRepository;
}
```

## 🔧 Configuration

### Environment Variables

The application uses the GitHub public API which doesn't require authentication for basic usage. For higher rate limits, you can add a GitHub token:

```env
VITE_GITHUB_TOKEN=your_github_token_here  # Optional
```

### Deployment Configuration

- **GitHub Pages**: Automatically deployed via GitHub Actions
- **Base Path**: Configured for `/GitHub-repositories-explorer/`
- **Build Target**: Static files in `dist/` directory
- **Auto-Deploy**: Triggers on push to `main` branch

### TypeScript Configuration

- **Strict Mode**: Enabled for better type safety
- **Path Mapping**: Configured for clean imports
- **React Compiler**: Enabled for optimized React performance

### ESLint Configuration

- **React Hooks**: Enforced rules for proper hook usage
- **TypeScript**: Type-aware linting rules
- **Accessibility**: A11y best practices enforced

## 🌟 Key Features Deep Dive

### 🎯 **Debounced Search**

- Optimizes API calls by waiting 500ms after user stops typing
- Prevents excessive API requests during fast typing
- Maintains responsive UI with loading states

### ⌨️ **Keyboard Navigation**

- `Arrow Down/Up`: Navigate through search results
- `Enter`: Select focused user
- `Escape`: Clear search and results
- Full focus management with visual indicators

### 🎨 **Language Colors**

- Authentic GitHub language colors
- Supports 20+ programming languages
- Fallback color for unknown languages
- Visual language dots in repository cards

### 📱 **Responsive Design**

- Mobile-first approach
- CSS Grid for repository layout
- Flexible card sizing
- Touch-friendly interface

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Write tests for new features
- Follow TypeScript strict mode
- Maintain accessibility standards
- Use semantic HTML elements
- Follow existing code style

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **GitHub API**: For providing comprehensive repository data
- **React Team**: For the amazing React 19 features
- **Vite Team**: For the blazing-fast build tool
- **Tabler Icons**: For the beautiful icon set
- **Testing Library**: For excellent testing utilities

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
