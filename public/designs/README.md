# Designs Folder

**Add your SVG design files here!**

## How to use:

1. Copy your SVG design files into this folder
2. Reference them in your components using Next.js Image component:

```tsx
import Image from 'next/image';

// In your component:
<Image 
  src="/designs/home-screen.svg" 
  alt="Home screen design"
  width={375}
  height={812}
  className="w-full h-auto"
/>
```

## File naming suggestions:

- `home-screen.svg`
- `qr-scanner-screen.svg`
- `profile-screen.svg`
- etc.

The files will be accessible at `/designs/your-filename.svg` in your app.

