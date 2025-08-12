# Images Directory

This directory contains all visual assets for the Cape Sports Adventures website.

## Directory Structure

```
images/
├── hero/           # Hero section backgrounds and banners
├── sports/         # Sports-specific imagery (rugby, cricket, football, hockey)
├── golf/           # Golf course and golf-related images
├── adventure/      # Adventure activity photos (hiking, diving, etc.)
├── team/           # Team photos and staff images
└── .gitkeep        # Ensures directory is tracked in Git
```

## Image Guidelines

### File Formats
- **Photos**: Use WebP format for better compression (fallback to JPG)
- **Graphics/Icons**: Use SVG for scalable vector graphics
- **Logos**: Use SVG or PNG with transparency

### Sizing Guidelines
- **Hero Images**: 1920x1080px (16:9 ratio)
- **Section Headers**: 1200x400px (3:1 ratio)
- **Card Images**: 400x300px (4:3 ratio)
- **Team Photos**: 300x300px (1:1 ratio - square)

### Optimization
- Compress all images before upload
- Use responsive image techniques with `srcset`
- Provide alt text for accessibility
- Consider lazy loading for below-the-fold images

### Recommended Images Needed

#### Hero Section
- `hero-cape-town.jpg` - Cape Town cityscape with Table Mountain
- `hero-sports-action.jpg` - Dynamic sports action shot

#### Sports Section
- `rugby-action.jpg` - Rugby match or training
- `cricket-newlands.jpg` - Newlands Cricket Ground
- `football-stadium.jpg` - Cape Town Stadium
- `hockey-team.jpg` - Hockey action or team

#### Golf Section
- `golf-course-aerial.jpg` - Aerial view of Cape golf course
- `golf-player-sunset.jpg` - Golfer at sunset
- `fancourt-course.jpg` - Fancourt golf course
- `pinnacle-point.jpg` - Pinnacle Point ocean views

#### Adventure Section
- `table-mountain-hike.jpg` - Hikers on Table Mountain
- `shark-cage-diving.jpg` - Shark cage diving experience
- `paragliding-signal-hill.jpg` - Paragliding over Cape Town
- `wine-tasting.jpg` - Wine tasting in Stellenbosch

#### Team Section
- `team-group.jpg` - Cape Sports Adventures team
- `guide-portrait.jpg` - Professional guide portrait

## Usage in HTML

```html
<!-- Responsive image with WebP format -->
<picture>
  <source srcset="images/hero/cape-town.webp" type="image/webp">
  <img src="images/hero/cape-town.jpg" alt="Cape Town skyline with Table Mountain" loading="lazy">
</picture>

<!-- Simple image with proper alt text -->
<img src="images/sports/rugby-action.jpg" alt="Rugby players in action during a Springbok match" loading="lazy">
```

## Copyright and Licensing

Ensure all images used have proper licensing:
- Use royalty-free stock photos
- Commission original photography
- Obtain proper attribution for Creative Commons images
- Keep records of image sources and licenses