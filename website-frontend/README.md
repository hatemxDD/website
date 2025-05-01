# Research Excellence in Energy & Environment

A modern, visually stunning website for a research laboratory focused on energy and environmental sciences.

## Features

- **Modern Design**: Clean, professional interface with a science and innovation theme
- **Interactive Elements**: Animated particles, micro-animations, and hover effects
- **Responsive Layout**: Fully responsive design that works on all device sizes
- **Dynamic Content**: Carousel-style project showcase and team member profiles
- **Visual Appeal**: Dark-to-light gradient backgrounds, glassmorphism effects, and modern typography

## Technologies Used

- React with TypeScript
- Framer Motion for animations
- React Particles for the interactive particle background
- React Icons for minimalist line icons
- CSS with modern features (grid, flexbox, variables)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/research-lab-website.git
   cd research-lab-website
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

- `src/components/Home/` - Homepage components and styles
- `src/components/Dashboard/` - Dashboard components for authenticated users
- `src/context/` - React context for state management
- `public/images/` - Static images and assets

## Customization

### Colors

The color scheme can be customized by modifying the CSS variables in `src/components/Home/Home.css`:

```css
:root {
  --primary-color: #3b82f6;
  --primary-dark: #2563eb;
  --secondary-color: #10b981;
  --accent-color: #6366f1;
  --dark-navy: #0f172a;
  --light-navy: #1e293b;
  --sky-blue: #0ea5e9;
  --light-gray: #f1f5f9;
  --white: #ffffff;
  /* ... other variables ... */
}
```

### Content

Update the content by modifying the data in `src/components/Home/Home.tsx`:

- `featuredProjects` array for project information
- `teamMembers` array for team member profiles

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Icons provided by [React Icons](https://react-icons.github.io/react-icons/)
- Particle effects powered by [TSParticles](https://particles.js.org/)
- Animations created with [Framer Motion](https://www.framer.com/motion/)
