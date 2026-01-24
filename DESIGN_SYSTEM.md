# Design System: Vercel Best Practices Report Viewer

## 1. Design Principles
- **Aesthetic:** Minimal, Clean, Professional (Vercel-like).
- **Density:** High density for code and data, comfortable density for summaries.
- **Mode:** Dark/Light mode support (System default).
- **Focus:** Content-first, unobtrusive UI.

## 2. Color Palette
Using Tailwind CSS `zinc` for neutrals and `blue` for primary actions.

### Neutrals (Zinc)
- **Background:** `bg-background` (White / Zinc-950)
- **Foreground:** `text-foreground` (Zinc-950 / Zinc-50)
- **Muted:** `bg-muted` (Zinc-100 / Zinc-800)
- **Border:** `border-border` (Zinc-200 / Zinc-800)

### Semantic Colors
- **Primary:** `bg-primary` (Zinc-900 / Zinc-50) - For main actions (Upload).
- **Destructive:** `bg-destructive` (Red-500) - For high severity violations.
- **Success:** `text-green-600` - For fixes/suggestions.
- **Warning:** `text-yellow-600` - For medium severity.
- **Info:** `text-blue-600` - For informational notes.

## 3. Typography
- **Font Family:** `Inter`, `sans-serif` (Default Tailwind sans).
- **Headings:** Bold, tight tracking.
- **Code:** `JetBrains Mono` or `Fira Code` (Monospace).

## 4. Components (shadcn/ui)
The following components will be used:
- **Card:** For report summaries and file blocks.
- **Table:** For listing violations.
- **Badge:** For severity levels and categories.
- **Button:** For actions.
- **ScrollArea:** For long code blocks.
- **Tabs:** To switch between Summary and Details.
- **Accordion:** For collapsible code details.
- **Separator:** Visual division.

## 5. Layout Structure
1.  **Header:** Logo/Title, Theme Toggle, Upload Button (if not on empty state).
2.  **Main Content:**
    *   **Empty State:** Drag & drop zone.
    *   **Dashboard:**
        *   **Stats Row:** Total files, Total errors, Score.
        *   **Breakdown:** Chart or List of categories.
        *   **File List:** Filterable list of files with issues.
3.  **Detail View:**
    *   Side-by-side or stack view of code with highlighted issues.

## 6. Iconography
- Library: `lucide-react`
- Style: 1.5px stroke width, consistent sizing (16px, 20px).
