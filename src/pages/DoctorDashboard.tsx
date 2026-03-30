import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, ClipboardList, PenTool, Calendar, CheckCircle, XCircle, Clock, MessageSquare, Send } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { getApiUrl } from '../lib/api';
import { io } from 'socket.io-client';

const DoctorDashboard = () => {
  const { user } = useAuth();
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
      const res = await fetch(getApiUrl('/doctor/appointments'), {
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
        const res = await fetch(getApiUrl('/users/patients'), {
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
      const res = await fetch(getApiUrl(`/doctor/appointments/${id}`), {
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
      const res = await fetch(getApiUrl('/doctor/prescriptions'), {
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
      const res = await fetch(getApiUrl(`/messages/${chatPatientId}`), {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      if (res.ok) setChatMessages(await res.json());
    } catch (e) { console.error(e); }
  };

  const activeChatRef = useRef(chatPatientId);
  useEffect(() => { activeChatRef.current = chatPatientId; }, [chatPatientId]);

  useEffect(() => { loadChat(); }, [chatPatientId]);

  useEffect(() => {
    if (!user) return;
    const backendUrl = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || window.location.origin;
    const socket = io(backendUrl);
    
    socket.emit('setup', user._id);

    socket.on('message received', (newMessage: any) => {
      setChatMessages((prev) => {
        if (newMessage.sender === activeChatRef.current || newMessage.receiver === activeChatRef.current) {
          return [...prev, newMessage];
        }
        return prev;
      });
    });

    return () => { socket.disconnect(); };
  }, [user]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !chatPatientId) return;
    try {
      const res = await fetch(getApiUrl('/messages'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
        body: JSON.stringify({ receiverId: chatPatientId, content: chatInput })
      });
      if (res.ok) {
        setChatInput('');
        const savedMessage = await res.json();
        setChatMessages((prev) => [...prev, savedMessage]);
      }
    } catch (e) { console.error(e); }
  };

  const patientOptions = patients
    .filter(p => `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchPatient.toLowerCase()))
    .map(p => ({ value: p._id, label: `${p.firstName} ${p.lastName} — ${p.email}` }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back, Dr. {user?.lastName}</h1>
        <p className="text-muted-foreground mt-1">Here is the latest overview of your workspace.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Main Column */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Appointment Requests System */}
          <Card className="glass-card border-none shadow-sm overflow-hidden">
            <div className="p-6 pb-4 flex items-center gap-4 border-b border-border/50 bg-muted/20">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Appointment Requests</h2>
                <p className="text-sm text-muted-foreground">Manage incoming bookings from your patients.</p>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {appointments.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground bg-muted/30 rounded-2xl border border-dashed">
                  <Calendar className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                  No appointments booked yet.
                </div>
              ) : (
                appointments.map(app => (
                  <div key={app._id} className="group flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 rounded-2xl border border-border/60 bg-background/50 card-hover gap-4">
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2">
                        <User size={18} className="text-primary" />
                        <span className="font-semibold text-base">{app.patient?.firstName} {app.patient?.lastName}</span>
                        <span className="text-sm text-muted-foreground">• {app.patient?.phoneNumber}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground font-medium">
                        <div className="flex items-center gap-1.5"><Calendar size={15} className="text-muted-foreground/70" /> {new Date(app.date).toLocaleDateString()}</div>
                        <div className="flex items-center gap-1.5"><Clock size={15} className="text-muted-foreground/70" /> {app.time}</div>
                        <div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1 rounded-md text-foreground"><ClipboardList size={14} className="text-muted-foreground" /> {app.reasonForVisit}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      {app.status === 'Pending' ? (
                        <>
                          <Button size="sm" variant="outline" className="flex-1 sm:flex-none border-success/30 text-success hover:bg-success hover:border-success hover:text-white" onClick={() => updateAppointmentStatus(app._id, 'Approved')}>
                            <CheckCircle size={16} className="mr-1.5" /> Accept
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 sm:flex-none border-error/30 text-error hover:bg-error hover:border-error hover:text-white" onClick={() => updateAppointmentStatus(app._id, 'Rejected')}>
                            <XCircle size={16} className="mr-1.5" /> Reject
                          </Button>
                        </>
                      ) : (
                        <span className={`px-4 py-1.5 text-sm font-semibold rounded-full ${app.status === 'Approved' ? 'bg-success/15 text-success' : 'bg-error/15 text-error'}`}>
                          {app.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Write Digital Prescription Card */}
          <Card className="glass-card border-none shadow-sm overflow-hidden">
            <div className="p-6 pb-4 flex items-center gap-4 border-b border-border/50 bg-muted/20">
              <div className="p-3 bg-secondary/10 rounded-xl">
                <PenTool className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Digital Prescription Form</h2>
                <p className="text-sm text-muted-foreground">Assign specific medical protocols to your patients securely.</p>
              </div>
            </div>

            <div className="p-6">
              {message && (
                <div className="mb-6 p-4 bg-success/10 border border-success/30 text-success rounded-xl text-sm font-medium flex items-center gap-2">
                  <CheckCircle size={18} /> {message}
                </div>
              )}
              
              <form onSubmit={submitPrescription} className="space-y-6">
                
                {/* Patient Select Section */}
                <div className="bg-muted/30 p-5 rounded-2xl border border-border/50 space-y-4">
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide flex items-center gap-2">
                    <User size={16} className="text-primary"/> Select Patient
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
                    <div className="flex-1 w-full sm:max-w-[280px]">
                      <Input 
                        placeholder="Filter by name..." 
                        value={searchPatient} 
                        onChange={(e) => setSearchPatient(e.target.value)}
                        className="bg-background shadow-sm"
                      />
                    </div>
                    <div className="flex-[2] w-full">
                       <Select 
                        value={selectedPatient} 
                        onChange={(e) => setSelectedPatient(e.target.value)} 
                        options={[{ value: '', label: 'Choose a registered patient...' }, ...patientOptions]}
                        required
                        className="bg-background shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Medicines List Section */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide flex items-center gap-2">
                      <ClipboardList size={16} className="text-primary" /> Pharmacy Log
                    </h3>
                    <Button type="button" variant="outline" size="sm" onClick={addMedicineRow} className="shadow-sm">
                      + Add Medication Line
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {medicines.map((med, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row gap-4 bg-background/50 p-5 rounded-2xl border border-border/50 shadow-sm transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20">
                        <div className="hidden sm:flex w-7 h-7 bg-muted-foreground/10 rounded-full items-center justify-center text-sm font-semibold text-muted-foreground shrink-0 mt-1">
                          {idx + 1}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 flex-1">
                          <Input placeholder="Medication Name" value={med.name} onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)} required />
                          <Input placeholder="Dosage (e.g. 500mg)" value={med.dosage} onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)} required />
                          <Input placeholder="Time (Morning)" value={med.timing} onChange={(e) => handleMedicineChange(idx, 'timing', e.target.value)} required />
                          <Input placeholder="Duration (5 days)" value={med.duration} onChange={(e) => handleMedicineChange(idx, 'duration', e.target.value)} required />
                          <Input placeholder="Diet (After Food)" value={med.foodInstructions} onChange={(e) => handleMedicineChange(idx, 'foodInstructions', e.target.value)} required />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="submit" size="lg" className="w-full sm:w-auto px-8 shadow-md">
                    Publish Prescription Securely
                  </Button>
                </div>
                
              </form>
            </div>
          </Card>

        </div>

        {/* Side Column - Chat Module */}
        <div className="xl:col-span-1">
          <Card className="glass-card border-none shadow-sm flex flex-col h-[750px] sticky top-24 overflow-hidden">
            <div className="p-5 border-b border-border/50 bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-success/15 rounded-xl">
                  <MessageSquare size={20} className="text-success" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">Secure Interface</h3>
                  <p className="text-xs text-muted-foreground font-medium">End-to-end encrypted chat</p>
                </div>
              </div>
              
              <div className="mt-5">
                <Select 
                  value={chatPatientId} 
                  onChange={(e) => setChatPatientId(e.target.value)} 
                  options={[{ value: '', label: 'Select connection...' }, ...patients.map(p => ({ value: p._id, label: `${p.firstName} ${p.lastName}` }))]}
                  className="bg-background shadow-sm"
                />
              </div>
            </div>
            
            <div className="flex-1 flex flex-col min-h-0 bg-background/30 pb-4">
              {!chatPatientId ? (
                <div className="flex-1 flex flex-col justify-center items-center p-6 text-center text-sm text-muted-foreground gap-3">
                  <User className="w-12 h-12 text-muted-foreground/30" />
                  Select a patient above to open <br/> their direct messaging channel.
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col custom-scrollbar">
                    {chatMessages.length === 0 ? (
                      <div className="m-auto text-center">
                        <MessageSquare className="w-10 h-10 mx-auto text-muted-foreground/20 mb-3" />
                        <p className="text-sm text-muted-foreground font-medium">It's quiet here. Say hello!</p>
                      </div>
                    ) : chatMessages.map((msg, i) => {
                      const isMe = msg.sender === user?._id;
                      return (
                        <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                          <div className={`max-w-[85%] px-4 py-3 text-[14.5px] shadow-sm ${
                            isMe 
                              ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm' 
                              : 'bg-surface border border-border text-foreground rounded-2xl rounded-tl-sm'
                          }`}>
                            <p className="leading-relaxed">{msg.content}</p>
                            <div className={`text-[10px] font-semibold mt-1.5 ${isMe ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground/80'}`}>
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="px-4 mt-auto pt-2">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2 bg-surface p-1.5 rounded-full border border-border shadow-soft focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                      <input 
                        type="text" 
                        value={chatInput} 
                        onChange={(e) => setChatInput(e.target.value)} 
                        placeholder="Type exactly what you need..." 
                        className="flex-1 bg-transparent border-none text-[15px] px-5 py-2 focus:outline-none placeholder:text-muted-foreground/70" 
                      />
                      <Button 
                        type="submit" 
                        size="sm" 
                        disabled={!chatInput.trim()} 
                        className="rounded-full h-10 w-10 p-0 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200"
                      >
                        <Send size={16} className={chatInput.trim() ? 'translate-x-0.5' : 'opacity-70'} />
                      </Button>
                    </form>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default DoctorDashboard;
