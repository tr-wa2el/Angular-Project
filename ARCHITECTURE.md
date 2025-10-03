# 🏗️ Movie App - Project Architecture

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         User Interface                       │
│                    (Browser / Mobile)                        │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                    Angular Application                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Components Layer                         │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │  │
│  │  │   Navbar   │  │ Movie Card │  │   Spinner  │     │  │
│  │  └────────────┘  └────────────┘  └────────────┘     │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │  │
│  │  │ Movies List│  │   Details  │  │  Wishlist  │     │  │
│  │  └────────────┘  └────────────┘  └────────────┘     │  │
│  └──────────────────────┬───────────────────────────────┘  │
│                         │                                   │
│  ┌──────────────────────▼───────────────────────────────┐  │
│  │              Services Layer                           │  │
│  │  ┌─────────┐  ┌──────────┐  ┌────────┐  ┌────────┐ │  │
│  │  │  Movie  │  │ Wishlist │  │  Auth  │  │Language│ │  │
│  │  │ Service │  │  Service │  │Service │  │Service │ │  │
│  │  └─────────┘  └──────────┘  └────────┘  └────────┘ │  │
│  │  ┌─────────┐  ┌────────────────────────────────┐   │  │
│  │  │  Theme  │  │     Notification Service       │   │  │
│  │  │ Service │  └────────────────────────────────┘   │  │
│  │  └─────────┘                                        │  │
│  └──────────────────────┬───────────────────────────────┘  │
│                         │                                   │
│  ┌──────────────────────▼───────────────────────────────┐  │
│  │           State Management (Signals)                  │  │
│  │    • Wishlist State    • Auth State                  │  │
│  │    • Theme State       • Language State              │  │
│  └──────────────────────┬───────────────────────────────┘  │
│                         │                                   │
│  ┌──────────────────────▼───────────────────────────────┐  │
│  │            LocalStorage Persistence                   │  │
│  │    • Wishlist Data     • User Session                │  │
│  │    • Theme Preference  • Language Setting            │  │
│  └───────────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                  External Services                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         TMDB API (The Movie Database)                 │  │
│  │  • Now Playing Movies    • Movie Details             │  │
│  │  • Search Movies         • Recommendations           │  │
│  │  • Genres                • Videos/Trailers           │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow Diagram

```
User Action (Click/Input)
        │
        ▼
   Component
        │
        ├─────► Service (API Call)
        │              │
        │              ▼
        │         TMDB API
        │              │
        │              ▼
        │       Response Data
        │              │
        │              ▼
        │       Signal Update
        │              │
        ▼              ▼
   Template Update ◄───┘
        │
        ▼
   UI Re-render
```

## 📂 Detailed File Structure

```
angular-app/
│
├── src/
│   ├── app/
│   │   │
│   │   ├── components/              # Reusable UI Components
│   │   │   ├── navbar/
│   │   │   │   ├── navbar.component.ts       ✅ DONE
│   │   │   │   ├── navbar.component.html     ✅ DONE
│   │   │   │   └── navbar.component.css      ✅ DONE
│   │   │   │
│   │   │   ├── movie-card/
│   │   │   │   ├── movie-card.component.ts   ✅ DONE
│   │   │   │   ├── movie-card.component.html ✅ DONE
│   │   │   │   └── movie-card.component.css  ✅ DONE
│   │   │   │
│   │   │   ├── loading-spinner/              ⏳ TODO
│   │   │   ├── back-to-top/                  ⏳ TODO
│   │   │   └── pagination/                   ⏳ TODO
│   │   │
│   │   ├── pages/                   # Route Components
│   │   │   ├── movies-list/                  ⏳ TODO
│   │   │   ├── movie-details/                ⏳ TODO
│   │   │   ├── wishlist/                     ⏳ TODO
│   │   │   ├── search-results/               ⏳ TODO
│   │   │   ├── login/                        ⏳ TODO
│   │   │   ├── register/                     ⏳ TODO
│   │   │   ├── account/                      ⏳ TODO
│   │   │   └── not-found/                    ⏳ TODO
│   │   │
│   │   ├── services/                # Business Logic
│   │   │   ├── movie.service.ts              ✅ DONE
│   │   │   ├── wishlist.service.ts           ✅ DONE
│   │   │   ├── auth.service.ts               ✅ DONE
│   │   │   ├── language.service.ts           ✅ DONE
│   │   │   ├── theme.service.ts              ✅ DONE
│   │   │   └── notification.service.ts       ✅ DONE
│   │   │
│   │   ├── models/                  # TypeScript Interfaces
│   │   │   ├── movie.model.ts                ✅ DONE
│   │   │   └── user.model.ts                 ✅ DONE
│   │   │
│   │   ├── app.ts                            ✅ DONE
│   │   ├── app.html                          ✅ DONE
│   │   ├── app.css                           ✅ DONE
│   │   ├── app.routes.ts                     ✅ DONE
│   │   └── app.config.ts                     ✅ DONE
│   │
│   ├── environments/
│   │   └── environment.ts                    ⚠️ ADD API KEY
│   │
│   ├── styles.css                            ✅ DONE
│   └── index.html                            ✅ DONE
│
├── Documentation/
│   ├── IMPLEMENTATION_GUIDE.md               ✅ DONE
│   ├── PROJECT_CHECKLIST.md                  ✅ DONE
│   ├── PROJECT_SUMMARY.md                    ✅ DONE
│   ├── QUICK_REFERENCE.md                    ✅ DONE
│   ├── COMPLETE_SETUP_SUMMARY.md             ✅ DONE
│   └── ARCHITECTURE.md                       ✅ THIS FILE
│
├── angular.json                              ✅ DONE
├── package.json                              ✅ DONE
├── tsconfig.json                             ✅ DONE
└── generate-components.ps1                   ✅ DONE

Legend:
✅ DONE - Complete and ready
⏳ TODO - Generated, needs implementation
⚠️ ACTION - Requires your input
```

