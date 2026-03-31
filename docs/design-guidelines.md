# Design Guidelines

This document outlines the UI/UX design patterns, component architecture, and visual standards used in the project.

---

## Design Philosophy

### Principles

1. **Simplicity First**: Clean, minimal interfaces that don't overwhelm users
2. **Consistency**: Repeated patterns across all pages and components
3. **Accessibility**: WCAG 2.1 AA compliance as standard
4. **Performance**: Every design decision considers load time impact
5. **Responsive**: Works seamlessly on desktop, tablet, and mobile
6. **Type Safety**: Component props are fully typed in TypeScript

### Design System Approach

We use a component-driven design system where:
- **Base UI Components**: Reusable primitives (button, input, modal, etc.)
- **Composed Components**: Higher-level components built from primitives
- **Page Layouts**: Full page compositions using composed components
- **Variant System**: Multiple appearances of same component through props

---

## Color Palette

### Primary Colors
| Color | Hex | Usage |
|-------|-----|-------|
| Primary Blue | #3B82F6 | CTAs, active states, links |
| Secondary Gray | #6B7280 | Secondary actions, text |
| Success Green | #10B981 | Success messages, positive actions |
| Warning Amber | #F59E0B | Warnings, caution messages |
| Error Red | #EF4444 | Errors, destructive actions |

### Neutral Colors
| Shade | Hex | Usage |
|-------|-----|-------|
| Black | #000000 | Text, dark backgrounds |
| Dark Gray | #1F2937 | Headings |
| Medium Gray | #6B7280 | Body text |
| Light Gray | #F3F4F6 | Backgrounds, borders |
| White | #FFFFFF | Primary backgrounds |

### Implementation (TailwindCSS)

```html
<!-- Primary blue button -->
<button class="bg-blue-500 hover:bg-blue-600 text-white">
  Click Me
</button>

<!-- Error message -->
<div class="text-red-500 bg-red-50">
  An error occurred
</div>

<!-- Neutral text -->
<p class="text-gray-600">Body text</p>
```

---

## Typography

### Font Stack

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
  'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
  'Helvetica Neue', sans-serif;
```

### Type Scale

| Element | Size | Weight | Line Height | Usage |
|---------|------|--------|-------------|-------|
| H1 | 32px | 700 | 40px | Page titles |
| H2 | 24px | 700 | 32px | Section headings |
| H3 | 20px | 600 | 28px | Subsection headings |
| Body | 16px | 400 | 24px | Main content |
| Small | 14px | 400 | 20px | Secondary text |
| Tiny | 12px | 400 | 16px | Labels, captions |

### Implementation

```tsx
// Using CSS classes
<h1 className="text-4xl font-bold leading-10">Page Title</h1>
<p className="text-base font-normal leading-6">Body text</p>

// For consistency, create utility components
function Heading1({ children }: { children: React.ReactNode }) {
  return <h1 className="text-4xl font-bold leading-10">{children}</h1>;
}
```

---

## Spacing System

Use an 8px base unit for consistent spacing:

| Scale | Value | Usage |
|-------|-------|-------|
| xs | 4px | Micro-interactions |
| sm | 8px | Padding inside components |
| md | 16px | Section padding |
| lg | 24px | Component margins |
| xl | 32px | Major section spacing |
| 2xl | 48px | Large sections |

### Implementation

```tsx
// Padding inside button
<button className="px-4 py-2">...</button>

// Margin between sections
<section className="mb-8">...</section>

// Component layout
<div className="space-y-6">
  <Card />
  <Card />
  <Card />
</div>
```

---

## Component Library

### Base UI Components

All base components are located in `client/src/components/ui/`.

#### Button

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  ...props
}: ButtonProps) {
  // Implementation
}
```

**Usage**:
```tsx
<Button variant="primary" size="md">
  Submit
</Button>

<Button variant="danger" isLoading={isSubmitting}>
  Delete
</Button>
```

#### Input

```tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({
  label,
  error,
  helperText,
  ...props
}: InputProps) {
  // Implementation
}
```

**Usage**:
```tsx
<Input
  type="email"
  label="Email"
  placeholder="user@example.com"
  error={errors.email?.message}
/>
```

#### Modal

```tsx
interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function Modal({
  isOpen,
  title,
  onClose,
  children,
  actions,
}: ModalProps) {
  // Implementation
}
```

**Usage**:
```tsx
<Modal
  isOpen={showModal}
  title="Confirm Delete"
  onClose={() => setShowModal(false)}
  actions={
    <>
      <Button onClick={() => setShowModal(false)}>Cancel</Button>
      <Button variant="danger" onClick={handleDelete}>Delete</Button>
    </>
  }
>
  Are you sure?
</Modal>
```

