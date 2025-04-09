export const ACCESS_LEVELS_ALL = ['admin', 'doctor', 'nurse', 'lab technician', 'patient'];

export const SIDEBAR_LINKS = [
  {
    label: 'MENU',
    links: [
      { name: 'Dashboard', href: '/', access: ACCESS_LEVELS_ALL, icon: 'dashboard' },
      { name: 'Profile', href: '/patient/self', access: ['patient'], icon: 'person' },
    ],
  },
  {
    label: 'Manage',
    links: [
      { name: 'Users', href: '/record/users', access: ['admin'], icon: 'group' },
      { name: 'Doctors', href: '/record/doctors', access: ['admin'], icon: 'medical_services' },
      { name: 'Staffs', href: '/record/staffs', access: ['admin', 'doctor'], icon: 'people' },
      { name: 'Patients', href: '/record/patients', access: ['admin', 'doctor', 'nurse'], icon: 'person' },
      { name: 'Appointments', href: '/record/appointments', access: ['admin', 'doctor', 'nurse'], icon: 'event' },
      { name: 'Medical Records', href: '/record/medical-records', access: ['admin', 'doctor', 'nurse'], icon: 'assignment' },
      { name: 'Billing Overview', href: '/record/billing', access: ['admin', 'doctor'], icon: 'receipt' },
      { name: "Patient Management",href: "/nurse/patient-management",access: ["nurse"],icon: 'Users'},
      { name: "Administer Medications",href: "/nurse/administer-medications",access: ["admin", "doctor", "nurse"],icon: 'Pill'},
      { name: "Appointments",href: "/record/appointments",access: ["patient"],icon: 'ListOrdered'},
      { name: "Records",href: "/patient/self",access: ["patient"],icon: 'List'},
      { name: "Prescription",href: "#",access: ["patient"],icon: 'Pill'},
      { name: "Billing",href: "/patient/self?cat=payments",access: ["patient"],icon: 'Receipt'},
    ],
  },
  {
    label: 'System',
    links: [
      { name: 'Notifications', href: '/notifications', access: ACCESS_LEVELS_ALL, icon: 'notifications' },
      { name: 'Audit Logs', href: '/admin/audit-logs', access: ['admin'], icon: 'history' },
      { name: 'Settings', href: '/admin/system-settings', access: ['admin'], icon: 'settings' },
    ],
  },
];