## 🔧 Service Dependencies

```
MovieService
    │
    ├──> HttpClient (Angular)
    └──> Environment Config

WishlistService
    │
    ├──> LocalStorage API
    └──> Angular Signals

AuthService
    │
    ├──> LocalStorage API
    ├──> Angular Signals
    └──> Router

LanguageService
    │
    ├──> LocalStorage API
    ├──> Angular Signals
    └──> Document API

ThemeService
    │
    ├──> LocalStorage API
    ├──> Angular Signals
    └──> Document API

NotificationService
    │
    └──> MatSnackBar (Material)
```

## 🎯 Component Relationships

```
App Root
    │
    ├── Navbar (Always Visible)
    │   ├── Search Input
    │   ├── Language Selector
    │   ├── Theme Toggle
    │   ├── Wishlist Link (with counter)
    │   └── User Menu
    │
    └── Router Outlet (Dynamic)
        │
        ├── Movies List Page
        │   └── Movie Card (multiple)
        │       └── Wishlist Button
        │
        ├── Movie Details Page
        │   ├── Movie Info
        │   ├── Trailer Embed
        │   └── Recommended Movies
        │       └── Movie Card (multiple)
        │
        ├── Wishlist Page
        │   └── Movie Card (multiple)
        │
        ├── Search Results Page
        │   ├── Genre Filter
        │   ├── Sort Dropdown
        │   ├── Movie Card (multiple)
        │   └── Pagination
        │
        ├── Login Page
        │   └── Login Form
        │
        ├── Register Page
        │   └── Register Form
        │
        ├── Account Page
        │   └── Profile Form
        │
        └── Not Found Page
            └── 404 Message
```

## 🔄 State Management Flow

```
Signal-Based State Management
───────────────────────────

┌──────────────────────┐
│  Wishlist Service    │
│  ┌────────────────┐  │
│  │ wishlistSignal │  │
│  │    (private)   │  │
│  └────────┬───────┘  │
│           │          │
│  ┌────────▼───────┐  │
│  │   wishlist()   │  │ ◄──── Public read-only
│  └────────────────┘  │
│           │          │
│  ┌────────▼───────┐  │
│  │wishlistCount() │  │ ◄──── Computed signal
│  └────────────────┘  │
└──────────────────────┘

Component Usage:
────────────────
movies = wishlistService.wishlist()      // Get data
count = wishlistService.wishlistCount()  // Get count
wishlistService.addToWishlist(movie)     // Update state
```

## 🌐 API Integration Pattern

```
Component initiates request
        │
        ▼
┌─────────────────────┐
│  Service Method     │
│  ┌───────────────┐  │
│  │ HTTP Request  │  │
│  │   +params     │  │
│  │   +headers    │  │
│  │   +lang       │  │
│  └───────┬───────┘  │
└──────────┼──────────┘
           │
           ▼
    ┌────────────┐
    │  TMDB API  │
    └─────┬──────┘
          │
          ▼
    ┌────────────┐
    │  Response  │
    └─────┬──────┘
          │
          ▼
    ┌────────────┐
    │ Observable │
    └─────┬──────┘
          │
          ▼
    Component subscribes
          │
          ▼
    Signal updates
          │
          ▼
    Template re-renders
```

