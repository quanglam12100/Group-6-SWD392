# SmartRestaurant Codebase Guide

## Project Overview
**SmartRestaurant** is a Vietnamese restaurant management dashboard (SWD392 course project) with a .NET 8.0 backend and React 19 (Vite) frontend. It manages Categories, Products, Variants, and Toppings with JWT-based authentication.

## Architecture

### Backend Stack (Clean Architecture)
- **SmartRestaurant** (main API) – ASP.NET Core 8.0 Web API on HTTPS port 7031
  - Minimal implementation: controllers folder is placeholder, routing via `MapControllers()`
  - CORS enabled for React frontend (`AllowReact` policy)
  - Uses Swagger at `/swagger`
- **SmartRestaurant.Domain** – Entity definitions (no dependencies)
- **SmartRestaurant.Application** – Business logic & service layer (depends on Domain)
- **SmartRestaurant.Infrastructure** – Data persistence & EF Core (depends on Domain + Application)

### Frontend Stack
- **React 19** with Vite (port 5173)
- **React Router v7** for navigation with token-based route protection
- **Axios** for HTTP (initialized in `authApi.js` but mostly using native `fetch`)
- Key pages: `Home`, `Login`, `Register`, `CategoryPage`, `ProductPage`, `ToppingPage`, `ProductVariantPage`

### Critical Integration Points
1. **CORS Setup** (Program.cs, line 16-25): Must be set before `UseAuthorization()`. Currently `AllowAnyOrigin` for development.
2. **Authentication**: JWT tokens stored in `localStorage.token`; Authorization header is `Bearer ${token}`
3. **API Base URL**: `https://localhost:7031` hardcoded in frontend components (consider environment config)

## Development Workflows

### Starting the Backend
```bash
cd SmartRestaurant
dotnet run --launch-profile https
# Launches on https://localhost:7031 with Swagger
```

### Starting the Frontend
```bash
cd Frontend/vite-project
npm install  # if needed
npm run dev
# Launches on http://localhost:5173
```

### Building Frontend
```bash
npm run build  # Output: dist/
npm run preview  # Local preview of production build
```

### Debugging
- **Backend**: VSCode or Visual Studio debugger (F5 in .NET projects)
- **Frontend**: Chrome DevTools or VSCode debugger extension
- **Network**: Check Swagger UI for API contracts; use Chrome DevTools Network tab

## Project-Specific Patterns

### Frontend Page Template
All pages follow this pattern (see `CategoryPage.jsx`, `ProductPage.jsx`, `ToppingPage.jsx`):
```jsx
1. Fetch authorization token from localStorage
2. Define API URL constant at top
3. useEffect to load initial data with Bearer token
4. State for form inputs + editing ID
5. CRUD operations (create/update/delete)
6. Form inputs above, list below
```
This is consistent across all CRUD pages—do not deviate.

### API Request Headers
Standard header pattern used everywhere:
```javascript
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};
```

### Token & Authentication Flow
1. Login/Register at `/api/auth/login` or `/api/auth/register`
2. Response contains `token` field → stored in `localStorage`
3. Routes check `localStorage.getItem("token")` to determine if logged in
4. `PrivateRoute` component wraps protected pages in `AppRoutes.jsx`
5. Logout removes token and navigates to `/login`

### Vite Proxy Configuration
The frontend has proxy config (`vite.config.js`, line 11-17) for development, but it's currently unused—components call full HTTPS URLs instead.

## Key Files & Patterns

| File | Purpose | Pattern |
|------|---------|---------|
| [Frontend/vite-project/src/routes/AppRoutes.jsx](Frontend/vite-project/src/routes/AppRoutes.jsx) | Routing + auth guards | `PrivateRoute` wrapper for protected pages |
| [Frontend/vite-project/src/components/Navbar.jsx](Frontend/vite-project/src/components/Navbar.jsx) | Navigation menu | Hides if not logged in; active button styling |
| [Frontend/vite-project/src/pages/ProductPage.jsx](Frontend/vite-project/src/pages/ProductPage.jsx) | CRUD example | Reference template for all CRUD pages |
| [SmartRestaurant/Program.cs](SmartRestaurant/Program.cs#L16-L25) | CORS & middleware config | Critical: CORS must come before Authorization |
| [Frontend/vite-project/src/pages/Login.jsx](Frontend/vite-project/src/pages/Login.jsx) | Auth entry point | Stores token, navigates to `/` on success |

## Common Tasks

### Adding a New CRUD Page
1. Create page component in `src/pages/NewEntityPage.jsx`
2. Follow `ProductPage.jsx` pattern: token fetch → API CRUD functions → form + list
3. Add route in `AppRoutes.jsx` wrapped in `PrivateRoute`
4. Add navigation button in `Navbar.jsx`

### Creating Backend Endpoints
1. **Create Entity**: Add to appropriate `Domain/` folder
2. **Add Service**: Create in `Application/` layer
3. **Create Controller**: Add to `SmartRestaurant/Controllers/`
4. **Register in DI**: Update `Program.cs` services if using dependency injection

### Connecting to New API Endpoint
1. Update the API URL constant in the page component
2. Follow existing `fetch()` pattern with Bearer token in headers
3. Handle `res.ok` check and JSON parsing errors
4. Test in Swagger first, then wire frontend

## Testing & Validation

### Frontend
- Lint: `npm run lint` (ESLint configured in `eslint.config.js`)
- Runs ESLint with React Hook rules; ignores unused variables starting with `_`

### Backend
- No automated tests visible yet; manual testing via Swagger or `.http` file

## Dependencies & Versions

### Frontend
- React 19.2.0, React Router DOM 7.13.0, Axios 1.13.4
- Vite 7.2.4, ESLint 9.39.1

### Backend
- .NET 8.0, Entity Framework Core 8.0.10, AutoMapper 12.0.1, Swashbuckle 6.6.2

## Configuration & Environment

### Frontend
- No environment file currently used
- API base URL hardcoded as `https://localhost:7031`
- Consider adding `.env` for different deployment targets

### Backend
- `appsettings.json`: Basic logging config; no database connection string visible yet
- HTTPS certificate likely auto-generated by dotnet dev-certs

## Notes for AI Agents
- **Language mix**: Vietnamese UI text and comments throughout (login labels, button text, error messages)
- **Development-focused**: Currently no production-ready security (CORS `AllowAnyOrigin`, hardcoded URLs, plain localStorage tokens)
- **Clean Architecture foundation**: Domain/Application/Infrastructure layers ready for expansion
- **Missing pieces**: No database models in Domain layer visible; controllers folder is empty; need to implement actual endpoints for API routes being called
