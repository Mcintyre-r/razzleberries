export const metadata = {
  title: 'Admin Dashboard - RazzAB',
  description: 'Admin dashboard for RazzAB',
  params: {
    adminPage: true
  }
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
} 