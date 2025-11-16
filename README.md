# 🧩 Hiring Management Web App – Feature Checklist

## 👩‍💼 Admin (Recruiter)

### 🗂️ Job List Page
- [✅] Menampilkan semua job yang sudah dibuat  
- [✅] Menampilkan informasi: Title, Department, Status Badge, Salary Range, dan CTA **“Manage Job”**  
- [✅] Sorting berdasarkan status / nama  
- [✅] Filtering berdasarkan status (Active / Inactive / Draft)  
- [✅] Pencarian (keyword search)  
- [✅] Tombol **“+ Create Job”** membuka modal pembuatan job  
- [✅] Status Badge berubah sesuai state (Active / Inactive / Draft)  
- [✅] Responsive layout sesuai Figma  

### 🧾 Create Job Modal / Page
- [✅] Input data meta job: title, description, department, salary range, dsb  
- [✅] Konfigurasi **Minimum Profile Information Required** (Full Name, Email, LinkedIn, dll)  
- [✅] Tiap field bisa diatur ke 3 state:
  - Mandatory (required)  
  - Optional (boleh dikosongin)  
  - Off (disembunyikan)  
- [✅] Validasi semua field sebelum submit  
- [✅] Simpan konfigurasi ke backend (Supabase / Mock JSON)  
- [✅] State disimpan secara persist / auto-refresh setelah sukses submit  
- [✅] Notifikasi sukses atau error setelah penyimpanan  

### 👥 Candidate Management Page
- [✅] Menampilkan daftar kandidat per job dalam bentuk tabel  
- [✅] Kolom: Name, Email, Phone, Gender, LinkedIn, Domicile, Applied Date  
- [✅] Kolom bisa **di-resize** (drag lebar kolom)  
- [✅] Kolom bisa **di-reorder** (drag & drop ubah urutan)  
- [✅] Sorting tiap kolom  
- [✅] Filtering kandidat  
- [✅] Pagination  
- [✅] Empty state (jika belum ada kandidat)  
- [✅] Responsive table layout  

---

## 👨‍💻 Applicant (Job Seeker)

### 💼 Job List Page
- [✅] Menampilkan semua **job aktif**  
- [✅] Card berisi job title, salary, dan nama perusahaan  
- [✅] Klik card membuka **Job Detail Page**  
- [✅] Responsive layout  

### 📝 Apply Job Page
- [✅] Form field **dinamis** sesuai konfigurasi backend  
- [✅] Field state mengikuti config JSON:
  - `required: true` → mandatory  
  - `required: false` → optional  
  - field tidak ada → hidden  
- [✅] Validasi otomatis sesuai konfigurasi backend  
- [✅] Highlight field yang belum diisi saat submit gagal  
- [✅] Submit lamaran menyimpan data ke backend / mock  
- [✅] Menampilkan pesan:
  - ✅ Success: “Your application has been submitted successfully.”  
  - ❌ Error: tampilkan field wajib yang kosong  

### 📸 Profile Picture via Hand Gesture (optional)
- [✅] Implementasi **Webcam capture**  
- [✅] Deteksi **gesture tangan (pose 1️⃣ 2️⃣ 3️⃣)**  
- [✅] Ambil foto otomatis pada gesture ke-3  
- [✅] Preview hasil foto sebelum simpan  
- [✅] Simpan foto ke form data  
- [✅] Optional untuk Internship, mandatory untuk Full-time  

---

## ⚙️ General / System Features
- [✅] Routing berdasarkan role (Admin / Applicant)  
- [✅] Loading state dan skeleton screen  
- [✅] Error boundary untuk invalid / empty state  
- [✅] Responsive di semua breakpoints (mobile, tablet, desktop)  
- [✅] Konsistensi warna, spacing, dan typography sesuai Figma  
- [✅] Transition & hover/focus states sesuai guideline  
- [✅] Reusable UI components (Button, Input, Modal, Table, Dropdown, Chip, Badge)  
- [✅] State management pakai Zustand / Context API  
- [✅] Data persistence (LocalStorage / Supabase)  
- [✅] Deploy ke Vercel  

---

## 🧩 Optional Enhancements (Bonus Points)
- [ ] Dark mode toggle  
- [✅] Tooltip untuk kolom tabel / status badge  
- [✅] LocalStorage untuk menyimpan layout kolom kandidat  
- [✅] Search + filter bar sticky  
- [ ] Unit testing dengan Jest / React Testing Library  
- [✅] Animasi smooth saat transition halaman dan modal  
- [✅] Pagination dengan infinite scroll mode  
- [✅] Error fallback page  

---

## TECH STACK USED
The project is built using the following technologies:

- **Frontend:** Next.js  
- **Database:** Supabase (data), Firebase & Firestore (auth)  
- **Styling:** Tailwind CSS  
- **Other Tools:** Mediapipe, HeroIcons, TensorFlow  

---

## HOW TO RUN LOCALLY
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

1. **Clone the repository**
```bash
git clone https://github.com/your-username/your-project.git
cd your-project
```
2. **Install Package**
```bash
npm install
# or
yarn install
# or
pnpm install
```
3. **Run locally**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
http://localhost:3000
```
## DEPLOY

The project is deployed on Vercel:
https://hiring-platform1.vercel.app

