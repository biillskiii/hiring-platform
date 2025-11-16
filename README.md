## PROJECT OVERVIEW

# 🧩 Hiring Management Web App – Feature Checklist

## 👩‍💼 Admin (Recruiter)

### 🗂️ Job List Page
- [✅] Menampilkan semua job yang sudah dibuat  
- [✅] Menampilkan informasi: Title, Department, Status Badge, Salary Range, dan CTA “Manage Job”  
- [✅] Sorting berdasarkan status / nama  
- [✅] Filtering berdasarkan status (Active / Inactive / Draft)  
- [✅] Pencarian (keyword search)  
- [✅] Tombol **“+ Create Job”** membuka modal pembuatan job  
- [✅] Status Badge berubah sesuai state (Active / Inactive / Draft)  
- [✅] Responsive layout sesuai Figma  

---

### 🧾 Create Job Modal / Page
- [✅] Input data meta job: title, description, department, salary range, dsb  
- [✅] Konfigurasi **Minimum Profile Information Required** (Full Name, Email, LinkedIn, dll)  
- [✅] Tiap field bisa diatur ke 3 state:
  - [✅] Mandatory (required)
  - [✅] Optional (boleh dikosongin)
  - [✅] Off (disembunyikan)
- [✅] Validasi semua field sebelum submit  
- [✅] Simpan konfigurasi ke backend (Supabase / Mock JSON)  
- [✅] State disimpan secara persist / auto-refresh setelah sukses submit  
- [✅] Notifikasi sukses atau error setelah penyimpanan  

---

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

---

### 📝 Apply Job Page
- [✅] Form field **dinamis** sesuai konfigurasi backend  
- [✅] Field state mengikuti config JSON:
  - [✅] `required: true` → mandatory  
  - [✅] `required: false` → optional  
  - [✅] field tidak ada → hidden  
- [✅] Validasi otomatis sesuai konfigurasi backend  
- [✅] Highlight field yang belum diisi saat submit gagal  
- [✅] Submit lamaran menyimpan data ke backend/mock  
- [✅] Menampilkan pesan:
  - [✅] ✅ Success: “Your application has been submitted successfully.”  
  - [✅] ❌ Error: tampilkan field wajib yang kosong  

---

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

--
## TECH STACK USED
The project is built using the following technologies:

- **Frontend:** [Next.js]
- **Database:** [Supabase (data), Firebase & Firestore (auth)]
- **Styling:** [Tailwind CSS]

---

## HOW TO RUN LOCALLY
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

https://hiring-platform1.vercel.app

