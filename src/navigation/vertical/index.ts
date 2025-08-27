export const adminTI = [
  { heading: 'User Management' },
  {
    title: 'User',
    icon: { icon: 'tabler-users' },
    children: [
      { title: 'Users', to: 'user-management-user-list' },
      { title: 'Roles', to: 'user-management-roles-list' },
      { title: 'Struktural', to: 'user-management-struktural-list' },
      { title: 'Struktur Organisasi', to: 'user-management-struktur-organisasi-list' },
    ],
  },
  { heading: 'Inbox' },
  {
    title: 'Inbox',
    to: { name: 'inbox' },
    icon: { icon: 'tabler-inbox' },
  },
  { heading: 'Menu FLPP' },
  {
    title: 'Kuota',
    to: { name: 'quota-kuota' },
    icon: { icon: 'tabler-chart-bar' },
  },
  {
    title: 'Kuota Mitra',
    to: { name: 'quota-kuota-mitra' },
    icon: { icon: 'tabler-users' },
  },
  {
    title: 'Pengajuan Kuota',
    to: { name: 'quota-quota-submission' },
    icon: { icon: 'tabler-ticket' },
  },
  {
    title: 'Jadwal Angsuran',
    to: { name: 'quota-jadwal-angsuran' },
    icon: { icon: 'tabler-calendar' },
  },
  {
    title: 'Status Pengajuan',
    to: { name: 'quota-submission-status' },
    icon: { icon: 'tabler-alarm' },
  },
  { heading: 'Menu Griya Nusantara' },
  {
    title: 'Kuota',
    to: { name: 'grinus-quota-grinus-kuota' },
    icon: { icon: 'tabler-chart-bar' },
  },
  {
    title: 'Kuota Mitra',
    to: { name: 'grinus-quota-grinus-kuota-mitra' },
    icon: { icon: 'tabler-users' },
  },
  {
    title: 'Pengajuan Kuota',
    to: { name: 'grinus-quota-grinus-submission' },
    icon: { icon: 'tabler-ticket' },
  },
  {
    title: 'Jadwal Angsuran',
    to: { name: 'grinus-quota-grinus-jadwal-angsuran' },
    icon: { icon: 'tabler-calendar' },
  },
  {
    title: 'Status Pengajuan',
    to: { name: 'grinus-quota-grinus-submission-status' },
    icon: { icon: 'tabler-alarm' },
  },
  { heading: 'Master Data' },
  {
    title: 'Master',
    icon: { icon: 'tabler-brand-databricks' },
    children: [
      { 
        title: 'Daftar Mitra',
        to: { name: 'master-data-daftar-mitra' },
        icon: { icon: 'tabler-database-star' },
      },
      { 
        title: 'Konfigurasi Mitra',
        to: { name: 'master-data-konfig-mitra' },
        icon: { icon: 'tabler-file-search' }, 
      },
      { 
        title: 'Audit Log',
        to: { name: 'master-data-audit-trail' },
        icon: { icon: 'tabler-file-search' }, 
      },
    ],
  }
]
// 2 verifikator dan  View Semua Menu Flpp Dan Menu Grinus
export const staffCo = [
  { heading: 'Inbox' },
  {
    title: 'Inbox',
    to: { name: 'inbox' },
    icon: { icon: 'tabler-inbox' },
  },
  { heading: 'Menu FLPP' },
  {
    title: 'Pengajuan Kuota',
    to: { name: 'quota-quota-submission' },
    icon: { icon: 'tabler-ticket' },
  },
  {
    title: 'Status Pengajuan',
    to: { name: 'quota-submission-status' },
    icon: { icon: 'tabler-alarm' },
  },
  {
    title: 'Jadwal Angsuran',
    to: { name: 'quota-jadwal-angsuran' },
    icon: { icon: 'tabler-calendar' },
  },
  {
    title: 'Kuota',
    to: { name: 'quota-kuota' },
    icon: { icon: 'tabler-chart-bar' },
  },
  {
    title: 'Kuota Mitra',
    to: { name: 'quota-kuota-mitra' },
    icon: { icon: 'tabler-users' },
  },
  { heading: 'Menu Griya Nusantara' },
  {
    title: 'Pengajuan Kuota',
    to: { name: 'grinus-quota-grinus-submission' },
    icon: { icon: 'tabler-ticket' },
  },
  {
    title: 'Status Pengajuan',
    to: { name: 'grinus-quota-grinus-submission-status' },
    icon: { icon: 'tabler-alarm' },
  },
  {
    title: 'Jadwal Angsuran',
    to: { name: 'grinus-quota-grinus-jadwal-angsuran' },
    icon: { icon: 'tabler-calendar' },
  },
  {
    title: 'Kuota',
    to: { name: 'grinus-quota-grinus-kuota' },
    icon: { icon: 'tabler-chart-bar' },
  },
  {
    title: 'Kuota Mitra',
    to: { name: 'grinus-quota-grinus-kuota-mitra' },
    icon: { icon: 'tabler-users' },
  },
]
