# Time Components & Moment.js Integration

## Overview

The project uses custom time components powered by moment.js for consistent and reliable time formatting across all components. These components are designed to eliminate hydration issues by only rendering on the client side.

## Components

### TimeAgo
Displays relative time (e.g., "2 hours ago", "1 day ago")

```tsx
import { TimeAgo } from "@/components/ui/time"

<TimeAgo date={post.timestamp} className="text-sm text-muted-foreground" />
```

### FormattedDate
Displays formatted dates with customizable format strings

```tsx
import { FormattedDate } from "@/components/ui/time"

<FormattedDate date={new Date()} format="MMM DD, YYYY" />
<FormattedDate date={new Date()} format="dddd, MMMM Do YYYY" />
```

### Time
Flexible component that can display either relative time or formatted dates

```tsx
import { Time } from "@/components/ui/time"

// Relative time
<Time date={timestamp} fromNow />

// Formatted date
<Time date={timestamp} fromNow={false} format="MMMM Do, YYYY" />
```

## Hook

### useTime
Custom hook providing time formatting utilities

```tsx
import { useTime } from "@/hooks/use-time"

function MyComponent() {
  const { formatTimeAgo, formatDate, formatTime, getRelativeTime, isToday } = useTime()
  
  return (
    <div>
      <span>{formatTimeAgo(timestamp)}</span>
      <span>{formatDate(timestamp, "MMM DD, YYYY")}</span>
      <span>{isToday(timestamp) ? "Today" : formatDate(timestamp)}</span>
    </div>
  )
}
```

## Configuration

The moment.js configuration is centralized in `src/lib/moment-config.ts`:

```typescript
import moment from "moment"

moment.locale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "now",
    ss: "%ds",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "1d",
    dd: "%dd",
    M: "1M",
    MM: "%dM",
    y: "1y",
    yy: "%dy"
  }
})
```

## Benefits

1. **Consistent Formatting**: All timestamps use the same formatting logic
2. **Hydration Safe**: Components use client-side only rendering to prevent SSR mismatches
3. **Internationalization Ready**: Easy to add multiple locales
4. **Performance**: Efficient client-side rendering without external dependencies
5. **Flexibility**: Multiple ways to format time based on your needs

## Migration

Old code:
```tsx
import { formatTimeAgo } from "@/lib/utils"
<span>{formatTimeAgo(timestamp)}</span>
```

New code:
```tsx
import { TimeAgo } from "@/components/ui/time"
<TimeAgo date={timestamp} />
```

## Examples

You can see live examples of all time formatting options in the Settings → Appearance page. 