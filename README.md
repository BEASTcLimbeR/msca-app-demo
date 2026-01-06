# Mobile App Demo

A mobile-first web application demo built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

1. **Install dependencies** (already done):
   ```bash
   npm install
   ```

2. **Run the development server**:
```bash
npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
app-demo-design/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page
│   ├── qr-scanner/        # QR scanner page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── MobileContainer.tsx  # Mobile-first container wrapper
│   └── QRScanner.tsx       # QR code scanner component
├── public/
│   └── designs/          # 📍 ADD YOUR SVG DESIGN FILES HERE
└── package.json
```

## 🎨 Adding Your Designs

1. **Add SVG files** to `public/designs/` folder
2. **Reference them** in your components like this:
   ```tsx
   import Image from 'next/image';
   
   <Image 
     src="/designs/your-screen.svg" 
     alt="Screen design"
     width={375}
     height={812}
   />
   ```

## 📱 Features

- ✅ **Mobile-first design** - Constrained to 428px max width, centered on desktop
- ✅ **QR Scanner** - Working QR code scanner using device camera
- ✅ **Responsive layout** - Looks great on all devices
- ✅ **TypeScript** - Type-safe development
- ✅ **Tailwind CSS** - Utility-first styling

## 🔧 Available Pages

- `/` - Home page
- `/qr-scanner` - QR code scanner demo

## 📦 Dependencies

### Core
- **Next.js 16** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

### Features
- **html5-qrcode** - QR code scanning
- **lucide-react** - Beautiful icon library
- **framer-motion** - Smooth animations
- **clsx** - Utility for conditional classNames

## 🎯 Next Steps

1. Add your SVG design files to `public/designs/`
2. Create new pages in `app/` directory
3. Build components matching your design theme
4. Customize colors and styles in `app/globals.css`

## 💡 Tips

- The `MobileContainer` component ensures your app looks mobile-native
- All pages are automatically responsive
- Use Tailwind classes for quick styling
- Check browser console for QR scanner debugging

---

**Ready to add your designs!** 🎨
