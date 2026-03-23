import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Pill, Activity, Users, Search } from 'lucide-react';

// Mock data for the bar chart
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
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ patients: 0, doctors: 0, appointments: 0, prescriptions: 0 });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [systemUsers, setSystemUsers] = useState<any[]>([]);
  const [searchUser, setSearchUser] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await fetch('/api/admin/stats', {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        if (statsRes.ok) setStats(await statsRes.json());
        
        const activityRes = await fetch('/api/admin/recent-activity', {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        if (activityRes.ok) setRecentActivity(await activityRes.json());

        const usersRes = await fetch('/api/users', {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        if (usersRes.ok) setSystemUsers(await usersRes.json());
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [user]);

  return (
    <div style={{ padding: '24px', minHeight: '100vh', backgroundColor: '#18181b', color: '#e4e4e7', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#f4f4f5', margin: 0 }}>System Overview</h2>
        <button 
          onClick={logout} 
          style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #3f3f46', color: '#a1a1aa', borderRadius: '6px', fontSize: '14px' }}
        >
          Logout
        </button>
      </div>

      {/* Stats Summary Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Patients', value: stats.patients },
          { label: 'Active Doctors', value: stats.doctors },
          { label: 'Appointments', value: stats.appointments },
          { label: 'Prescriptions', value: stats.prescriptions },
        ].map((stat, i) => (
          <div key={i} style={{ backgroundColor: '#27272a', padding: '20px', borderRadius: '8px', border: '1px solid #3f3f46' }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#a1a1aa' }}>{stat.label}</p>
            <h3 style={{ margin: 0, fontSize: '28px', color: '#f4f4f5', fontWeight: '600' }}>{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Main Charts Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
        
        {/* Left Chart Card */}
        <div style={{ backgroundColor: '#27272a', borderRadius: '8px', padding: '20px', border: '1px solid #3f3f46', height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
              <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{ fill: '#3f3f46' }}
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '4px' }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Right Info Card */}
        <div style={{ backgroundColor: '#27272a', borderRadius: '8px', padding: '20px', border: '1px solid #3f3f46', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <p style={{ color: '#a1a1aa', fontSize: '15px' }}>No critical patient alerts</p>
        </div>
      </div>

      {/* Recent Activity List */}
      <div style={{ backgroundColor: '#27272a', borderRadius: '8px', border: '1px solid #3f3f46', padding: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#f4f4f5', marginBottom: '16px' }}>Recent Activity</h3>
        
        {recentActivity.length === 0 ? <p style={{ color: '#a1a1aa', fontSize: '14px' }}>No recent activity to display.</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentActivity.map((tx, idx) => (
              <div key={idx} style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                backgroundColor: '#18181b', padding: '16px', borderRadius: '6px', border: '1px solid #3f3f46'
              }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '40px', height: '40px', backgroundColor: '#e0f2fe20', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Pill size={20} color="#3b82f6" />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '14px', color: '#f4f4f5', fontWeight: '500' }}>RX-{tx.id}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                      <Activity size={12} color="#a1a1aa" />
                      <span style={{ fontSize: '12px', color: '#a1a1aa' }}>{tx.date} • {tx.doctor}</span>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <h4 style={{ margin: 0, fontSize: '14px', color: '#f4f4f5', fontWeight: '500' }}>{tx.patient}</h4>
                  <div style={{ 
                    display: 'inline-block', marginTop: '4px', padding: '2px 8px', 
                    backgroundColor: '#10b98120', borderRadius: '4px', fontSize: '10px', color: '#10b981', fontWeight: '600'
                  }}>
                    {tx.status}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Global User Directory */}
      <div style={{ backgroundColor: '#27272a', borderRadius: '8px', border: '1px solid #3f3f46', padding: '24px', marginTop: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#a855f720', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Users size={20} color="#a855f7" />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#f4f4f5', margin: 0 }}>Registered Users Directory</h3>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', background: '#18181b', border: '1px solid #3f3f46', borderRadius: '6px', padding: '6px 12px' }}>
            <Search size={14} color="#a1a1aa" style={{ marginRight: '8px' }} />
            <input 
              type="text" 
              placeholder="Search user name or email..." 
              value={searchUser} 
              onChange={(e) => setSearchUser(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#f4f4f5', fontSize: '13px', outline: 'none', width: '250px' }}
            />
          </div>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #3f3f46', color: '#a1a1aa', fontSize: '12px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>User</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Email</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Role</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Phone</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Registered On</th>
              </tr>
            </thead>
            <tbody>
              {systemUsers.filter(u => (`${u.firstName} ${u.lastName} ${u.email}`).toLowerCase().includes(searchUser.toLowerCase())).map((u) => (
                <tr key={u._id} style={{ borderBottom: '1px solid #3f3f4625' }}>
                  <td style={{ padding: '16px', color: '#f4f4f5', fontSize: '14px', fontWeight: '500' }}>{u.firstName} {u.lastName}</td>
                  <td style={{ padding: '16px', color: '#a1a1aa', fontSize: '14px' }}>{u.email}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600',
                      backgroundColor: u.role === 'Admin' ? '#ef444420' : u.role === 'Doctor' ? '#3b82f620' : '#10b98120',
                      color: u.role === 'Admin' ? '#ef4444' : u.role === 'Doctor' ? '#3b82f6' : '#10b981'
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '16px', color: '#a1a1aa', fontSize: '14px' }}>{u.phoneNumber}</td>
                  <td style={{ padding: '16px', color: '#a1a1aa', fontSize: '14px' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {systemUsers.filter(u => (`${u.firstName} ${u.lastName} ${u.email}`).toLowerCase().includes(searchUser.toLowerCase())).length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#a1a1aa', fontSize: '14px' }}>No users match your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
