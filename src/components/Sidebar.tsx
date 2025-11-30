'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/data-pasien', label: 'Data Pasien' },
  { href: '/data-dokter', label: 'Data Dokter' },
  { href: '/janji-temu', label: 'Janji Temu' },
  { href: '/manajemen-kamar', label: 'Manajemen Kamar' },
  { href: '/laboratorium', label: 'Laboratorium' },
  { href: '/apotek', label: 'Apotek' },
  { href: '/stok-obat', label: 'Stok Obat' },
  { href: '/inventaris', label: 'Inventaris' },
  { href: '/pembayaran', label: 'Pembayaran' },
  { href: '/laporan', label: 'Laporan' },
  { href: '/profil', label: 'Profil' },
  { href: '/bantuan', label: 'Bantuan' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="d-flex">
      <nav className="bg-dark text-white vh-100" style={{ width: '250px' }}>
        <div className="p-3">
          <h5 className="text-center mb-4">Hospital System</h5>
          <ul className="nav flex-column">
            {menuItems.map((item) => (
              <li key={item.href} className="nav-item mb-2">
                <Link
                  href={item.href}
                  className={`nav-link text-white ${
                    pathname === item.href ? 'bg-primary rounded' : ''
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <div className="flex-grow-1">
        {/* Content will be rendered here */}
      </div>
    </div>
  );
}
