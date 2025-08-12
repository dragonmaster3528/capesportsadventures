# Cape Sports Adventures Website

A responsive static website for Cape Sports Adventures, Cape Town's premier sports tourism and outdoor adventure company.

## Project Structure

```
capesportsadventures/
├── index.html                  # Main homepage
├── css/
│   └── style.css              # Main stylesheet with responsive design
├── js/
│   └── main.js               # Interactive JavaScript functionality
├── images/                    # Image assets organized by category
│   ├── hero/                 # Hero section backgrounds
│   ├── sports/               # Sports-related imagery
│   ├── golf/                 # Golf course and equipment photos
│   ├── adventure/            # Adventure activity images
│   ├── team/                 # Team and staff photos
│   └── README.md             # Image guidelines and requirements
├── pages/                     # Individual service pages
│   ├── tours.html            # Team sports tours and exchanges
│   ├── golf.html             # Golf experiences and courses
│   ├── fan-packages.html     # Fan experience packages
│   └── adventure.html        # Adventure activities
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Pages deployment workflow
├── netlify.toml              # Netlify deployment configuration
└── README.md                 # This file
```

## Features

### Homepage (`index.html`)
- **Hero Section**: Compelling introduction with call-to-action buttons
- **Service Overview**: Cards highlighting key services
- **Sports Tours Preview**: Quick overview of rugby, cricket, football, hockey
- **Golf Showcase**: Featured golf experiences
- **Fan Packages**: Match-day experiences preview
- **Adventure Activities**: Adventure categories overview
- **Contact Form**: Functional contact form with validation

### Individual Service Pages
- **Sports Tours** (`pages/tours.html`): Detailed information about team tours for each sport
- **Golf Experiences** (`pages/golf.html`): Championship courses, packages, and services
- **Fan Packages** (`pages/fan-packages.html`): VIP match experiences and hospitality
- **Adventure Activities** (`pages/adventure.html`): Ocean, mountain, and cultural adventures

### Technical Features
- **Responsive Design**: Mobile-first approach with optimized layouts
- **Modern CSS**: Custom properties, Grid, Flexbox, smooth animations
- **Interactive JavaScript**: Mobile navigation, form handling, smooth scrolling
- **Semantic HTML5**: Accessible and SEO-friendly markup
- **Performance Optimized**: Fast loading times, minimal dependencies

## Getting Started

### Local Development

1. **Clone or download** the project files
2. **Open `index.html`** in a web browser to view the homepage
3. **Navigate between pages** using the navigation menu

For a better development experience with live reload:

```bash
# Using Python (if installed)
python -m http.server 8000
# Then open http://localhost:8000

# Using Node.js (if installed)
npx serve .
# Then open the provided URL

# Using PHP (if installed)
php -S localhost:8000
# Then open http://localhost:8000
```

### File Organization

- Keep **images** in the appropriate `/images/` subdirectories
- **CSS modifications** should be made in `/css/style.css`
- **JavaScript updates** go in `/js/main.js`
- **New pages** should be added to the `/pages/` directory

## Deployment Options

### Option 1: GitHub Pages

1. **Create a GitHub repository** and upload all project files
2. **Enable GitHub Pages** in repository Settings > Pages
3. **Select source**: Deploy from a branch (main/master)
4. **Automatic deployment**: The included GitHub Action (`.github/workflows/deploy.yml`) will deploy automatically on push

**GitHub Pages URL format**: `https://[username].github.io/[repository-name]`

### Option 2: Netlify

#### Method A: Git Repository
1. **Connect your GitHub repository** to Netlify
2. **Deploy settings**: 
   - Build command: (leave empty for static site)
   - Publish directory: `/` (root)
3. **Automatic deployment** will trigger on git push

#### Method B: Drag & Drop
1. **Zip all project files** (excluding `.git` folder if present)
2. **Drag and drop** the zip file to Netlify's deploy area
3. **Instant deployment** with auto-generated URL

**Netlify features** (configured in `netlify.toml`):
- Custom headers for security
- Automatic redirects for cleaner URLs
- Performance optimizations

### Option 3: Other Hosting Providers

This static website will work with any hosting provider that serves HTML files:
- **Vercel**: Connect GitHub repo for automatic deployment
- **AWS S3**: Upload files and configure for static website hosting
- **Firebase Hosting**: Deploy using Firebase CLI
- **DigitalOcean App Platform**: Connect repository for automatic builds

## Customization Guide

### Updating Content

1. **Text Content**: Edit HTML files directly
   - Homepage: `index.html`
   - Service pages: Files in `/pages/` directory

2. **Contact Information**: Update in multiple locations:
   - Footer sections in all HTML files
   - Contact form action (currently placeholder)
   - Phone numbers and email addresses

