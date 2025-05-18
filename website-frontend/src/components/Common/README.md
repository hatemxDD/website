# Loading Components

This directory contains reusable loading components for the website-frontend project.

## Components Overview

### 1. LoadingSkeleton

A basic building block for creating loading states with pulsing animation.

```tsx
import { LoadingSkeleton } from '../components/Common';

// Basic usage
<LoadingSkeleton type="text" />

// Custom dimensions
<LoadingSkeleton type="image" width="100%" height="300px" />

// Multiple paragraphs
<LoadingSkeleton type="paragraph" count={3} />
```

#### Props

- `type` (required): Defines the skeleton style and default dimensions
  - Options: `text`, `title`, `paragraph`, `image`, `button`, `tag`, `card`, `avatar`, `circle`, `container`
- `width`: Custom width (overrides the default for the type)
- `height`: Custom height (overrides the default for the type)
- `count`: Number of skeleton items to render (for repeated elements)
- `className`: Additional CSS classes
- `style`: Additional inline styles
- `fullWidth`: Whether paragraph skeletons should be full width

### 2. LoadingState

Pre-configured loading states for common UI patterns.

```tsx
import { LoadingState } from '../components/Common';

// Basic usage - for a card layout
<LoadingState type="card" />

// Detail view loading (like for news articles, product pages)
<LoadingState type="detail" />

// Table with 5 rows
<LoadingState type="table" count={5} />

// List with 3 items and no images
<LoadingState type="list" count={3} withImage={false} />
```

#### Props

- `type` (required): The UI pattern to generate a loading state for
  - Options: `card`, `list`, `detail`, `table`, `profile`, `article`, `form`, `gallery`, `grid`
- `count`: Number of items to render (for lists, tables, grids)
- `className`: Additional CSS classes
- `withImage`: Whether to include image placeholders
- `withActions`: Whether to include action button placeholders

## Usage Examples

### For Pages/Components

Replace loading states in components:

```tsx
import { LoadingState } from '../components/Common';

const MyComponent = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch data...
  }, []);

  if (loading) {
    return <LoadingState type="detail" />;
  }

  return (
    // Your actual component
  );
};
```

### Custom Loading States

Combine LoadingSkeleton components for custom layouts:

```tsx
import { LoadingSkeleton } from "../components/Common";

const CustomLoadingState = () => (
  <div className="my-custom-layout">
    <div className="header">
      <LoadingSkeleton type="title" width="60%" />
      <LoadingSkeleton type="text" width="40%" />
    </div>

    <div className="sidebar">
      <LoadingSkeleton type="image" height="200px" />
      <LoadingSkeleton type="paragraph" count={3} />
    </div>

    <div className="main-content">
      <LoadingSkeleton type="title" />
      <LoadingSkeleton type="paragraph" count={6} fullWidth />
    </div>
  </div>
);
```

## Dark Mode Support

Both components fully support dark mode with the `dark` class. When the parent application is in dark mode, the loading animations will automatically adapt to the dark theme.
