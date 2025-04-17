export const ACCESS_LEVELS_ALL = ['ADMIN', 'DOCTOR', 'NURSE', 'LAB_TECHNICIAN', 'PATIENT'];

export const SIDEBAR_LINKS = [
  {
    label: 'MENU',
    links: [
      { name: 'Dashboard', href: '/dashboard', access: ACCESS_LEVELS_ALL, icon: 'dashboard' },
      { name: 'Profile', href: '/patient/self', access: ['PATIENT'], icon: 'person' },
    ],
  },
  {
    label: 'Manage',
    links: [
      { name: 'Users', href: '/record/users', access: ['ADMIN'], icon: 'group' },
      { name: 'Doctors', href: '/record/doctors', access: ['ADMIN'], icon: 'medical_services' },
      { name: 'Staffs', href: '/record/staffs', access: ['ADMIN', 'DOCTOR'], icon: 'people' },
      { name: 'Patients', href: '/record/patients', access: ['ADMIN', 'DOCTOR', 'NURSE'], icon: 'person' },
      { name: 'Appointments', href: '/record/appointments', access: ['ADMIN', 'DOCTOR', 'NURSE'], icon: 'event' },
      { name: 'Medical Records', href: '/record/medical-records', access: ['ADMIN', 'DOCTOR', 'NURSE'], icon: 'assignment' },
      { name: 'Billing Overview', href: '/record/billing', access: ['ADMIN', 'DOCTOR'], icon: 'receipt' },
      { name: "Patient Management", href: "/nurse/patient-management", access: ["NURSE"], icon: 'people'},
      { name: "Administer Medications", href: "/nurse/administer-medications", access: ["ADMIN", "DOCTOR", "NURSE"], icon: 'medication'},
      { name: "Appointments", href: "/record/appointments", access: ["PATIENT"], icon: 'event'},
      { name: "Records", href: "/patient/self", access: ["PATIENT"], icon: 'folder'},
      { name: "Prescription", href: "#", access: ["PATIENT"], icon: 'medication'},
      { name: "Billing", href: "/patient/self?cat=payments", access: ["PATIENT"], icon: 'receipt'},
    ],
  },
  {
    label: 'System',
    links: [
      { name: 'Notifications', href: '/notifications', access: ACCESS_LEVELS_ALL, icon: 'notifications' },
      { name: 'Audit Logs', href: '/admin/audit-logs', access: ['ADMIN'], icon: 'history' },
      { name: 'Settings', href: '/admin/system-settings', access: ['ADMIN'], icon: 'settings' },
    ],
  },
];