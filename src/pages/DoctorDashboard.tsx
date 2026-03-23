import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, ClipboardList, PenTool, Calendar, CheckCircle, XCircle, Clock, MessageSquare, Send } from 'lucide-react';

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [medicines, setMedicines] = useState([{ name: '', dosage: '', timing: '', duration: '', foodInstructions: '' }]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [searchPatient, setSearchPatient] = useState('');
  const [message, setMessage] = useState('');
  
  // Chat States
  const [chatPatientId, setChatPatientId] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/doctor/appointments', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      if (res.ok) setAppointments(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch('/api/users/patients', {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        if (res.ok) setPatients(await res.json());
      } catch (err) {
        console.error(err);
      }
    };
    fetchPatients();
    fetchAppointments();
  }, [user]);

  const addMedicineRow = () => {
    setMedicines([...medicines, { name: '', dosage: '', timing: '', duration: '', foodInstructions: '' }]);
  };

  const handleMedicineChange = (index: number, field: string, value: string) => {
    const newMeds = [...medicines];
    newMeds[index] = { ...newMeds[index], [field]: value };
    setMedicines(newMeds);
  };

  const updateAppointmentStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/doctor/appointments/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}` 
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchAppointments(); // Refresh list
      }
    } catch (err) {
      console.error(err);
    }
  };

  const submitPrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/doctor/prescriptions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}` 
        },
        body: JSON.stringify({ patientId: selectedPatient, medicines })
      });
      if (res.ok) {
        setMessage('Prescription saved securely!');
        setMedicines([{ name: '', dosage: '', timing: '', duration: '', foodInstructions: '' }]);
        setSelectedPatient('');
      } else {
        setMessage('Failed to save prescription.');
      }
    } catch (err) {
      setMessage('Network Error');
    }
  };

  const loadChat = async () => {
    if (!chatPatientId) return setChatMessages([]);
    try {
      const res = await fetch(`/api/messages/${chatPatientId}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      if (res.ok) setChatMessages(await res.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => { loadChat(); }, [chatPatientId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !chatPatientId) return;
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
        body: JSON.stringify({ receiverId: chatPatientId, content: chatInput })
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', maxWidth: '1000px', margin: '0 auto 32px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#f4f4f5', margin: 0 }}>Doctor Workspace</h2>
          <p style={{ color: '#a1a1aa', margin: '4px 0 0 0', fontSize: '14px' }}>Welcome, Dr. {user?.lastName}!</p>
        </div>
        <button onClick={logout} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #3f3f46', color: '#a1a1aa', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Appointment Requests System */}
        <div style={{ backgroundColor: '#27272a', borderRadius: '12px', padding: '32px', border: '1px solid #3f3f46', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: '#eab30820', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(234, 179, 8, 0.3)' }}>
              <Calendar size={24} color="#eab308" />
            </div>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#f4f4f5', margin: 0 }}>Appointment Requests</h3>
              <p style={{ color: '#a1a1aa', fontSize: '14px', margin: '4px 0 0 0' }}>Manage incoming bookings from your patients.</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {appointments.length === 0 ? <p style={{ color: '#a1a1aa', fontSize: '14px' }}>No appointments booked yet.</p> : (
              appointments.map(app => (
                <div key={app._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#18181b', padding: '16px 20px', borderRadius: '8px', border: '1px solid #3f3f46' }}>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <User size={16} color="#3b82f6" />
                      <span style={{ color: '#f4f4f5', fontWeight: '600', fontSize: '16px' }}>{app.patient?.firstName} {app.patient?.lastName}</span>
                      <span style={{ color: '#a1a1aa', fontSize: '14px' }}>• {app.patient?.phoneNumber}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#a1a1aa', fontSize: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} color="#a1a1aa" /> {new Date(app.date).toLocaleDateString()}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} color="#a1a1aa" /> {app.time}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><ClipboardList size={14} color="#a1a1aa" /> {app.reasonForVisit}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {app.status === 'Pending' ? (
                      <>
                        <button onClick={() => updateAppointmentStatus(app._id, 'Approved')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#10b98120', color: '#10b981', border: '1px solid #10b981', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                          <CheckCircle size={16} /> Accept
                        </button>
                        <button onClick={() => updateAppointmentStatus(app._id, 'Rejected')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#ef444420', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                          <XCircle size={16} /> Reject
                        </button>
                      </>
                    ) : (
                      <div style={{ padding: '6px 12px', border: `1px solid ${app.status === 'Approved' ? '#10b981' : '#ef4444'}`, color: app.status === 'Approved' ? '#10b981' : '#ef4444', backgroundColor: app.status === 'Approved' ? '#10b98120' : '#ef444420', borderRadius: '6px', fontSize: '13px', fontWeight: '600' }}>
                        {app.status}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Write Digital Prescription Card */}
        <div style={{ backgroundColor: '#27272a', borderRadius: '12px', padding: '32px', border: '1px solid #3f3f46', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: '#3b82f6', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)' }}>
              <PenTool size={24} color="white" />
            </div>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#f4f4f5', margin: 0 }}>Create Digital Prescription</h3>
              <p style={{ color: '#a1a1aa', fontSize: '14px', margin: '4px 0 0 0' }}>Assign specific medical protocols to your patients.</p>
            </div>
          </div>

          {message && <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#10b98120', border: '1px solid #10b981', color: '#10b981', borderRadius: '8px', fontSize: '15px' }}>{message}</div>}
          
          <form onSubmit={submitPrescription} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Patient Select Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a1a1aa', fontSize: '14px', fontWeight: '500' }}>
                  <User size={16} /> Select Patient
                </label>
                <input 
                  type="text" 
                  placeholder="Search by name..." 
                  value={searchPatient} 
                  onChange={(e) => setSearchPatient(e.target.value)}
                  style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '13px', background: '#18181b', color: '#f4f4f5', border: '1px solid #3f3f46', outline: 'none' }}
                />
              </div>
              <select 
                value={selectedPatient} 
                onChange={(e) => setSelectedPatient(e.target.value)} 
                required 
                style={{ width: '100%', padding: '14px', background: '#18181b', color: '#f4f4f5', border: '1px solid #3f3f46', borderRadius: '8px', fontSize: '15px', outline: 'none' }}
              >
                <option value="">Choose a registered patient...</option>
                {patients.filter(p => `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchPatient.toLowerCase())).map((p: any) => (
                  <option key={p._id} value={p._id}>{p.firstName} {p.lastName} — {p.email}</option>
                ))}
              </select>
            </div>

            {/* Medicines List Section */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a1a1aa', fontSize: '14px', fontWeight: '500' }}>
                  <ClipboardList size={16} /> Prescribe Medicines
                </label>
                <button type="button" onClick={addMedicineRow} style={{ padding: '6px 12px', background: 'transparent', color: '#3b82f6', border: '1px solid #3b82f6', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
                  + Line Item
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {medicines.map((med, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '12px', backgroundColor: '#18181b', padding: '16px', borderRadius: '8px', border: '1px solid #3f3f46' }}>
                    <div style={{ width: '24px', height: '24px', backgroundColor: '#27272a', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#a1a1aa', fontSize: '12px', marginTop: '10px' }}>{idx + 1}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', flex: 1 }}>
                      <input placeholder="Medication Name (e.g. Advil)" value={med.name} onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)} required style={{ padding: '10px 14px', background: 'transparent', color: '#f0f0f0', border: '1px solid #3f3f46', borderRadius: '6px', fontSize: '14px' }} />
                      <input placeholder="Dosage (e.g. 500mg)" value={med.dosage} onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)} required style={{ padding: '10px 14px', background: 'transparent', color: '#f0f0f0', border: '1px solid #3f3f46', borderRadius: '6px', fontSize: '14px' }} />
                      <input placeholder="Time (Morning, Night)" value={med.timing} onChange={(e) => handleMedicineChange(idx, 'timing', e.target.value)} required style={{ padding: '10px 14px', background: 'transparent', color: '#f0f0f0', border: '1px solid #3f3f46', borderRadius: '6px', fontSize: '14px' }} />
                      <input placeholder="Duration (5 days)" value={med.duration} onChange={(e) => handleMedicineChange(idx, 'duration', e.target.value)} required style={{ padding: '10px 14px', background: 'transparent', color: '#f0f0f0', border: '1px solid #3f3f46', borderRadius: '6px', fontSize: '14px' }} />
                      <input placeholder="Diet (After Food)" value={med.foodInstructions} onChange={(e) => handleMedicineChange(idx, 'foodInstructions', e.target.value)} required style={{ padding: '10px 14px', background: 'transparent', color: '#f0f0f0', border: '1px solid #3f3f46', borderRadius: '6px', fontSize: '14px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button type="submit" style={{ padding: '14px 28px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)' }}>
                Publish Prescription
              </button>
            </div>
            
          </form>
        </div>

        {/* Doctor Messaging Module */}
        <div style={{ backgroundColor: '#27272a', borderRadius: '12px', padding: '24px', border: '1px solid #3f3f46', display: 'flex', gap: '24px', height: '400px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}>
          <div style={{ flex: '0 0 250px', borderRight: '1px solid #3f3f46', paddingRight: '24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <MessageSquare size={20} color="#10b981" />
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#f4f4f5', margin: 0 }}>Secure Messages</h3>
            </div>
            <p style={{ color: '#a1a1aa', fontSize: '13px', marginBottom: '16px' }}>Reply to patient inquiries directly.</p>
            
            <select value={chatPatientId} onChange={(e) => setChatPatientId(e.target.value)} style={{ padding: '12px', background: '#18181b', border: '1px solid #3f3f46', borderRadius: '6px', color: '#f4f4f5', outline: 'none', fontSize: '13px' }}>
              <option value="">Select Patient...</option>
              {patients.map((p: any) => <option key={p._id} value={p._id}>{p.firstName} {p.lastName}</option>)}
            </select>
          </div>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingLeft: '8px' }}>
            {!chatPatientId ? (
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#a1a1aa', fontSize: '14px' }}>
                Select a patient to open their chat channel.
              </div>
            ) : (
              <>
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '16px' }}>
                  {chatMessages.length === 0 ? <p style={{ color: '#a1a1aa', fontSize: '13px', textAlign: 'center', marginTop: 'auto', marginBottom: 'auto' }}>No messages yet on this channel.</p> : chatMessages.map((msg, i) => {
                    const isMe = msg.sender === user?._id;
                    return (
                      <div key={i} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                        <div style={{ maxWidth: '70%', padding: '12px 16px', borderRadius: isMe ? '12px 12px 0 12px' : '12px 12px 12px 0', backgroundColor: isMe ? '#10b981' : '#3f3f46', color: isMe ? '#ffffff' : '#e4e4e7', fontSize: '14px', lineHeight: '1.5' }}>
                          {msg.content}
                          <div style={{ fontSize: '10px', color: isMe ? '#d1fae5' : '#a1a1aa', marginTop: '4px', textAlign: 'right' }}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                  <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Type a response..." style={{ flex: 1, padding: '12px 16px', background: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px', color: '#f4f4f5', outline: 'none' }} />
                  <button type="submit" disabled={!chatInput.trim()} style={{ padding: '12px', backgroundColor: chatInput.trim() ? '#10b981' : '#3f3f46', color: 'white', border: 'none', borderRadius: '8px', cursor: chatInput.trim() ? 'pointer' : 'not-allowed', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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

export default DoctorDashboard;
