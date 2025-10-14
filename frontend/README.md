# One Faith One Archive - Frontend

The frontend application for the One Faith One Archive platform, built with React 18, Tailwind CSS, and modern web technologies.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   └── ProtectedRoute.js
│   │   ├── Layout/
│   │   │   ├── Layout.js
│   │   │   ├── AuthLayout.js
│   │   │   ├── Header.js
│   │   │   └── Sidebar.js
│   │   └── UI/
│   │       └── LoadingSpinner.js
│   ├── contexts/
│   │   └── AuthContext.js
│   ├── pages/
│   │   ├── Auth/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── ForgotPassword.js
│   │   ├── Dashboard/
│   │   │   └── Dashboard.js
│   │   ├── Thesis/
│   │   │   ├── ThesisList.js
│   │   │   ├── ThesisDetail.js
│   │   │   ├── ThesisCreate.js
│   │   │   ├── ThesisEdit.js
│   │   │   └── MyTheses.js
│   │   ├── Calendar/
│   │   │   ├── Calendar.js
│   │   │   ├── CalendarEvent.js
│   │   │   └── CalendarCreate.js
│   │   ├── User/
│   │   │   ├── Profile.js
│   │   │   └── Users.js
│   │   ├── Admin/
│   │   │   ├── AdminDashboard.js
│   │   │   ├── AdminTheses.js
│   │   │   ├── AdminUsers.js
│   │   │   ├── AdminDepartments.js
│   │   │   └── AdminAnalytics.js
│   │   └── NotFound.js
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── tailwind.config.js
└── package.json
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue tones for main actions and branding
- **Secondary**: Gray tones for neutral elements
- **Success**: Green tones for positive actions
- **Warning**: Yellow/Orange tones for warnings
- **Error**: Red tones for errors and destructive actions

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold weights (600-700)
- **Body Text**: Regular weight (400)
- **Small Text**: Medium weight (500)

### Components
- **Buttons**: Multiple variants (primary, secondary, outline, etc.)
- **Forms**: Consistent input styling with validation states
- **Cards**: Clean card layouts for content organization
- **Badges**: Status indicators and labels
- **Loading States**: Spinner and skeleton components

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

### Tailwind CSS Configuration

The project uses Tailwind CSS with custom configuration:
- Custom color palette
- Extended animations
- Custom utilities
- Responsive design utilities

## 📱 Responsive Design

The application is built with a mobile-first approach:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🔐 Authentication & Authorization

### Authentication Flow
1. User login/register
2. JWT token storage in localStorage
3. Automatic token refresh
4. Protected route access

### Role-based Access Control
- **Student**: Access to personal theses and calendar
- **Faculty/Adviser**: Access to advised theses and event management
- **Admin**: Full system access and management

## 🎯 Key Features

### Dashboard
- Role-specific content and statistics
- Quick action buttons
- Recent activities
- Upcoming events

### Thesis Management
- Browse and search theses
- Create and edit theses
- File upload and management
- Review and approval workflow

### Calendar System
- Event creation and management
- Attendee management
- Recurring events
- File attachments

### User Management
- Profile management
- Avatar upload
- Password change
- User statistics

### Admin Panel
- System statistics
- User management
- Thesis review
- Department management
- Analytics and reporting

## 🛠️ Development

### Available Scripts
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Code Style
- ESLint configuration
- Prettier for formatting
- Consistent component structure
- Custom hooks for reusable logic

## 📦 Dependencies

### Core Dependencies
- **React 18**: Modern React with hooks
- **React Router**: Client-side routing
- **React Query**: Data fetching and caching
- **React Hook Form**: Form management
- **Tailwind CSS**: Utility-first CSS framework

### UI Libraries
- **Headless UI**: Unstyled, accessible UI components
- **Heroicons**: Beautiful SVG icons
- **Framer Motion**: Animation library
- **React Hot Toast**: Toast notifications

### Development Tools
- **React Scripts**: Build and development tools
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

## 🎨 Styling Guidelines

### CSS Classes
- Use Tailwind utility classes
- Create custom components for repeated patterns
- Follow BEM methodology for custom CSS
- Use CSS variables for theme customization

### Component Structure
```jsx
const Component = () => {
  // Hooks
  const [state, setState] = useState();
  
  // Event handlers
  const handleClick = () => {};
  
  // Render
  return (
    <div className="component-wrapper">
      {/* Component content */}
    </div>
  );
};
```

## 🧪 Testing

### Testing Strategy
- Unit tests for components
- Integration tests for user flows
- E2E tests for critical paths

### Testing Tools
- Jest for unit testing
- React Testing Library for component testing
- Cypress for E2E testing

## 🚀 Deployment

### Build Process
1. Run `npm run build`
2. Optimize assets
3. Deploy to static hosting

### Deployment Platforms
- **Netlify**: Easy deployment with continuous integration
- **Vercel**: Optimized for React applications
- **AWS S3**: Static website hosting
- **GitHub Pages**: Free hosting for open source projects

### Performance Optimization
- Code splitting with React.lazy()
- Image optimization
- Bundle analysis
- Caching strategies

## 🔧 Customization

### Theme Customization
- Modify `tailwind.config.js` for colors and spacing
- Update CSS variables in `index.css`
- Customize component styles

### Adding New Pages
1. Create page component in appropriate directory
2. Add route in `App.js`
3. Update navigation in `Sidebar.js`
4. Add protected route if needed

### Adding New Components
1. Create component file
2. Follow naming conventions
3. Add to appropriate directory
4. Export from index file if needed

## 📱 Mobile Optimization

### Responsive Features
- Touch-friendly interface
- Optimized navigation
- Mobile-specific layouts
- Progressive Web App features

### Performance
- Lazy loading
- Image optimization
- Minimal bundle size
- Fast loading times

## 🔍 SEO & Accessibility

### SEO Features
- Meta tags management
- Semantic HTML
- Open Graph tags
- Sitemap generation

### Accessibility
- ARIA labels and roles
- Keyboard navigation
- Screen reader support
- Color contrast compliance

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Review Checklist
- [ ] Code follows style guidelines
- [ ] Components are properly tested
- [ ] Accessibility requirements met
- [ ] Performance considerations addressed
- [ ] Documentation updated

## 📞 Support

For frontend-specific issues or questions, please create an issue in the repository or contact the development team.

## 🔮 Future Enhancements

- Progressive Web App (PWA) features
- Offline functionality
- Advanced search with filters
- Real-time notifications
- Dark mode support
- Internationalization (i18n)
- Advanced analytics dashboard
- Mobile app development
