# ZONE v.2 - Complete Business Management System

![ZONE v.2](https://img.shields.io/badge/ZONE-v.2-red?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-green?style=for-the-badge&logo=fastapi)
![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-green?style=for-the-badge&logo=mongodb)

## 🎯 Overview

**ZONE v.2** adalah sistem manajemen bisnis yang komprehensif dan terintegrasi, dirancang untuk mengelola seluruh aspek operasional perusahaan dari penjualan, pembelian, inventori, manufaktur, marketing, franchise, hingga akuntansi dan sistem manajemen.

### ✨ Key Features

- **🔄 End-to-End Business Management** - Mengelola seluruh siklus bisnis
- **⚡ Real-time Integration** - Semua modul terintegrasi secara real-time
- **🤖 AI-Powered Automation** - Sistem automasi berbasis AI
- **🎨 Modern UI/UX** - Interface yang modern dan intuitif
- **📈 Scalable Architecture** - Arsitektur yang dapat dikembangkan
- **🔐 Role-based Access Control** - Kontrol akses berdasarkan role

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   React 18.2.0  │◄──►│   FastAPI       │◄──►│   MongoDB       │
│   Tailwind CSS  │    │   Python 3.8+   │    │   Motor AsyncIO │
│   shadcn/ui     │    │   Uvicorn       │    │   Pydantic      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📚 Modules

### 🛒 Sales Management
- **Customer Management** - CRUD customer dengan rating system
- **Sales Order** - Manajemen sales order dengan status tracking
- **Quotation** - Sistem quotation dengan workflow approval
- **Sales Invoice** - Invoice penjualan dengan payment tracking

### 🛍️ Purchase Management
- **Vendor Management** - Manajemen vendor dengan performance tracking
- **Purchase Order** - Order pembelian dengan status tracking
- **Purchase Invoice** - Invoice pembelian dengan payment tracking

### 📦 Inventory Management
- **Products** - Manajemen produk dan inventori
- **Stock Opname** - Stock opname dengan variance tracking
- **Transfer Stock** - Transfer stock antar warehouse

### 🏭 Manufacturing Management
- **Production Order** - Order produksi dengan BOM dan progress tracking
- **Manufacturing** - Sistem manufaktur lengkap

### 📢 Marketing Management
- **Marketing Campaign** - Manajemen campaign dengan ROI tracking
- **Marketing** - CRM dan marketing tools

### 🏪 Franchise Management
- **Franchise Partner** - Manajemen franchise partner dengan performance tracking
- **Franchise** - Sistem franchise lengkap

### 💰 Accounting Management
- **Chart of Accounts** - Chart of accounts dengan struktur hierarkis
- **General Journal** - Jurnal umum dengan double-entry bookkeeping
- **Financial Reports** - Laporan keuangan dan analisis

### ⚙️ System Management
- **User Management** - Manajemen pengguna dengan role-based access
- **Settings** - Pengaturan sistem lengkap
- **Dashboard** - Dashboard utama dengan statistik real-time

## 🚀 Quick Start

### Prerequisites
- Node.js 16.0+
- Python 3.8+
- MongoDB 4.4+

### Installation

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd ZONE-v.2
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn server:app --host 0.0.0.0 --port 8000 --reload
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Access Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## 🛠️ Technology Stack

### Frontend
- **React 18.2.0** - Modern React dengan hooks
- **Tailwind CSS 3.3.0** - Utility-first CSS framework
- **shadcn/ui** - Modern component library
- **Lucide React** - Beautiful icon library
- **React Router DOM** - Client-side routing

### Backend
- **FastAPI 0.104.1** - Modern, fast web framework
- **MongoDB** - NoSQL database
- **Motor AsyncIO** - Async MongoDB driver
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

## 📊 Features

### 🔄 Real-time Integration
- Semua modul terintegrasi secara real-time
- Data synchronization antar modul
- Cross-module dependencies

### 🎨 Modern UI/UX
- Responsive design untuk semua device
- Consistent design system
- Intuitive user interface
- Dark/Light theme support

### 🔐 Security
- Role-based access control
- User authentication
- Data validation
- Secure API endpoints

### 📈 Analytics & Reporting
- Real-time statistics
- Performance metrics
- Business intelligence
- Custom reports

## 📁 Project Structure

```
ZONE-v.2/
├── backend/
│   ├── server.py              # FastAPI application
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── ui/           # Reusable UI components
│   │   │   ├── Customer.jsx  # Customer management
│   │   │   ├── SalesOrder.jsx # Sales order management
│   │   │   └── ...           # Other modules
│   │   ├── App.js            # Main application
│   │   └── index.js          # Entry point
│   └── package.json          # Node.js dependencies
└── README.md                 # This file
```

## 🔗 API Endpoints

### Authentication
```javascript
POST /api/auth/login           // User login
POST /api/auth/logout          // User logout
```

### Sales
```javascript
GET    /api/customers          // List customers
POST   /api/customers          // Create customer
GET    /api/sales-orders       // List sales orders
POST   /api/sales-orders       // Create sales order
GET    /api/quotations         // List quotations
POST   /api/quotations         // Create quotation
```

### Purchase
```javascript
GET    /api/vendors            // List vendors
POST   /api/vendors            // Create vendor
GET    /api/purchase-orders    // List purchase orders
POST   /api/purchase-orders    // Create purchase order
```

### Inventory
```javascript
GET    /api/products           // List products
POST   /api/products           // Create product
GET    /api/stock-opname       // List stock opnames
POST   /api/stock-opname       // Create stock opname
```

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm test
```

### Backend Testing
```bash
cd backend
python -m pytest
```

## 🚀 Deployment

### Production Build
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
gunicorn server:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Docker Deployment
```bash
docker-compose up -d
```

## 📈 Performance

- **Frontend**: Optimized with code splitting and lazy loading
- **Backend**: Async operations with MongoDB
- **Database**: Indexed queries for optimal performance
- **Caching**: Redis integration for frequently accessed data

## 🔧 Development

### Adding New Modules
1. Create component in `src/components/`
2. Add to `App.js` routing
3. Add to `Sidebar.jsx` navigation
4. Create API endpoints in backend

### Code Style
- ESLint for JavaScript/React
- Prettier for code formatting
- TypeScript support (optional)

## 📚 Documentation

- **Complete Documentation**: [ZONE_v2_Documentation.md](ZONE_v2_Documentation.md)
- **User Guide**: [USER_GUIDE.md](USER_GUIDE.md) - Complete user guide for all modules
- **Quick Start Guide**: [QUICK_START_GUIDE.md](QUICK_START_GUIDE.md) - Get started in 5 minutes
- **Tutorial**: [TUTORIAL.md](TUTORIAL.md) - Step-by-step tutorial for all features
- **API Documentation**: [API.md](API.md) - Complete API documentation
- **Features**: [FEATURES.md](FEATURES.md) - Detailed features overview
- **Deployment**: [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- **Security**: [SECURITY.md](SECURITY.md) - Security policies
- **Contributing**: [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- **Changelog**: [CHANGELOG.md](CHANGELOG.md) - Version history
- **Index**: [INDEX.md](INDEX.md) - Documentation index

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Email**: support@zone.com
- **GitHub Issues**: [Issues](https://github.com/your-repo/issues)
- **Documentation**: [Full Documentation](ZONE_v2_Documentation.md)

## 🙏 Acknowledgments

- React Team for the amazing framework
- FastAPI Team for the excellent Python web framework
- Tailwind CSS Team for the utility-first CSS framework
- shadcn/ui for the beautiful component library
- Lucide for the consistent icon library

---

**ZONE v.2** - Complete Business Management System
*Built with ❤️ for modern businesses*

![ZONE v.2](https://img.shields.io/badge/Status-Production%20Ready-green?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-2.0.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)
