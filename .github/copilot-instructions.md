# Scrapy Bro App - Copilot Instructions

## Architecture Overview

**Stack**: React Native 0.82 + TypeScript | State: Zustand + React Query | Navigation: React Navigation (v7)

The app is a marketplace platform connecting buyers and vendors with multi-role support (user/vendor). It follows a layered architecture:

- **Navigation Layer** (`src/navigation/`): Bottom-tab + native-stack navigation. Role-based routing via `MainAppStack.tsx`.
- **Screens** (`src/screens/`): Feature-organized folders (Orders/, Proposals/, Parts/, MyInquiries/, Profile/). Each feature has dedicated API and validation schemas.
- **Components** (`src/components/`): Reusable UI elements, feature-specific modals (Order/, Proposal/). Form components use react-hook-form + Zod.
- **State Management**: Dual approach:
  - **Zustand stores** (`src/stores/`) for persistent auth, theme, loader state. Uses `persist` middleware with AsyncStorage.
  - **React Query** (`@tanstack/react-query`) for server state & caching. Custom hooks in `src/stores/hooks/` combine both patterns.
- **API** (`src/api/`): Centralized `apiClient` (fetch-based) with axios in imports but fetch used in implementation. Bearer token auth via `setAuthToken()`. API_URL in constants.
- **Validation** (`src/validation/`): Zod schemas per feature (authSchemas, orderSchemas, etc). Always applied in forms via `rules` prop.

**Data Flow**: UI → Form (react-hook-form) → API → Zustand/React Query → UI (provider-wrapped at `AppProvider.tsx`).

## Key Files & Patterns

### State & Auth

- `src/stores/authStore.ts`: Main auth store. Hydrate on app start to restore token. Methods: `login()`, `logout()`, `setUser()`.
- `src/context/AuthContext.tsx`: Legacy context (deprecated by authStore but still present—use authStore instead).
- `src/api/client.ts`: `setAuthToken(token)` must be called after login. BASE_URL hardcoded for Android emulator.

### Forms & Validation

- `src/components/form/TextField.tsx`: Wraps react-hook-form Controller + TextInput + error handling. Always pass `control` and `name`.
- Example: `<TextField control={form.control} name="email" label="Email" rules={{ required: 'Required' }} />`
- Zod refines applied for cross-field validation (e.g., password confirmation in `authSchemas.ts`).

### React Query Setup

- `AppProvider.tsx`: QueryClient created once, passed via QueryClientProvider.
- Custom hooks in `src/stores/hooks/`: Return both `useQuery()` and `useMutation()`. Use `skipToken` for conditional queries.
- Example: `useProfile()` returns `profileQuery()` and `updateMutation()` methods.

### Navigation

- Constants in `src/constants/index.js`: All route names defined as exports (e.g., `my_inquiries`, `vendor_orders`).
- Stack navigators created with `createNativeStackNavigator()`. Tab navigator for main app via `createBottomTabNavigator()`.
- Nested stacks for complex features (e.g., InquiryStack wraps multiple inquiry screens).

### Styling & Theme

- `src/theme/index.ts`: Single theme object. `useThemeStore()` provides `theme` with colors, typography, etc.
- Inline `makeStyles(colors)` functions in components (see `OrderRow.tsx`) create dynamic StyleSheets.
- Use `colors.primary`, `colors.error`, etc. for consistency.

## Developer Workflows

### Build & Run

```bash
npm start                 # Start Metro (required first)
npm run ios              # Build & run iOS (after `bundle exec pod install` on first clone)
npm run android          # Build & run Android
npm test                 # Jest tests
npm run lint             # ESLint
```

### Common Tasks

1. **Add new screen**: Create folder in `src/screens/{FeatureName}/`, add navigation route in `MainAppStack.tsx`, define types in `src/types/navigation.d.ts`.
2. **Add API endpoint**: Create function in `src/api/{service}Service.ts`, use `apiClient()`, return typed response.
3. **Add form**: Create schema in `src/validation/{feature}Schemas.ts`, use form components with `useForm()` + validation rules, wrap with error display.
4. **Update auth**: Modify `useAuthStore`, call `setAuthToken()`, persist is automatic via middleware.
5. **Add query**: Create custom hook in `src/stores/hooks/use{Feature}.ts`, return useQuery + useMutation, invalidate cache on mutation success.

## Project-Specific Conventions

### Naming

- **Routes** (snake_case): `my_inquiries`, `vendor_orders`, `part_details`.
- **Components** (PascalCase): `OrderRow`, `MyHeader`, `Loader`.
- **Store/Hook** (camelCase): `useAuthStore`, `useProfile`, `useSnackbarStore`.
- **Zod schemas** (camelCase): `signupSchema`, `orderSchemas`.

### Status Handling

- Order/inquiry statuses: `'pending' | 'completed' | 'canceled' | 'shipped' | 'delivered'`.
- Use `statusConfig(status)` from constants to get color, icon, label (e.g., pending → orange + clock icon).

### Image Handling

- Use `FastImage` (react-native-fast-image) for remote images, not RNImage.
- Images stored on backend; access via `item.part?.images[0]?.file?.url`.
- Local images in `src/assets/images/` (not yet populated in workspace).

### Icons

- Material Design Icons via `@react-native-vector-icons/material-design-icons`.
- Import: `import Icon from '@react-native-vector-icons/material-design-icons'`.
- Pass icon name as string to `statusConfig()` or directly to Icon component.

### Error & Loading States

- Global loader: `useLoaderState()` store, component in `src/components/Loader.tsx`.
- Snackbars: `useSnackbarStore()` hook for notifications. Component in `src/components/AppSnackbar.tsx`.
- API errors thrown from `apiClient()` caught in mutations; show via snackbar.

## Integration Points

### External Dependencies

- **React Query**: Server state, caching, refetching. Configured in AppProvider.
- **Zustand**: Persistent client state (auth, theme, loader). Hydrate on mount.
- **React Navigation**: Stack + tab navigators. Constants define all route names.
- **Zod**: Schema validation. Applied in forms via react-hook-form resolver.
- **React Native Paper**: UI components (Button, Card, Divider, etc). Theme provider wraps app.

### Cross-Component Communication

- **Auth flow**: Login → `authStore.login()` → `setAuthToken()` → queries auto-include token.
- **Theme switching**: `themeStore` → `useThemeStore()` → all components consume `theme` colors.
- **Global UI**: Snackbar/Loader components at root level (`AppProvider`), triggered by store mutations.

## Testing

- Jest configured in `jest.config.js`.
- Test template: `__tests__/App.test.tsx`.
- No established patterns yet—add tests to components as coverage grows.

## Path Aliases

- `@/*` resolves to `src/`. Always use `@/` imports (e.g., `@/stores/authStore`, `@/components/MyHeader`).
- Configured in `tsconfig.json` `paths`.

---

**Last Updated**: 25 Jan 2026 | **Framework**: React Native 0.82 + TypeScript
