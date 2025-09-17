# Flask Backend สำหรับ Data Processing

## 📋 คำอธิบาย
Flask backend นี้ทำหน้าที่ประมวลผลข้อมูล Excel/CSV และให้บริการ API สำหรับ React frontend

## 🚀 วิธีการติดตั้งและรัน

### 1. ติดตั้ง Python Dependencies
```bash
# เข้าไปในโฟลเดอร์ backend
cd backend

# ติดตั้ง packages ที่จำเป็น
pip install -r requirements.txt
```

### 2. รันเซิร์ฟเวอร์ Flask
```bash
# รันเซิร์ฟเวอร์ (development mode)
python app.py

# หรือใช้ Flask CLI
flask run --host=0.0.0.0 --port=5000 --debug
```

### 3. ตรวจสอบการทำงาน
เปิดเบราว์เซอร์ไปที่: `http://localhost:5000/api/health`

## 📡 API Endpoints

### GET /api/health
ตรวจสอบสถานะของ API

### POST /api/upload
อัปโหลดไฟล์ Excel/CSV
- รองรับ: .xlsx, .xls, .csv
- ขนาดไฟล์สูงสุด: 16MB

### POST /api/process
ประมวลผลข้อมูลตามประเภทการวิเคราะห์
- cleaning: ทำความสะอาดข้อมูล
- rfm: การวิเคราะห์ RFM
- basket: การวิเคราะห์ตะกร้าสินค้า
- statistical: การวิเคราะห์ทางสถิติ

### GET /api/download/<filename>
ดาวน์โหลดไฟล์ผลลัพธ์

## 📁 โครงสร้างไฟล์
```
backend/
├── app.py              # ไฟล์หลักของ Flask application
├── requirements.txt    # Python dependencies
├── README.md          # คู่มือการใช้งาน
└── uploads/           # โฟลเดอร์เก็บไฟล์ที่อัปโหลด (สร้างอัตโนมัติ)
```

## 🔧 การปรับแต่ง

### เปลี่ยน Port
แก้ไขในไฟล์ `app.py` บรรทัดสุดท้าย:
```python
app.run(debug=True, host='0.0.0.0', port=5001)  # เปลี่ยนเป็น port ที่ต้องการ
```

### เพิ่มประเภทไฟล์ที่รองรับ
แก้ไข `ALLOWED_EXTENSIONS` ในไฟล์ `app.py`:
```python
ALLOWED_EXTENSIONS = {'xlsx', 'xls', 'csv', 'json'}  # เพิ่ม json
```

## 🛡️ ความปลอดภัย
- ไฟล์จะถูกลบอัตโนมัติหลังจาก 1 ชั่วโมง
- ตรวจสอบประเภทไฟล์ก่อนอัปโหลด
- จำกัดขนาดไฟล์สูงสุด 16MB
- ใช้ secure_filename() เพื่อป้องกัน path traversal

## 🐛 การแก้ไขปัญหา

### ปัญหา CORS
หาก React frontend ไม่สามารถเชื่อมต่อได้ ตรวจสอบว่า Flask-CORS ติดตั้งแล้ว

### ปัญหาการอ่านไฟล์ Excel
ตรวจสอบว่าติดตั้ง openpyxl และ xlrd แล้ว

### ปัญหา Port ซ้ำ
เปลี่ยน port ในการรันเซิร์ฟเวอร์หรือปิดโปรแกรมที่ใช้ port 5000