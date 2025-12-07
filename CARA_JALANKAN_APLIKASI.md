# 🚀 CARA MENJALANKAN APLIKASI ZONE v.2

## 📋 Prerequisites

1. **MongoDB** - Harus berjalan di `mongodb://localhost:27017`
2. **Python 3.8+** - Untuk backend
3. **Node.js 16+** - Untuk frontend
4. **npm atau yarn** - Package manager

---

## 🔧 Setup Awal (Hanya Sekali)

### 1. Setup Backend

```powershell
# Masuk ke folder backend
cd backend

# Aktifkan virtual environment (jika belum)
.\venv\Scripts\activate

# Install dependencies (jika belum)
pip install -r requirements.txt

# Pastikan file .env ada dengan isi:
# MONGO_URL=mongodb://localhost:27017
# DB_NAME=zone_db
# SECRET_KEY=your-secret-key-change-in-production
```

### 2. Setup Frontend

```powershell
# Masuk ke folder frontend
cd frontend

# Install dependencies (jika belum)
npm install

# Pastikan file .env ada dengan isi:
# REACT_APP_BACKEND_URL=http://localhost:8000
```

---

## ▶️ Menjalankan Aplikasi

### Opsi 1: Manual (2 Terminal)

#### Terminal 1 - Backend:
```powershell
cd backend
.\venv\Scripts\activate
uvicorn server:app --host 0.0.0.0 --port 8000 --reload
```

#### Terminal 2 - Frontend:
```powershell
cd frontend
npm start
```

### Opsi 2: Otomatis (Script)

Backend dan frontend sudah dijalankan secara otomatis di background.

---

## 🌐 Akses Aplikasi

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

---

## 🔐 Login Default

Saat pertama kali login, sistem akan membuat user default:

**Admin:**
- Email: `admin@zone.com`
- Password: `admin123`

**Manager:**
- Email: `manager@zone.com`
- Password: `manager123`

> **PENTING**: Setelah login pertama, password akan di-hash. Pastikan untuk mengubah password default!

---

## ✅ Checklist Sebelum Menjalankan

- [ ] MongoDB berjalan di `localhost:27017`
- [ ] File `backend/.env` sudah ada
- [ ] File `frontend/.env` sudah ada
- [ ] Dependencies backend terinstall (`pip install -r requirements.txt`)
- [ ] Dependencies frontend terinstall (`npm install`)
- [ ] Virtual environment backend aktif

---

## 🐛 Troubleshooting

### Backend tidak bisa start:
1. Cek apakah MongoDB berjalan: `mongod --version`
2. Cek apakah port 8000 sudah digunakan
3. Cek file `.env` di folder backend
4. Cek dependencies: `pip list | findstr fastapi`

### Frontend tidak bisa start:
1. Cek apakah port 3000 sudah digunakan
2. Cek file `.env` di folder frontend
3. Cek dependencies: `npm list`
4. Hapus `node_modules` dan install ulang: `rm -rf node_modules && npm install`

### Database connection error:
1. Pastikan MongoDB berjalan
2. Cek `MONGO_URL` di `backend/.env`
3. Cek apakah MongoDB listening di port 27017

### CORS Error:
1. Pastikan `CORS_ORIGINS` di `backend/.env` include `http://localhost:3000`
2. Restart backend server

---

## 📝 Catatan

- Backend menggunakan **hot reload** - perubahan kode akan otomatis reload
- Frontend menggunakan **hot reload** - perubahan akan otomatis refresh browser
- Database akan otomatis dibuat collection saat pertama kali digunakan
- Settings akan otomatis dibuat dengan default values saat pertama kali diakses

---

## 🛑 Menghentikan Aplikasi

Tekan `Ctrl+C` di terminal yang menjalankan:
- Backend server
- Frontend server

Atau tutup terminal window.

---

*Last Updated: 2024-01-20*

