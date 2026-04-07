# Banquet Hall CRM - Booking Management System

A comprehensive CRM application for managing banquet hall bookings, customers, and event coordination.

## 🎯 Features

### Core Functionality
- **Dashboard** - Key metrics, upcoming events, occupancy rates, and recent bookings
- **Customer Management** - Full CRUD operations with search and booking history
- **Booking Management** - Kanban board for tracking bookings through the pipeline
  - Inquiry → Proposal Sent → Negotiation → Confirmed → Planning → In Progress → Completed
- **Hall Management** - Manage multiple banquet halls with details and pricing
- **Package Management** - Create and manage booking packages for each hall
- **Calendar View** - Visual calendar interface for viewing bookings by date
- **Reports & Analytics** - Comprehensive business insights and metrics

### Technical Features
- **Modern UI** - Built with Next.js 16 and Tailwind CSS
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **SQLite Database** - Lightweight and easy to set up
- **Prisma ORM** - Type-safe database queries
- **RESTful API** - Clean API architecture
- **Authentication** - Secure login system with JWT tokens

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up the database:**
   ```bash
   npx prisma migrate dev
   ```

3. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Demo Login
- **Email:** Any email (e.g., admin@banquet.com)
- **Password:** Any password (e.g., password)

The application uses a demo login that automatically authenticates users for demonstration purposes.

## 📁 Project Structure

```
Banquet-Hall-Booking/
├── app/
│   ├── api/              # API routes
│   │   ├── bookings/     # Booking CRUD operations
│   │   ├── customers/    # Customer CRUD operations
│   │   ├── dashboard/    # Dashboard statistics
│   │   ├── halls/        # Hall management
│   │   ├── packages/     # Package management
│   │   └── reports/      # Reports and analytics
│   ├── dashboard/        # Dashboard page
│   ├── bookings/         # Bookings Kanban board
│   ├── customers/        # Customer management
│   ├── halls/            # Hall management
│   ├── calendar/         # Calendar view
│   ├── reports/          # Reports page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page (redirects to dashboard)
│   └── globals.css       # Global styles
├── lib/
│   ├── prisma.ts         # Prisma client instance
│   └── auth.ts           # Authentication utilities
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Database migrations
├── public/               # Static assets
└── package.json
```

## 🗄️ Database Schema

### Models
- **User** - System users with roles (ADMIN, MANAGER, STAFF)
- **Customer** - Customer information and contact details
- **Hall** - Banquet hall details, capacity, pricing, and amenities
- **Package** - Booking packages associated with halls
- **Booking** - Booking records with status tracking

### Booking Status Flow
```
INQUIRY → PROPOSAL_SENT → NEGOTIATION → CONFIRMED → PLANNING → IN_PROGRESS → COMPLETED
                                                                        ↓
                                                                    CANCELLED
```

### Event Types
- Wedding
- Corporate
- Birthday
- Anniversary
- Conference
- Seminar
- Party
- Other

## 🎨 UI Components

### Dashboard
- Total bookings, active bookings, revenue, upcoming events
- Hall occupancy rate visualization
- Recent bookings table

### Bookings (Kanban Board)
- Drag-and-drop interface for managing booking status
- Visual cards showing customer, date, hall, and guest count
- Real-time status updates

### Customers
- Searchable customer list
- Customer details and booking history
- Add/Edit/Delete operations

### Halls
- Grid view of all halls
- Hall details including capacity, pricing, and amenities
- Active/Inactive status management

### Calendar
- Monthly calendar view
- Color-coded bookings by status
- Click on dates to view detailed bookings

### Reports
- Revenue analytics by event type
- Bookings distribution by status
- Top performing halls
- Monthly revenue trends

## 🔧 API Endpoints

### Customers
- `GET /api/customers` - List all customers (with search)
- `POST /api/customers` - Create customer
- `GET /api/customers/:id` - Get customer details
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Bookings
- `GET /api/bookings` - List all bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking

### Halls
- `GET /api/halls` - List all halls
- `POST /api/halls` - Create hall
- `GET /api/halls/:id` - Get hall details
- `PUT /api/halls/:id` - Update hall
- `DELETE /api/halls/:id` - Delete hall

### Packages
- `POST /api/packages` - Create package

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Reports
- `GET /api/reports?range=year` - Get report data (month/quarter/year/all)

## 🎯 Key Features Explained

### Drag-and-Drop Kanban
The bookings page features a drag-and-drop Kanban board where you can:
- Drag booking cards between columns to update their status
- View booking details at a glance
- Track bookings through the entire lifecycle

### Calendar Integration
The calendar view provides:
- Monthly navigation
- Visual indicators for bookings on each date
- Side panel showing detailed bookings for selected date
- Color coding by booking status

### Analytics & Reports
Comprehensive reporting including:
- Revenue breakdown by event type
- Booking distribution by status
- Top performing halls by revenue
- Monthly revenue trends with visual bars

## 🛠️ Technology Stack

- **Frontend:** Next.js 16 (React)
- **Styling:** Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** SQLite
- **ORM:** Prisma
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt

## 📝 Future Enhancements

- [ ] Email notifications for booking updates
- [ ] PDF invoice generation
- [ ] Advanced filtering and search
- [ ] User role-based permissions
- [ ] Multi-language support
- [ ] Payment integration tracking
- [ ] Event coordination checklists
- [ ] File upload for contracts
- [ ] SMS notifications
- [ ] Mobile app version

## 🤝 Contributing

This is a demonstration project. Feel free to fork and customize for your needs.

## 📄 License

MIT

## 👨‍💻 Author

Built with ❤️ for banquet hall booking management
