import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Pill, Calendar, UploadCloud, FileText, CheckCircle2, AlertCircle, Clock, Stethoscope, Briefcase, Download, MessageSquare, Send } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reminders, setReminders] = useState<any[]>([]);
  const [timeOfDay, setTimeOfDay] = useState('');
  
  // Date Filter State
  const [filterDate, setFilterDate] = useState('');

  // OCR Upload States
  const [file, setFile] = useState<File | null>(null);
  const [ocrText, setOcrText] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  // Appointment States
  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [bookData, setBookData] = useState({ doctorId: '', date: '', time: '', reasonForVisit: '' });
  const [bookingSuccess, setBookingSuccess] = useState('');
  
  // Chat States
  const [chatDoctorId, setChatDoctorId] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  
  // Notification States
  const [hasPermission, setHasPermission] = useState(false);

  // Request browser Notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        setHasPermission(permission === 'granted');
      });
    }
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/patient/appointments', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      if (res.ok) setAppointments(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pxRes = await fetch('/api/patient/prescriptions', {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        if (pxRes.ok) {
          const data = await pxRes.json();
          setPrescriptions(data);
          
          const currentHour = new Date().getHours();
          let tod = 'Night';
          if (currentHour >= 5 && currentHour < 12) tod = 'Morning';
          else if (currentHour >= 12 && currentHour < 17) tod = 'Afternoon';
          else if (currentHour >= 17 && currentHour < 21) tod = 'Evening';
          setTimeOfDay(tod);

          const activeMeds: any[] = [];
          data.forEach((px: any) => {
            if (px.status === 'Active' || !px.status) {
              px.medicines.forEach((m: any) => {
                if (m.timing.toLowerCase().includes(tod.toLowerCase())) activeMeds.push(m);
              });
            }
          });
          setReminders(activeMeds);
        }

        const docRes = await fetch('/api/users/doctors', {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        if (docRes.ok) setDoctors(await docRes.json());
        
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    fetchAppointments(); // Fetch appointments on load
  }, [user]);

  // Robust Interval-based Reminder checker (runs every minute)
  useEffect(() => {
    if (reminders.length === 0) return;

    const intervalId = setInterval(() => {
      const now = new Date();
      // Check exactly at the top of the hour for main dose times (e.g. 9am, 2pm, 8pm)
      // This is simulated logic. Since we don't want to wait hours to test it, 
      // let's assume if they have an active reminder for this TimeOfDay, we fire it once per session 
      // or based on a specific exact minute. For robust safety, we check if the user hasn't been notified recently.

      const lastNotified = sessionStorage.getItem('lastNotificationFired');
      // Fire if 1 hour has passed since last notification, or never fired
      if (!lastNotified || (now.getTime() - parseInt(lastNotified)) > 3600000) {
        
        let shouldFire = false;
        if (timeOfDay === 'Morning' && now.getHours() >= 9) shouldFire = true;
        if (timeOfDay === 'Afternoon' && now.getHours() >= 14) shouldFire = true;
        if (timeOfDay === 'Night' && now.getHours() >= 20) shouldFire = true;

        if (shouldFire) {
          // Play Medical Beep Alert
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, ctx.currentTime); // High pitch typical medical beep
          osc.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.3);

          setTimeout(() => {
             const osc2 = ctx.createOscillator();
             osc2.frequency.setValueAtTime(880, ctx.currentTime);
             osc2.connect(ctx.destination);
             osc2.start();
             osc2.stop(ctx.currentTime + 0.3);
          }, 400);

          // Trigger Native Browser WebAPI Notification
          if (hasPermission) {
            new Notification('Smart Hospital Reminder 🔔', {
              body: `It is time to take your ${timeOfDay} medication: ${reminders.map(m => m.name).join(', ')}.`,
              icon: 'https://cdn-icons-png.flaticon.com/512/3004/3004458.png',
              requireInteraction: true
            });
          }

          sessionStorage.setItem('lastNotificationFired', now.getTime().toString());
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [reminders, timeOfDay, hasPermission]);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/patient/upload-prescription', {
        method: 'POST',
        headers: { Authorization: `Bearer ${user?.token}` },
        body: formData,
      });
      if (res.ok) setOcrText(await res.json());
      else alert('Failed to extract text. File might be too large.');
    } catch (err) {
      alert('Network Error');
    } finally {
      setUploading(false);
    }
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/patient/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
        body: JSON.stringify(bookData)
      });
      if (res.ok) {
        setBookingSuccess('Appointment Request Sent!');
        setBookData({ doctorId: '', date: '', time: '', reasonForVisit: '' });
        fetchAppointments(); // Refresh the real-time list
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadChat = async () => {
    if (!chatDoctorId) return setChatMessages([]);
    try {
      const res = await fetch(`/api/messages/${chatDoctorId}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      if (res.ok) setChatMessages(await res.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => { loadChat(); }, [chatDoctorId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !chatDoctorId) return;
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
        body: JSON.stringify({ receiverId: chatDoctorId, content: chatInput })
      });
      if (res.ok) {
        setChatInput('');
        loadChat();
      }
    } catch (e) { console.error(e); }
  };

  return (
    <div style={{ padding: '32px', minHeight: '100vh', backgroundColor: '#18181b', color: '#e4e4e7', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', maxWidth: '1200px', margin: '0 auto 32px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#f4f4f5', margin: 0 }}>My Health Dashboard</h2>
          <p style={{ color: '#a1a1aa', margin: '4px 0 0 0', fontSize: '14px' }}>Welcome back, {user?.firstName}!</p>
        </div>
        <button onClick={logout} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #3f3f46', color: '#a1a1aa', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Dynamic Reminder Banner */}
        {reminders.length > 0 && (
          <div style={{ padding: '20px', backgroundColor: '#3f2c2c', border: '1px solid #ef4444', borderRadius: '8px', display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: '#ef444420', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <AlertCircle color="#ef4444" size={24} />
            </div>
            <div>
              <h4 style={{ margin: '0 0 4px 0', color: '#f87171', fontSize: '18px' }}>Action Required: {timeOfDay} Medicine</h4>
              <p style={{ margin: '0', color: '#fca5a5', fontSize: '14px' }}>
                Please take: {reminders.map(m => `${m.name} (${m.dosage})`).join(', ')}
              </p>
            </div>
          </div>
        )}

        {/* Top Row: Appointments & AI Upload */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          
          {/* Appointment Booking Module */}
          <div style={{ backgroundColor: '#27272a', borderRadius: '12px', padding: '24px', border: '1px solid #3f3f46' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: '#eab308', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Calendar size={20} color="white" />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#f4f4f5', margin: 0 }}>Book an Appointment</h3>
            </div>
            
            {bookingSuccess && <div style={{ padding: '12px', backgroundColor: '#10b98120', color: '#10b981', border: '1px solid #10b981', borderRadius: '6px', marginBottom: '16px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} /> {bookingSuccess}</div>}

            <form onSubmit={handleBookAppointment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ color: '#a1a1aa', fontSize: '13px', display: 'block', marginBottom: '6px' }}><Stethoscope size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}/> Choose Doctor</label>
                <select value={bookData.doctorId} onChange={(e) => setBookData({...bookData, doctorId: e.target.value})} required style={{ width: '100%', padding: '12px', background: '#18181b', border: '1px solid #3f3f46', color: '#f4f4f5', borderRadius: '6px', outline: 'none' }}>
                  <option value="">Select a Doctor from Network</option>
                  {doctors.map(d => <option key={d._id} value={d._id}>Dr. {d.firstName} {d.lastName}</option>)}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ color: '#a1a1aa', fontSize: '13px', display: 'block', marginBottom: '6px' }}><Calendar size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}/> Date</label>
                  <input type="date" value={bookData.date} onChange={(e) => setBookData({...bookData, date: e.target.value})} required style={{ width: '100%', padding: '10px 12px', background: '#18181b', border: '1px solid #3f3f46', color: '#f4f4f5', borderRadius: '6px', outline: 'none', WebkitAppearance: 'none' }} />
                </div>
                <div>
                  <label style={{ color: '#a1a1aa', fontSize: '13px', display: 'block', marginBottom: '6px' }}><Clock size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}/> Time</label>
                  <input type="time" value={bookData.time} onChange={(e) => setBookData({...bookData, time: e.target.value})} required style={{ width: '100%', padding: '10px 12px', background: '#18181b', border: '1px solid #3f3f46', color: '#f4f4f5', borderRadius: '6px', outline: 'none', WebkitAppearance: 'none' }} />
                </div>
              </div>

              <div>
                <label style={{ color: '#a1a1aa', fontSize: '13px', display: 'block', marginBottom: '6px' }}><Briefcase size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}/> Reason for Visit</label>
                <input type="text" placeholder="e.g. Regular Checkup, Fever" value={bookData.reasonForVisit} onChange={(e) => setBookData({...bookData, reasonForVisit: e.target.value})} required style={{ width: '100%', padding: '12px', background: '#18181b', border: '1px solid #3f3f46', color: '#f4f4f5', borderRadius: '6px', outline: 'none' }} />
              </div>

              <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#eab308', color: '#18181b', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', marginTop: '8px' }}>
                Request Appointment
              </button>
            </form>
          </div>

          {/* New Mod: My Appointments List */}
          <div style={{ backgroundColor: '#27272a', borderRadius: '12px', padding: '24px', border: '1px solid #3f3f46', gridColumn: '1 / -1' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#f4f4f5', margin: '0 0 16px 0' }}>My Appointments</h3>
            {appointments.length === 0 ? <p style={{ color: '#a1a1aa', fontSize: '14px' }}>You have no appointments scheduled.</p> : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {appointments.map(app => (
                  <div key={app._id} style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', backgroundColor: '#18181b', borderRadius: '8px', border: '1px solid #3f3f46' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ color: '#f4f4f5', fontWeight: '600', fontSize: '15px' }}>Dr. {app.doctor?.lastName}</span>
                      <div style={{ padding: '4px 8px', border: `1px solid ${app.status === 'Approved' ? '#10b981' : app.status === 'Pending' ? '#eab308' : '#ef4444'}`, color: app.status === 'Approved' ? '#10b981' : app.status === 'Pending' ? '#eab308' : '#ef4444', backgroundColor: app.status === 'Approved' ? '#10b98120' : app.status === 'Pending' ? '#eab30820' : '#ef444420', borderRadius: '6px', fontSize: '11px', fontWeight: '600' }}>
                        {app.status}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: '#a1a1aa', fontSize: '13px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /> {new Date(app.date).toLocaleDateString()}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> {app.time}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Briefcase size={14} /> {app.reasonForVisit}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* OCR AI Upload Module */}
          <div style={{ backgroundColor: '#27272a', borderRadius: '12px', padding: '24px', border: '1px solid #3f3f46' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: '#3b82f6', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <UploadCloud size={20} color="white" />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#f4f4f5', margin: 0 }}>Smart Upload</h3>
            </div>
            <p style={{ fontSize: '14px', color: '#a1a1aa', marginBottom: '20px', lineHeight: '1.6' }}>
              Have a paper prescription? Upload it here and our AI will instantly digitize your medicines and timings.
            </p>
            
            <div style={{ border: '2px dashed #3f3f46', borderRadius: '8px', padding: '24px', textAlign: 'center', backgroundColor: '#18181b', transition: 'border-color 0.2s' }}>
              <input 
                type="file" 
                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} 
                accept="image/*" 
                style={{ color: '#a1a1aa', width: '100%', marginBottom: '16px' }} 
              />
              <button 
                onClick={handleUpload} 
                disabled={!file || uploading} 
                style={{ width: '100%', padding: '12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: (file && !uploading) ? 'pointer' : 'not-allowed', opacity: (file && !uploading) ? 1 : 0.6 }}
              >
                {uploading ? 'Processing with AI...' : 'Digitize Prescription'}
              </button>
            </div>

            {ocrText && (
              <div style={{ marginTop: '20px', backgroundColor: '#18181b', padding: '16px', borderRadius: '8px', border: '1px solid #10b981' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <CheckCircle2 size={16} color="#10b981" />
                  <span style={{ color: '#10b981', fontWeight: '600', fontSize: '14px' }}>Successful AI Extraction</span>
                </div>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#e4e4e7', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {ocrText.medicines.map((m: any, i: number) => (
                    <li key={i}>{m.name} - {m.dosage} <strong>({m.timing})</strong></li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Digital Prescriptions List */}
        <div style={{ backgroundColor: '#27272a', borderRadius: '12px', border: '1px solid #3f3f46', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: '#10b981', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <FileText size={20} color="white" />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#f4f4f5', margin: 0 }}>Active Prescriptions</h3>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', color: '#a1a1aa' }}>Filter Date:</span>
              <input 
                type="date" 
                value={filterDate} 
                onChange={(e) => setFilterDate(e.target.value)} 
                style={{ padding: '8px 12px', borderRadius: '6px', background: '#18181b', color: '#f4f4f5', border: '1px solid #3f3f46', outline: 'none', fontSize: '13px', WebkitAppearance: 'none' }} 
              />
              {filterDate && <button onClick={() => setFilterDate('')} style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>Clear</button>}
            </div>
          </div>

          {loading ? <p style={{ color: '#a1a1aa', fontSize: '14px' }}>Loading your records...</p> : 
            prescriptions.length === 0 ? <p style={{ color: '#a1a1aa', fontSize: '14px' }}>You have no digital prescriptions issued yet.</p> : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                {prescriptions.filter(px => filterDate ? new Date(px.createdAt).toISOString().split('T')[0] === filterDate : true).map((px) => (
                  <div key={px._id} id={`px-${px._id}`} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '20px', backgroundColor: '#18181b', borderRadius: '12px', border: '1px solid #3f3f46', position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #3f3f46' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ color: '#10b981', fontSize: '11px', fontWeight: '700', letterSpacing: '1px' }}>RX-{px._id.substring(0, 8).toUpperCase()}</span>
                        <span style={{ color: '#a1a1aa', fontSize: '14px', marginTop: '4px' }}>Dr. <strong style={{ color: '#f4f4f5' }}>{px.doctor?.lastName}</strong></span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={14} color="#a1a1aa" />
                          <span style={{ color: '#a1a1aa', fontSize: '12px' }}>{new Date(px.createdAt).toLocaleDateString()}</span>
                        </div>
                        <button 
                          onClick={async () => {
                            const element = document.getElementById(`px-${px._id}`);
                            if(element) {
                              const canvas = await html2canvas(element, { backgroundColor: '#18181b' });
                              const pdf = new jsPDF('p', 'mm', 'a5');
                              pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, 130, (canvas.height * 130) / canvas.width);
                              pdf.save(`Prescription_RX-${px._id.substring(0, 8).toUpperCase()}.pdf`);
                            }
                          }}
                          style={{ background: 'transparent', border: 'none', color: '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600' }}
                        >
                          <Download size={14} /> Download PDF
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                      {px.medicines.map((med: any, idx: number) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Pill size={16} color="#3b82f6" />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ color: '#f4f4f5', fontSize: '14px', fontWeight: '500' }}>{med.name}</span>
                              <span style={{ color: '#a1a1aa', fontSize: '12px' }}>{med.foodInstructions}</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                            <span style={{ color: '#10b981', fontSize: '13px', fontWeight: '600' }}>{med.dosage}</span>
                            <div style={{ padding: '2px 8px', backgroundColor: '#3f3f46', borderRadius: '4px', fontSize: '10px', color: '#e4e4e7', fontWeight: '600' }}>
                              {med.timing}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
          )}
        </div>

        {/* Secure Messaging Module */}
        <div style={{ backgroundColor: '#27272a', borderRadius: '12px', padding: '24px', border: '1px solid #3f3f46', gridColumn: '1 / -1', display: 'flex', gap: '24px', height: '400px' }}>
          <div style={{ flex: '0 0 250px', borderRight: '1px solid #3f3f46', paddingRight: '24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <MessageSquare size={20} color="#3b82f6" />
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#f4f4f5', margin: 0 }}>Network Chat</h3>
            </div>
            <p style={{ color: '#a1a1aa', fontSize: '13px', marginBottom: '16px' }}>Directly message your network doctors.</p>
            
            <select value={chatDoctorId} onChange={(e) => setChatDoctorId(e.target.value)} style={{ padding: '12px', background: '#18181b', border: '1px solid #3f3f46', borderRadius: '6px', color: '#f4f4f5', outline: 'none', fontSize: '13px' }}>
              <option value="">Select Doctor...</option>
              {doctors.map(d => <option key={d._id} value={d._id}>Dr. {d.firstName} {d.lastName}</option>)}
            </select>
          </div>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingLeft: '8px' }}>
            {!chatDoctorId ? (
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#a1a1aa', fontSize: '14px' }}>
                Select a doctor to start a secure conversation.
              </div>
            ) : (
              <>
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '16px' }}>
                  {chatMessages.length === 0 ? <p style={{ color: '#a1a1aa', fontSize: '13px', textAlign: 'center', marginTop: 'auto', marginBottom: 'auto' }}>No messages yet. Say hello!</p> : chatMessages.map((msg, i) => {
                    const isMe = msg.sender === user?._id;
                    return (
                      <div key={i} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                        <div style={{ maxWidth: '70%', padding: '12px 16px', borderRadius: isMe ? '12px 12px 0 12px' : '12px 12px 12px 0', backgroundColor: isMe ? '#3b82f6' : '#3f3f46', color: isMe ? '#ffffff' : '#e4e4e7', fontSize: '14px', lineHeight: '1.5' }}>
                          {msg.content}
                          <div style={{ fontSize: '10px', color: isMe ? '#bfdbfe' : '#a1a1aa', marginTop: '4px', textAlign: 'right' }}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                  <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Type a secure message..." style={{ flex: 1, padding: '12px 16px', background: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px', color: '#f4f4f5', outline: 'none' }} />
                  <button type="submit" disabled={!chatInput.trim()} style={{ padding: '12px', backgroundColor: chatInput.trim() ? '#3b82f6' : '#3f3f46', color: 'white', border: 'none', borderRadius: '8px', cursor: chatInput.trim() ? 'pointer' : 'not-allowed', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Send size={18} />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PatientDashboard;