3. **Images**: Replace placeholder images in `/images/` directories
   - Follow the guidelines in `/images/README.md`
   - Update image paths in HTML files if needed

### Styling Changes

The CSS is organized using custom properties (CSS variables) for easy theming:

```css
:root {
    --color-primary: #1e40af;      /* Main brand color */
    --color-secondary: #059669;    /* Accent color */
    --color-accent: #f59e0b;       /* Highlight color */
    /* Update these to change the entire color scheme */
}
```

**Key sections in `/css/style.css`:**
- **Variables**: Colors, fonts, spacing defined at the top
- **Layout**: Grid systems and responsive containers
- **Components**: Reusable UI elements (buttons, cards, forms)
- **Sections**: Page-specific styling

### Adding New Pages

1. **Create HTML file** in `/pages/` directory
2. **Copy structure** from existing page (maintain header/footer consistency)
3. **Update navigation** in all files to include new page
4. **Add appropriate CSS** classes for new content

### JavaScript Functionality

**Current features** in `/js/main.js`:
- Mobile navigation toggle
- Smooth scrolling navigation
- Form validation and submission
- Scroll-based animations
- Header styling on scroll

**To add new features:**
- Follow existing code patterns
- Use vanilla JavaScript (no framework dependencies)
- Ensure mobile compatibility

## Content Management

### Adding Sports Tours
- Update `/pages/tours.html` with new sports or programs
- Add corresponding images to `/images/sports/`
- Update homepage preview if needed

### Adding Golf Courses
- Add new course information to `/pages/golf.html`
- Include course images in `/images/golf/`
- Update package descriptions as needed

### Adding Adventures
- Expand `/pages/adventure.html` with new activities
- Organize adventure images in `/images/adventure/`
- Update safety information if requirements change

## Performance Tips

1. **Optimize Images**:
   - Use WebP format for better compression
   - Resize images to appropriate dimensions
   - Add lazy loading for below-the-fold images

2. **Minimize CSS/JS**:
   - Remove unused CSS rules
   - Minimize JavaScript for production

3. **Use CDN**:
   - Consider using a CDN for faster global delivery
   - Netlify and GitHub Pages include CDN by default

## Browser Support

**Supported Browsers:**
- Chrome 88+
- Firefox 78+
- Safari 14+
- Edge 88+
- iOS Safari 14+
- Android Chrome 88+

**Progressive Enhancement:**
- Core functionality works on older browsers
- Enhanced features activate on modern browsers
- Graceful degradation for unsupported features

## SEO Optimization

**Built-in SEO features:**
- Semantic HTML5 structure
- Meta descriptions on all pages
- Proper heading hierarchy
- Alt text for images (when added)
- Clean URL structure
- Fast loading times

**Additional SEO recommendations:**
1. Add **Google Analytics** tracking code
2. Create **XML sitemap**
3. Add **Open Graph** meta tags for social sharing
4. Include **structured data** markup
5. Set up **Google Search Console**

## Accessibility Features

- **Semantic HTML** with proper roles and labels
- **Keyboard navigation** support
- **ARIA labels** for interactive elements
- **Color contrast** meets WCAG guidelines
- **Focus indicators** for all interactive elements
- **Screen reader** friendly structure

## Security Considerations

**Implemented security headers** (via `netlify.toml`):
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

**Form Security:**
- Client-side validation (always validate server-side too)
- Consider adding CAPTCHA for production contact forms
- Use HTTPS for all form submissions

## Maintenance

### Regular Updates
- **Content**: Keep tour information and prices current
- **Images**: Refresh with new, high-quality photos
- **Contact Info**: Ensure all contact details are accurate
- **Dependencies**: Monitor for any security updates

### Monitoring
- **Analytics**: Track visitor behavior and popular pages
- **Performance**: Monitor loading times and Core Web Vitals
- **Errors**: Check for broken links and form issues
- **Mobile**: Regularly test on actual mobile devices

## Support & Development

### Common Issues

1. **Images not loading**: Check file paths and case sensitivity
2. **Mobile menu not working**: Verify JavaScript file is loading
3. **Styling issues**: Check CSS file path and browser cache
4. **Form not submitting**: Implement server-side form handler

### Getting Help

- **Documentation**: Refer to this README and code comments
- **Community**: Search for HTML/CSS/JavaScript solutions online
- **Professional Help**: Consider hiring a web developer for major changes

### Future Enhancements

**Potential improvements:**
- **Content Management System** (CMS) integration
- **Online booking system** with payment processing
- **Multi-language support** for international visitors
- **Blog section** for SEO and content marketing
- **Customer testimonials** and review system
- **Photo gallery** with lightbox functionality

## License

© 2024 Cape Sports Adventures. All rights reserved.

This website template and code are proprietary to Cape Sports Adventures. Modification and use are permitted for the intended business operations.