## 🎨 Theming System

```
CSS Variables System
───────────────────

:root {
    --primary-color: #e50914
    --background: #ffffff
    --text-primary: #000000
    // ... more variables
}

body.dark-mode {
    --background: #121212
    --text-primary: #ffffff
    // ... overrides
}

Components use:
───────────────
.element {
    background: var(--background);
    color: var(--text-primary);
}

Theme Toggle:
────────────
User clicks → ThemeService.toggleDarkMode()
                    ↓
            body.classList.toggle('dark-mode')
                    ↓
            CSS variables update
                    ↓
            UI re-styles automatically
```

## 🚀 Routing Strategy

```
Lazy Loading Routes
──────────────────

Route: /movies
    ↓
Lazy load component
    ↓
Download only movies-list chunk
    ↓
Render component

Benefits:
- Faster initial load
- Code splitting
- Better performance
- Smaller bundle size

Implementation:
loadComponent: () => import('./pages/movies-list')
                    .then(m => m.MoviesListComponent)
```

## 📊 Performance Optimizations

```
1. Lazy Loading
   ✅ All routes lazy-loaded
   ✅ Smaller initial bundle

2. Signals
   ✅ Fine-grained reactivity
   ✅ Automatic change detection
   ✅ Better performance than zones

3. Standalone Components
   ✅ No NgModules overhead
   ✅ Tree-shakeable
   ✅ Smaller bundles

4. Image Optimization
   ✅ Lazy loading images
   ✅ Responsive images
   ✅ CDN (TMDB images)

5. HTTP Caching
   ✅ Browser caching
   ✅ Service worker ready
   ✅ SSR support
```

## 🔐 Security Considerations

```
1. API Key Protection
   ⚠️ Never commit API key to git
   ✅ Use environment variables
   ✅ Add .env to .gitignore

2. Authentication
   ✅ Password not stored in plain text (demo)
   ✅ Session management
   ✅ Logout clears data

3. Input Validation
   ⏳ TODO: Add form validation
   ⏳ TODO: Sanitize user input
   ⏳ TODO: XSS protection

4. HTTPS
   ✅ All API calls use HTTPS
   ✅ Deploy with HTTPS
```

## 📱 Responsive Strategy

```
Breakpoints:
───────────
Mobile:    < 480px  (1 column)
Tablet:    < 768px  (2 columns)
Desktop:   < 992px  (3 columns)
Large:     < 1200px (4 columns)
XLarge:    > 1200px (5 columns)

Approach:
────────
1. Mobile-first CSS
2. CSS Grid for layout
3. Flexible images
4. Touch-friendly buttons
5. Collapsible navigation
```

## 🧪 Testing Strategy

```
Manual Testing:
──────────────
1. Feature testing
2. Cross-browser testing
3. Responsive testing
4. Performance testing
5. Accessibility testing

Automated (Future):
──────────────────
1. Unit tests (Jasmine)
2. Component tests
3. Service tests
4. E2E tests (Playwright)
```

## 📦 Build & Deployment

```
Development:
───────────
npm start → ng serve → http://localhost:4200

Production Build:
────────────────
npm run build
    ↓
Angular builds
    ↓
Optimizations:
- Tree shaking
- Minification
- AOT compilation
- Code splitting
    ↓
dist/angular-app/browser/
    ↓
Deploy to:
- Vercel (recommended)
- Netlify
- GitHub Pages
- Firebase Hosting
```

---

## 📚 Architecture Decisions

### Why Signals?
- Modern Angular approach
- Better performance
- Simpler code
- Fine-grained reactivity

### Why Standalone Components?
- No NgModules
- Easier to understand
- Better tree-shaking
- Smaller bundles

### Why Lazy Loading?
- Faster initial load
- Better user experience
- Code splitting
- On-demand loading

### Why LocalStorage?
- Simple authentication demo
- No backend required
- Persistence across sessions
- Easy to implement

### Why TMDB API?
- Free tier available
- Comprehensive data
- Good documentation
- Active community

---

**This architecture provides:**
- ✅ Scalability
- ✅ Maintainability
- ✅ Performance
- ✅ User Experience
- ✅ Developer Experience

**Ready to build on this foundation!** 🚀