#### Card

```tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={`rounded-lg border bg-white p-4 shadow-sm ${className}`}>
      {children}
    </div>
  );
}
```

**Usage**:
```tsx
<Card>
  <h3>Product Title</h3>
  <p>Product description</p>
</Card>
```

#### Badge

```tsx
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  // Implementation
}
```

**Usage**:
```tsx
<Badge variant="success">Active</Badge>
<Badge variant="error">Error</Badge>
```

---

## Composed Components

### Product Card

The product card demonstrates polymorphic component patterns using discriminated unions:

```tsx
type ContentModel =
  | { type: 'course'; courseId: string; instructor: string; }
  | { type: 'article'; articleId: string; author: string; }
  | { type: 'event'; eventId: string; date: string; }
  | { type: 'item'; itemId: string; price: number; };

interface ProductCardProps {
  image: string;
  title: string;
  content: ContentModel;
  onSelect?: (id: string) => void;
}

export function ProductCard({
  image,
  title,
  content,
  onSelect,
}: ProductCardProps) {
  return (
    <Card onClick={() => onSelect?.(getId(content))}>
      <img src={image} alt={title} className="h-48 w-full object-cover" />
      <h3 className="mt-4 font-bold">{title}</h3>

      {content.type === 'course' && (
        <p className="text-sm text-gray-600">By {content.instructor}</p>
      )}
      {content.type === 'article' && (
        <p className="text-sm text-gray-600">By {content.author}</p>
      )}
      {content.type === 'event' && (
        <p className="text-sm text-gray-600">{content.date}</p>
      )}
      {content.type === 'item' && (
        <p className="text-lg font-bold text-blue-500">${content.price}</p>
      )}
    </Card>
  );
}
```

### Shelf (Grid/Scroll Container)

```tsx
interface ShelfProps {
  variant?: 'grid' | 'scroll';
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
}

export function Shelf({
  variant = 'grid',
  children,
  columns = 3,
}: ShelfProps) {
  if (variant === 'scroll') {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {children}
      </div>
    );
  }

  const colClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }[columns];

  return (
    <div className={`grid gap-4 ${colClass}`}>
      {children}
    </div>
  );
}
```

---

## Layout Components

### Header

Location: `client/src/components/layout/Header.tsx`

Features:
- Logo/site title on left
- Navigation links in center
- User menu on right
- Mobile hamburger menu
- Sticky positioning

### Footer

Location: `client/src/components/layout/Footer.tsx`

Features:
- Links to important pages
- Social media icons
- Copyright notice
- Simple, minimal design

### Navigation

Location: `client/src/components/layout/Navigation.tsx`

Features:
- Links to main sections
- Active link highlighting
- Mobile-responsive menu
- Accessible keyboard navigation

### User Badge

Location: `client/src/components/layout/UserBadge.tsx`

Features:
- Shows logged-in user name
- Dropdown menu (profile, logout)
- Loading state during auth

---

## Page Templates

### Authenticated Page Layout

```tsx
export default function ProtectedPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Page content */}
      </main>
      <Footer />
    </div>
  );
}
```

### Public Page Layout

```tsx
export default function PublicPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-16">
        {/* Page content */}
      </main>
      <Footer />
    </div>
  );
}
```

---

## Responsive Design

### Breakpoints

| Breakpoint | Size | Usage |
|-----------|------|-------|
| Mobile | 0-640px | Phones |
| Tablet | 641-1024px | Tablets |
| Desktop | 1025px+ | Desktops |

### Implementation

```tsx
// Mobile-first responsive grid
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  <Card />
  <Card />
  <Card />
</div>

// Responsive text size
<h1 className="text-2xl md:text-3xl lg:text-4xl">Title</h1>

// Hide on mobile
<div className="hidden md:block">
  Desktop-only content
</div>
```

---

## Accessibility

### Standards Compliance

- WCAG 2.1 AA as minimum standard
- Keyboard navigation support
- Screen reader support
- Color contrast ratio 4.5:1 minimum

### Implementation

```tsx
// Semantic HTML
<button aria-label="Close modal">×</button>
<input aria-describedby="email-error" type="email" />
<span id="email-error">Invalid email</span>

// ARIA labels
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>

// Focus management
<input
  type="text"
  onKeyDown={(e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }}
/>
```

---

## Form Design

### Form Structure

