module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/better-sqlite3 [external] (better-sqlite3, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("better-sqlite3", () => require("better-sqlite3"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/src/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$better$2d$sqlite3__$5b$external$5d$__$28$better$2d$sqlite3$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/better-sqlite3 [external] (better-sqlite3, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
const dbPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'hospital.db');
const db = new __TURBOPACK__imported__module__$5b$externals$5d2f$better$2d$sqlite3__$5b$external$5d$__$28$better$2d$sqlite3$2c$__cjs$29$__["default"](dbPath);
// Enable foreign keys
db.pragma('foreign_keys = ON');
// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    date_of_birth TEXT,
    gender TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    medical_history TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS doctors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    specialty TEXT,
    phone TEXT,
    email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER,
    doctor_id INTEGER,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    reason TEXT,
    status TEXT DEFAULT 'scheduled',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients (id),
    FOREIGN KEY (doctor_id) REFERENCES doctors (id)
  );

  CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_number TEXT NOT NULL UNIQUE,
    type TEXT,
    status TEXT DEFAULT 'available',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS lab_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER,
    test_name TEXT NOT NULL,
    result TEXT,
    date TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients (id)
  );

  CREATE TABLE IF NOT EXISTS medical_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER,
    doctor_id INTEGER,
    diagnosis TEXT,
    treatment TEXT,
    date TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients (id),
    FOREIGN KEY (doctor_id) REFERENCES doctors (id)
  );

  CREATE TABLE IF NOT EXISTS medicines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    generic_name TEXT,
    category TEXT,
    dosage_form TEXT,
    strength TEXT,
    manufacturer TEXT,
    expiry_date TEXT,
    stock_quantity INTEGER DEFAULT 0,
    unit_price REAL,
    min_stock_level INTEGER DEFAULT 10,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS prescriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER,
    doctor_id INTEGER,
    medicine_id INTEGER,
    dosage TEXT,
    frequency TEXT,
    duration TEXT,
    quantity INTEGER,
    instructions TEXT,
    status TEXT DEFAULT 'pending',
    prescribed_date TEXT,
    dispensed_date TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients (id),
    FOREIGN KEY (doctor_id) REFERENCES doctors (id),
    FOREIGN KEY (medicine_id) REFERENCES medicines (id)
  );

  CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT,
    description TEXT,
    quantity INTEGER DEFAULT 0,
    unit TEXT,
    location TEXT,
    supplier TEXT,
    purchase_date TEXT,
    warranty_expiry TEXT,
    maintenance_schedule TEXT,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER,
    amount REAL NOT NULL,
    payment_type TEXT,
    description TEXT,
    payment_date TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients (id)
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);
// Insert sample data
const insertSampleData = ()=>{
    // Sample patients
    const patients = [
        {
            name: 'John Doe',
            date_of_birth: '1980-01-01',
            gender: 'Male',
            address: '123 Main St',
            phone: '123-456-7890',
            email: 'john@example.com'
        },
        {
            name: 'Jane Smith',
            date_of_birth: '1990-02-02',
            gender: 'Female',
            address: '456 Oak Ave',
            phone: '987-654-3210',
            email: 'jane@example.com'
        }
    ];
    // Sample doctors
    const doctors = [
        {
            name: 'Dr. Alice Johnson',
            specialty: 'Cardiology',
            phone: '111-222-3333',
            email: 'alice@hospital.com'
        },
        {
            name: 'Dr. Bob Wilson',
            specialty: 'Neurology',
            phone: '444-555-6666',
            email: 'bob@hospital.com'
        }
    ];
    // Sample rooms
    const rooms = [
        {
            room_number: '101',
            type: 'General'
        },
        {
            room_number: '102',
            type: 'ICU'
        }
    ];
    // Sample medicines
    const medicines = [
        {
            name: 'Paracetamol',
            generic_name: 'Acetaminophen',
            category: 'Pain Relief',
            dosage_form: 'Tablet',
            strength: '500mg',
            manufacturer: 'PharmaCorp',
            expiry_date: '2025-12-31',
            stock_quantity: 150,
            unit_price: 0.10,
            min_stock_level: 20
        },
        {
            name: 'Amoxicillin',
            generic_name: 'Amoxicillin',
            category: 'Antibiotic',
            dosage_form: 'Capsule',
            strength: '250mg',
            manufacturer: 'MediLab',
            expiry_date: '2024-10-15',
            stock_quantity: 80,
            unit_price: 0.25,
            min_stock_level: 15
        },
        {
            name: 'Ibuprofen',
            generic_name: 'Ibuprofen',
            category: 'Pain Relief',
            dosage_form: 'Tablet',
            strength: '200mg',
            manufacturer: 'HealthPharm',
            expiry_date: '2025-06-20',
            stock_quantity: 200,
            unit_price: 0.08,
            min_stock_level: 25
        }
    ];
    // Sample inventory
    const inventory = [
        {
            name: 'Blood Pressure Monitor',
            category: 'Medical Equipment',
            description: 'Digital blood pressure monitor',
            quantity: 5,
            unit: 'pieces',
            location: 'Equipment Room A',
            supplier: 'MediTech',
            purchase_date: '2023-01-15',
            warranty_expiry: '2026-01-15',
            maintenance_schedule: 'Monthly',
            status: 'active'
        },
        {
            name: 'Wheelchair',
            category: 'Mobility Aid',
            description: 'Standard wheelchair',
            quantity: 10,
            unit: 'pieces',
            location: 'Equipment Room B',
            supplier: 'MobilityCorp',
            purchase_date: '2023-03-10',
            warranty_expiry: '2025-03-10',
            maintenance_schedule: 'Quarterly',
            status: 'active'
        },
        {
            name: 'Surgical Gloves',
            category: 'Consumables',
            description: 'Latex-free surgical gloves',
            quantity: 500,
            unit: 'boxes',
            location: 'Supply Room',
            supplier: 'SafeHands',
            purchase_date: '2023-05-01',
            warranty_expiry: null,
            maintenance_schedule: null,
            status: 'active'
        }
    ];
    // Sample payments
    const payments = [
        {
            patient_id: 1,
            amount: 150.00,
            payment_type: 'Cash',
            description: 'Consultation fee',
            payment_date: '2023-10-01',
            status: 'completed'
        },
        {
            patient_id: 2,
            amount: 75.50,
            payment_type: 'Card',
            description: 'Lab test fee',
            payment_date: '2023-10-02',
            status: 'completed'
        }
    ];
    // Insert data
    const insertPatient = db.prepare('INSERT OR IGNORE INTO patients (name, date_of_birth, gender, address, phone, email) VALUES (?, ?, ?, ?, ?, ?)');
    const insertDoctor = db.prepare('INSERT OR IGNORE INTO doctors (name, specialty, phone, email) VALUES (?, ?, ?, ?)');
    const insertRoom = db.prepare('INSERT OR IGNORE INTO rooms (room_number, type) VALUES (?, ?)');
    const insertMedicine = db.prepare('INSERT OR IGNORE INTO medicines (name, generic_name, category, dosage_form, strength, manufacturer, expiry_date, stock_quantity, unit_price, min_stock_level) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    const insertInventory = db.prepare('INSERT OR IGNORE INTO inventory (name, category, description, quantity, unit, location, supplier, purchase_date, warranty_expiry, maintenance_schedule, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    const insertPayment = db.prepare('INSERT OR IGNORE INTO payments (patient_id, amount, payment_type, description, payment_date, status) VALUES (?, ?, ?, ?, ?, ?)');
    patients.forEach((p)=>insertPatient.run(p.name, p.date_of_birth, p.gender, p.address, p.phone, p.email));
    doctors.forEach((d)=>insertDoctor.run(d.name, d.specialty, d.phone, d.email));
    rooms.forEach((r)=>insertRoom.run(r.room_number, r.type));
    medicines.forEach((m)=>insertMedicine.run(m.name, m.generic_name, m.category, m.dosage_form, m.strength, m.manufacturer, m.expiry_date, m.stock_quantity, m.unit_price, m.min_stock_level));
    inventory.forEach((i)=>insertInventory.run(i.name, i.category, i.description, i.quantity, i.unit, i.location, i.supplier, i.purchase_date, i.warranty_expiry, i.maintenance_schedule, i.status));
    payments.forEach((p)=>insertPayment.run(p.patient_id, p.amount, p.payment_type, p.description, p.payment_date, p.status));
};
insertSampleData();
const __TURBOPACK__default__export__ = db;
}),
"[project]/src/app/api/appointments/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-route] (ecmascript)");
;
;
async function GET() {
    try {
        const appointments = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].prepare(`
      SELECT
        a.*,
        p.name as patient_name,
        d.name as doctor_name
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN doctors d ON a.doctor_id = d.id
      ORDER BY a.created_at DESC
    `).all();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(appointments);
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch appointments'
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const { patient_id, doctor_id, date, time, reason, status } = await request.json();
        const stmt = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].prepare(`
      INSERT INTO appointments (patient_id, doctor_id, date, time, reason, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
        const result = stmt.run(patient_id, doctor_id, date, time, reason, status || 'scheduled');
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            id: result.lastInsertRowid,
            message: 'Appointment created successfully'
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to create appointment'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__9fb842a1._.js.map