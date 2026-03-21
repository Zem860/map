# MAP — Online Bookstore & Admin Dashboard

> A full-featured e-commerce bookstore platform with real-time admin dashboard, built with modern React technologies.

**🔗 Live Demo:** https://zem860.github.io/map/

> **Disclaimer:** This is an educational/personal project inspired by Book Depository's design. This project is not affiliated with or endorsed by Book Depository or its parent companies.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [installation](#installation)
- [Development](#development)
- [Build & Deployment](#build--deployment)
- [Project Architecture](#project-architecture)
- [Key Components](#key-components)

---

## 🎯 Overview

**MAP** is a full-stack bookstore web application featuring:

- A **public-facing storefront** for browsing and purchasing books
- A **comprehensive admin dashboard** for managing inventory, orders, and content
- **Real-time geolocation visualization** using interactive maps
- **Modern UI/UX** built with Radix UI and Tailwind CSS
- **Type-safe development** with TypeScript
- **Optimized performance** with Vite and React 19

The application demonstrates industry best practices in component architecture, state management, API integration, and form handling.

---

## ✨ Key Features

### 👥 **Public Storefront**

- **Home Page** — Featured products, categories, and promotional content
- **Product Catalog** — Browse books by category (Fiction, Sci-Fi, History, Young Adult)
- **Product Details** — Full product information with image gallery and customer reviews
- **Shopping Cart** — Add/remove items, persistent cart state
- **Order Management** — Checkout flow and payment processing
- **Articles & Blog** — Read book reviews, industry news, and curated content
- **Real-time Map** — Interactive Leaflet map showing store locations and delivery zones
- **About Page** — Company information and contact details

### 🛠️ **Admin Dashboard**

- **Products Management** — Create, edit, delete books with image uploads
- **Orders Management** — View, track, and manage customer orders
- **Articles Management** — Create and manage blog content with featured images
- **Coupon System** — Generate and manage promotional discount codes
- **Dashboard Analytics** — Revenue charts, top products, and recent orders (currently using mock data)
- **Real-time Statistics** — Live sales metrics and inventory overview (partially implemented with mock data; some views include basic statistical logic)

---

## 🏗️ Technology Stack

### **Frontend Frameworks & Libraries**

| Technology           | Version | Purpose                                  |
| -------------------- | ------- | ---------------------------------------- |
| **React**            | 19.2.0  | UI library and component framework       |
| **TypeScript**       | ~5.9.3  | Static type checking and IDE support     |
| **React Router DOM** | 7.10.1  | Client-side routing and navigation       |
| **Vite**             | 7.2.4   | Lightning-fast build tool and dev server |

### **State Management**

| Technology  | Version | Purpose                             |
| ----------- | ------- | ----------------------------------- |
| **Zustand** | 5.0.9   | Lightweight global state management |

### **Form Handling & Validation**

| Technology          | Version | Purpose                              |
| ------------------- | ------- | ------------------------------------ |
| **React Hook Form** | 7.69.0  | Performant, flexible form management |

### **UI Components & Styling**

| Technology                   | Version    | Purpose                                   |
| ---------------------------- | ---------- | ----------------------------------------- |
| **Radix UI**                 | 1.4.3      | Unstyled, accessible component primitives |
| **shadcn/ui**                | (built-in) | Pre-styled Radix UI components            |
| **Tailwind CSS**             | 4.1.17     | Utility-first CSS framework               |
| **Lucide React**             | 0.556.0    | Icon library (556+ icons)                 |
| **class-variance-authority** | 0.7.1      | CSS class composition                     |
| **tailwind-merge**           | 3.4.0      | Tailwind class conflict resolver          |

### **Data Fetching & API**

| Technology | Version | Purpose                       |
| ---------- | ------- | ----------------------------- |
| **Axios**  | 1.13.2  | HTTP client with interceptors |

### **Visualization & Geographic Features**

| Technology   | Version | Purpose                                   |
| ------------ | ------- | ----------------------------------------- |
| **Leaflet**  | 1.9.4   | Interactive map library                   |
| **Recharts** | 2.15.4  | Composable charting library for analytics |

### **Date & Time**

| Technology           | Version | Purpose                     |
| -------------------- | ------- | --------------------------- |
| **date-fns**         | 4.1.0   | Modern date utility library |
| **react-day-picker** | 9.13.0  | Date picker component       |

### **Loading & UI Enhancements**

| Technology               | Version | Purpose                    |
| ------------------------ | ------- | -------------------------- |
| **react-loader-spinner** | 8.0.0   | Loading spinner animations |

### **Build & Development Tools**

| Technology               | Version                               | Purpose                             |
| ------------------------ | ------------------------------------- | ----------------------------------- |
| **ESLint**               | 9.39.1                                | Code quality and linting            |
| **PostCSS**              | 8.5.6                                 | CSS transformation tool             |
| **Autoprefixer**         | 10.4.22                               | Vendor prefix automation            |
| **@vitejs/plugin-react** | 5.1.1                                 | Vite React plugin with Fast Refresh |
| **@tailwindcss/vite**    | 4.1.17                                | Tailwind CSS Vite plugin            |
| **Prettier**             | Code formatting and style consistency |

The project uses **ESLint** for code quality checks and **Prettier** for enforcing a consistent code style.

All files follow a unified formatting configuration (2-space indentation, single quotes, and trailing commas), ensuring consistency across the codebase and improving collaboration.

To format the project:

```bash
npx prettier . --write
```
### **Deployment**

| Technology   | Version | Purpose                      |
| ------------ | ------- | ---------------------------- |
| **gh-pages** | 6.3.0   | GitHub Pages deployment tool |

---

## 📝 Scripts Reference

| Script      | Command           | Purpose                                        |
| ----------- | ----------------- | ---------------------------------------------- |
| **dev**     | `npm run dev`     | Start development server with HMR              |
| **build**   | `npm run build`   | Compile TypeScript and build production bundle |
| **lint**    | `npm run lint`    | Run ESLint code quality checks                 |
| **preview** | `npm run preview` | Preview production build locally               |
| **deploy**  | `npm run deploy`  | Build and deploy to GitHub Pages               |

---

## 🎨 UI Components Library

The project includes **25+ pre-built shadcn/ui components**:

**Form Components:**

- Button, Input, Textarea, Select, Checkbox, Switch, Label

**Layout Components:**

- Card, Dialog, Sheet, Popover, Dropdown Menu

**Data Display:**

- Table, Pagination, Progress, Badge

**Date/Time:**

- Calendar (react-day-picker integration)

**Chart/Analytics:**

- Chart (Recharts-powered)

All components are **accessible**, **keyboard-navigable**, and **fully customizable** via Tailwind CSS.

---

## 📄 License

This project is for **educational purposes**. Inspired by Book Depository's design philosophy.

**Project Author:** [zem860](https://github.com/zem860)

---

## 🙏 Acknowledgments

- **React Team** — For the powerful UI library
- **Vite Team** — For the blazing-fast build tool
- **Radix UI Team** — For accessible component primitives
- **Tailwind Labs** — For the utility-first CSS framework
- **Zustand Creator** — For lightweight state management
- **Hexschool** — For API and Teaching Resources
```