```tsx
export function ProductForm({ onSubmit }: { onSubmit: (data) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(productSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Form sections with spacing */}

      <div>
        <label htmlFor="name">Product Name</label>
        <Input
          {...register('name')}
          error={errors.name?.message}
        />
      </div>

      <div>
        <label htmlFor="price">Price</label>
        <Input
          {...register('price')}
          type="number"
          step="0.01"
          error={errors.price?.message}
        />
      </div>

      <Button type="submit">Save Product</Button>
    </form>
  );
}
```

### Form Validation Display

```tsx
// Show error below input
{error && (
  <p className="mt-1 text-sm text-red-500">{error}</p>
)}

// Show helper text
<p className="text-sm text-gray-600">
  Min 8 characters, numbers and symbols recommended
</p>

// Inline validation (as user types)
<Input
  status={isValidEmail ? 'success' : 'error'}
  onChange={handleChange}
/>
```

---

## Loading States

### Skeleton Loaders

```tsx
function ProductCardSkeleton() {
  return (
    <Card>
      <div className="h-48 bg-gray-200 animate-pulse rounded" />
      <div className="mt-4 h-4 bg-gray-200 animate-pulse rounded" />
      <div className="mt-2 h-4 w-2/3 bg-gray-200 animate-pulse rounded" />
    </Card>
  );
}
```

### Spinner Loader

```tsx
function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }[size];

  return (
    <div className={`${sizeClass} animate-spin`}>
      <svg className="w-full h-full text-blue-500" viewBox="0 0 24 24">
        {/* SVG content */}
      </svg>
    </div>
  );
}
```

---

## Error & Success States

### Toast Notifications

```tsx
// Success
showToast('Product created successfully', 'success');

// Error
showToast('Failed to save product', 'error');

// Warning
showToast('This action cannot be undone', 'warning');
```

### Error Pages

```tsx
export function ErrorPage({ status, message }: ErrorPageProps) {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">{status}</h1>
        <p className="mt-4 text-xl text-gray-600">{message}</p>
        <Link href="/" className="mt-8 inline-block">
          <Button>Go Home</Button>
        </Link>
      </div>
    </div>
  );
}
```

---

## Dark Mode (Future)

Reserved for Phase 2. When implemented, follow pattern:

```tsx
// Will use next-themes
import { useTheme } from 'next-themes';

export function Component() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="dark:bg-gray-900">
      {/* Content respects dark mode */}
    </div>
  );
}
```

---

## Animation & Transitions

### Micro-interactions

```tsx
// Smooth color change
<button className="transition-colors duration-200 hover:bg-blue-600" />

// Smooth opacity
<div className="transition-opacity duration-300 opacity-0 data-[open]:opacity-100" />

// Smooth transform
<div className="transition-transform duration-200 hover:scale-105" />
```

### Page Transitions

```tsx
// Using Next.js App Router (automatic)
// Smooth page transitions handled by layout
```

---

## Component Naming Convention

### Naming Pattern

```
[Domain][Component][Variant]

Examples:
- ProductCard
- ProductCardGrid (variant)
- AuthLoginForm
- ModalConfirm
- ButtonPrimary (if variants are separate components)
```

### File Organization

```
components/
├── ui/
│   ├── button.tsx
│   ├── modal.tsx
│   └── input.tsx
├── layout/
│   ├── header.tsx
│   ├── footer.tsx
│   └── navigation.tsx
├── item/
│   ├── ProductCard.tsx
│   └── ArticleCard.tsx
├── shelf/
│   └── Shelf.tsx
└── providers/
    ├── AuthProvider.tsx
    └── SWRProvider.tsx
```

---

## Design Tokens

### Summary Table

| Token | Value | Usage |
|-------|-------|-------|
| Primary Color | #3B82F6 | CTAs, active states |
| Border Radius | 8px | All rounded corners |
| Shadow | 0 1px 2px 0 rgba(0,0,0,0.05) | Cards, containers |
| Transition | 200ms | All transitions |
| Max Width | 1280px | Content container |

---

## Resources

- [TailwindCSS Documentation](https://tailwindcss.com)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Base UI Documentation](https://base-ui.com)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Design System Best Practices](https://www.designsystems.com)

---

## Design Review Checklist

Before merging UI changes:

- [ ] Follows color palette
- [ ] Proper spacing (8px grid)
- [ ] Typography scale respected
- [ ] Responsive on mobile/tablet/desktop
- [ ] Accessible (keyboard nav, screen readers)
- [ ] Loading states visible
- [ ] Error states handled
- [ ] Forms properly labeled
- [ ] Components reusable
- [ ] No layout shift issues
