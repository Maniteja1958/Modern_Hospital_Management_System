import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Pill, Activity, Users, Search, Calendar, FileText, CheckCircle2, Stethoscope, Clock } from 'lucide-react';
import { Card } from '../components/ui/card';
import { getApiUrl } from '../lib/api';

const chartData = [
  { name: 'Tue', value: 870 },
  { name: 'Wed', value: 550 },
  { name: 'Thu', value: 200 },
  { name: 'Fri', value: 300 },
  { name: 'Sat', value: 720 },
  { name: 'Sun', value: 980 },
  { name: 'Mon', value: 680 },
];

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ patients: 0, doctors: 0, appointments: 0, prescriptions: 0 });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [systemUsers, setSystemUsers] = useState<any[]>([]);
  const [searchUser, setSearchUser] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await fetch(getApiUrl('/admin/stats'), {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        if (statsRes.ok) setStats(await statsRes.json());
        
        const activityRes = await fetch(getApiUrl('/admin/recent-activity'), {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        if (activityRes.ok) setRecentActivity(await activityRes.json());

        const usersRes = await fetch(getApiUrl('/users'), {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        if (usersRes.ok) setSystemUsers(await usersRes.json());
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [user]);

  const statCards = [
    { label: 'Total Patients', value: stats.patients, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Active Doctors', value: stats.doctors, icon: Stethoscope, color: 'text-secondary', bg: 'bg-secondary/10' },
    { label: 'Appointments', value: stats.appointments, icon: Calendar, color: 'text-warning', bg: 'bg-warning/10' },
    { label: 'Prescriptions', value: stats.prescriptions, icon: FileText, color: 'text-success', bg: 'bg-success/10' },
  ];

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Command Center</h1>
        <p className="text-muted-foreground mt-1">High-level overview of system metrics and user data.</p>
      </div>

      {/* Stats Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <Card key={i} className="glass-card shadow-sm border-none p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                <h3 className="text-3xl font-bold text-foreground">{stat.value}</h3>
              </div>
              <div className={`p-4 rounded-2xl ${stat.bg}`}>
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Chart Card */}
        <Card className="glass-card shadow-sm border-none col-span-1 lg:col-span-2 overflow-hidden flex flex-col">
          <div className="p-6 pb-2 border-b border-border/50 bg-muted/20">
            <h3 className="text-lg font-semibold text-foreground">Traffic Analysis</h3>
            <p className="text-sm text-muted-foreground">Weekly user interaction trends</p>
          </div>
          <div className="p-6 flex-1 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border" vertical={false} />
                <XAxis dataKey="name" stroke="currentColor" className="text-muted-foreground text-xs" tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="currentColor" className="text-muted-foreground text-xs" tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'currentColor', className: 'text-muted/50' }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} barSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Right Info Card */}
        <div className="space-y-6 flex flex-col">
          <Card className="glass-card shadow-sm border-none flex-1 flex flex-col justify-center items-center p-8 text-center bg-success/5 border-success/20">
            <div className="w-16 h-16 bg-success/15 rounded-full flex items-center justify-center mb-4 border border-success/30 shadow-sm">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">System Healthy</h3>
            <p className="text-sm text-muted-foreground font-medium">All services are running smoothly with 0 active alerts.</p>
          </Card>
          
          <Card className="glass-card shadow-sm border-none flex-1 p-6 relative overflow-hidden bg-primary text-primary-foreground">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Need Help?</h3>
              <p className="text-sm text-primary-foreground/80 leading-relaxed max-w-[200px]">
                Access the admin documentation for advanced configuration guides.
              </p>
              <button className="mt-6 px-5 py-2 bg-background text-primary font-semibold text-sm rounded-lg shadow-sm hover:scale-105 transition-transform">
                Read Docs
              </button>
            </div>
            <Activity className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10 text-background" />
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity List */}
        <Card className="glass-card shadow-sm border-none col-span-1 flex flex-col overflow-hidden">
          <div className="p-6 pb-4 border-b border-border/50 bg-muted/20 flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground m-0">Recent Activity</h3>
          </div>
          
          <div className="p-6 flex-1 overflow-y-auto max-h-[500px] custom-scrollbar space-y-4">
            {recentActivity.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground border border-dashed border-border rounded-xl">
                No recent activity.
              </div>
            ) : (
              recentActivity.map((tx, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-background/50 rounded-2xl border border-border/50 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex justify-center items-center shrink-0 border border-primary/20">
                      <Pill size={18} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="m-0 text-sm font-bold text-foreground">RX-{tx.id}</h4>
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground font-medium">
                        <Activity size={10} />
                        <span>{tx.date} • {tx.doctor}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <h4 className="m-0 text-sm font-semibold text-foreground">{tx.patient}</h4>
                    <div className="inline-block mt-1.5 px-2.5 py-0.5 bg-success/15 rounded text-[10px] text-success font-bold tracking-wide uppercase">
                      {tx.status}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Global User Directory */}
        <Card className="glass-card shadow-sm border-none col-span-1 lg:col-span-2 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border/50 bg-muted/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-secondary/10 rounded-xl">
                <Users className="w-5 h-5 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground m-0">Directory</h3>
            </div>
            
            <div className="relative w-full sm:max-w-[280px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search name or email..." 
                value={searchUser} 
                onChange={(e) => setSearchUser(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-background shadow-sm border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium placeholder:text-muted-foreground/70"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-muted/30">
                <tr className="border-b border-border text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {systemUsers.filter(u => (`${u.firstName} ${u.lastName} ${u.email}`).toLowerCase().includes(searchUser.toLowerCase())).map((u) => (
                  <tr key={u._id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-foreground flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                        {u.firstName?.[0]}{u.lastName?.[0]}
                      </div>
                      {u.firstName} {u.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-md text-xs font-bold tracking-wide uppercase ${
                        u.role === 'Admin' ? 'bg-destructive/15 text-destructive' 
                        : u.role === 'Doctor' ? 'bg-primary/15 text-primary' 
                        : 'bg-success/15 text-success'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground font-medium">{u.phoneNumber}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {systemUsers.filter(u => (`${u.firstName} ${u.lastName} ${u.email}`).toLowerCase().includes(searchUser.toLowerCase())).length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground bg-muted/10 font-medium">
                      <Users className="w-8 h-8 mx-auto mb-3 opacity-30" />
                      No users match your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

    </div>
  );
};

export default AdminDashboard;
