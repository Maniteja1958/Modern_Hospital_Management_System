import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Pill, Calendar, UploadCloud, FileText, CheckCircle2, AlertCircle, Clock, Stethoscope, Briefcase, Download, MessageSquare, Send } from 'lucide-react';
import html2canvas from 'html2canvas';
import { getApiUrl } from '../lib/api';
import jsPDF from 'jspdf';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { io } from 'socket.io-client';

const PatientDashboard = () => {
  const { user } = useAuth();
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

  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        setHasPermission(permission === 'granted');
      });
    }
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await fetch(getApiUrl('/patient/appointments'), {
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
        const pxRes = await fetch(getApiUrl('/patient/prescriptions'), {
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

        const docRes = await fetch(getApiUrl('/users/doctors'), {
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
    fetchAppointments();
  }, [user]);

  useEffect(() => {
    if (reminders.length === 0) return;

    const intervalId = setInterval(() => {
      const now = new Date();
      const lastNotified = sessionStorage.getItem('lastNotificationFired');
      if (!lastNotified || (now.getTime() - parseInt(lastNotified)) > 3600000) {
        
        let shouldFire = false;
        if (timeOfDay === 'Morning' && now.getHours() >= 9) shouldFire = true;
        if (timeOfDay === 'Afternoon' && now.getHours() >= 14) shouldFire = true;
        if (timeOfDay === 'Night' && now.getHours() >= 20) shouldFire = true;

        if (shouldFire) {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, ctx.currentTime);
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

          if (hasPermission) {
            new Notification('Smart Hospital Reminder \uD83D\uDD14', {
              body: `It is time to take your ${timeOfDay} medication: ${reminders.map(m => m.name).join(', ')}.`,
              icon: 'https://cdn-icons-png.flaticon.com/512/3004/3004458.png',
              requireInteraction: true
            });
          }

          sessionStorage.setItem('lastNotificationFired', now.getTime().toString());
        }
      }
    }, 60000);

    return () => clearInterval(intervalId);
  }, [reminders, timeOfDay, hasPermission]);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(getApiUrl('/patient/upload-prescription'), {
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
      const res = await fetch(getApiUrl('/patient/appointments'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
        body: JSON.stringify(bookData)
      });
      if (res.ok) {
        setBookingSuccess('Appointment Request Sent!');
        setBookData({ doctorId: '', date: '', time: '', reasonForVisit: '' });
        fetchAppointments();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadChat = async () => {
    if (!chatDoctorId) return setChatMessages([]);
    try {
      const res = await fetch(getApiUrl(`/messages/${chatDoctorId}`), {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      if (res.ok) setChatMessages(await res.json());
    } catch (e) { console.error(e); }
  };

  const activeChatRef = useRef(chatDoctorId);
  useEffect(() => { activeChatRef.current = chatDoctorId; }, [chatDoctorId]);

  useEffect(() => { loadChat(); }, [chatDoctorId]);

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
    if (!chatInput.trim() || !chatDoctorId) return;
    try {
      const res = await fetch(getApiUrl('/messages'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
        body: JSON.stringify({ receiverId: chatDoctorId, content: chatInput })
      });
      if (res.ok) {
        setChatInput('');
        const savedMessage = await res.json();
        setChatMessages((prev) => [...prev, savedMessage]);
      }
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back, {user?.firstName}</h1>
        <p className="text-muted-foreground mt-1">Here is a summary of your health and upcoming tasks.</p>
      </div>

      {reminders.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-4 flex gap-4 items-center shadow-sm">
          <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6 text-destructive" />
          </div>
          <div>
            <h4 className="text-destructive font-semibold text-lg m-0">Action Required: {timeOfDay} Medicine</h4>
            <p className="text-destructive/80 text-sm m-0">
              Please take: <span className="font-semibold">{reminders.map(m => `${m.name} (${m.dosage})`).join(', ')}</span>
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Main Column */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Top Row: Appointments & AI Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Appointment Booking Module */}
            <Card className="glass-card shadow-sm border-none">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2.5 bg-primary/10 rounded-xl">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold m-0 text-foreground">Book Appointment</h3>
                </div>
                
                {bookingSuccess && (
                  <div className="p-3 bg-success/10 text-success border border-success/30 rounded-lg mb-5 text-sm flex items-center gap-2 font-medium">
                    <CheckCircle2 size={16} /> {bookingSuccess}
                  </div>
                )}

                <form onSubmit={handleBookAppointment} className="space-y-4">
                  <div>
                    <Select 
                      label="Choose Doctor"
                      value={bookData.doctorId} 
                      onChange={(e) => setBookData({...bookData, doctorId: e.target.value})} 
                      options={[{ value: '', label: 'Select a Doctor from Network' }, ...doctors.map(d => ({ value: d._id, label: `Dr. ${d.firstName} ${d.lastName}` }))]}
                      required
                      className="bg-background shadow-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input 
                        label="Date"
                        type="date" 
                        value={bookData.date} 
                        onChange={(e) => setBookData({...bookData, date: e.target.value})} 
                        required 
                        className="bg-background shadow-sm"
                      />
                    </div>
                    <div>
                      <Input 
                        label="Time"
                        type="time" 
                        value={bookData.time} 
                        onChange={(e) => setBookData({...bookData, time: e.target.value})} 
                        required 
                        className="bg-background shadow-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <Input 
                      label="Reason for Visit"
                      placeholder="e.g. Regular Checkup, Fever" 
                      value={bookData.reasonForVisit} 
                      onChange={(e) => setBookData({...bookData, reasonForVisit: e.target.value})} 
                      required 
                      className="bg-background shadow-sm"
                    />
                  </div>

                  <Button type="submit" className="w-full mt-2" size="lg">
                    Request Appointment
                  </Button>
                </form>
              </div>
            </Card>

            {/* OCR AI Upload Module */}
            <Card className="glass-card shadow-sm border-none">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-primary/10 rounded-xl">
                    <UploadCloud className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold m-0 text-foreground">Smart Upload</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                  Have a paper prescription? Upload it here and our AI will instantly digitize your medicines and timings.
                </p>
                
                <div className="border-2 border-dashed border-border hover:border-primary/50 transition-colors rounded-xl p-6 text-center bg-background/50 group">
                  <input 
                    type="file" 
                    onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} 
                    accept="image/*" 
                    className="w-full text-muted-foreground mb-4 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                  />
                  <Button 
                    onClick={handleUpload} 
                    disabled={!file || uploading} 
                    className="w-full shadow-sm"
                    variant={file && !uploading ? 'primary' : 'secondary'}
                  >
                    {uploading ? 'Processing with AI...' : 'Digitize Prescription'}
                  </Button>
                </div>

                {ocrText && (
                  <div className="mt-5 bg-background shadow-sm p-4 rounded-xl border border-success/30">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 size={16} className="text-success" />
                      <span className="text-success font-semibold text-sm">Successful AI Extraction</span>
                    </div>
                    <ul className="m-0 pl-5 text-foreground text-sm space-y-1.5 list-disc marker:text-success/50">
                      {ocrText.medicines.map((m: any, i: number) => (
                        <li key={i}>{m.name} - {m.dosage} <strong className="text-muted-foreground ml-1">({m.timing})</strong></li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* My Appointments List */}
          <Card className="glass-card shadow-sm border-none overflow-hidden">
            <div className="p-6 pb-4 border-b border-border/50 bg-muted/20">
              <h3 className="text-xl font-semibold m-0 text-foreground flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary"/> My Appointments
              </h3>
            </div>
            <div className="p-6">
              {appointments.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground bg-background rounded-xl border border-dashed text-sm">
                  You have no appointments scheduled.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {appointments.map(app => (
                    <div key={app._id} className="flex flex-col gap-3 p-4 bg-background rounded-2xl border border-border/60 hover:shadow-md transition-all">
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-[15px] text-foreground">Dr. {app.doctor?.lastName}</span>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${app.status === 'Approved' ? 'bg-success/15 text-success' : app.status === 'Pending' ? 'bg-warning/15 text-warning' : 'bg-error/15 text-error'}`}>
                          {app.status}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2 text-muted-foreground text-[13px] font-medium">
                        <div className="flex items-center gap-2"><Calendar size={14} className="text-primary/70"/> {new Date(app.date).toLocaleDateString()}</div>
                        <div className="flex items-center gap-2"><Clock size={14} className="text-primary/70"/> {app.time}</div>
                        <div className="flex items-center gap-2"><Briefcase size={14} className="text-primary/70"/> {app.reasonForVisit}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Digital Prescriptions List */}
          <Card className="glass-card shadow-sm border-none overflow-hidden">
            <div className="p-6 pb-4 border-b border-border/50 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-xl">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold m-0 text-foreground">Active Prescriptions</h3>
              </div>
              
              <div className="flex items-center gap-2 bg-background p-1.5 rounded-lg border shadow-sm w-fit">
                <span className="text-xs text-muted-foreground px-2 font-medium">Filter:</span>
                <input 
                  type="date" 
                  value={filterDate} 
                  onChange={(e) => setFilterDate(e.target.value)} 
                  className="bg-transparent border-none text-xs text-foreground focus:outline-none focus:ring-0" 
                />
                {filterDate && <Button variant="ghost" size="sm" onClick={() => setFilterDate('')} className="h-6 px-2 text-xs text-error hover:text-error hover:bg-error/10">Clear</Button>}
              </div>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="p-6 text-center text-muted-foreground animate-pulse text-sm">Loading your records...</div>
              ) : prescriptions.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground bg-background rounded-xl border border-dashed text-sm">
                  You have no digital prescriptions issued yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {prescriptions.filter(px => filterDate ? new Date(px.createdAt).toISOString().split('T')[0] === filterDate : true).map((px) => (
                    <div key={px._id} id={`px-${px._id}`} className="flex flex-col gap-3 p-5 bg-background rounded-2xl border border-border/60 hover:shadow-md transition-shadow relative">
                      <div className="flex items-center justify-between pb-4 border-b border-border/60">
                        <div className="flex flex-col gap-1">
                          <span className="text-primary text-[10px] font-bold tracking-widest uppercase bg-primary/10 w-fit px-2 py-0.5 rounded-full">RX-{px._id.substring(0, 8)}</span>
                          <span className="text-sm text-foreground font-semibold mt-1">Dr. {px.doctor?.lastName}</span>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
                            <Calendar size={12} /> {new Date(px.createdAt).toLocaleDateString()}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-7 px-2 text-xs text-primary hover:text-primary hover:bg-primary/10"
                            onClick={async () => {
                              const element = document.getElementById(`px-${px._id}`);
                              if(element) {
                                const canvas = await html2canvas(element, { backgroundColor: getComputedStyle(document.body).getPropertyValue('--background') || '#ffffff' });
                                const pdf = new jsPDF('p', 'mm', 'a5');
                                pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, 130, (canvas.height * 130) / canvas.width);
                                pdf.save(`Prescription_RX-${px._id.substring(0, 8).toUpperCase()}.pdf`);
                              }
                            }}
                          >
                            <Download size={14} className="mr-1.5" /> Save PDF
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 mt-1">
                        {px.medicines.map((med: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="p-1.5 bg-primary/10 rounded-md">
                                <Pill size={16} className="text-primary" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-foreground leading-tight">{med.name}</span>
                                <span className="text-[11px] text-muted-foreground mt-0.5">{med.foodInstructions}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-[13px] font-bold text-foreground">{med.dosage}</span>
                              <span className="px-2 py-0.5 bg-muted rounded text-[10px] font-semibold text-muted-foreground tracking-wide">
                                {med.timing}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Side Column - Chat Module */}
        <div className="xl:col-span-1">
          <Card className="glass-card border-none shadow-sm flex flex-col h-[750px] sticky top-24 overflow-hidden">
            <div className="p-5 border-b border-border/50 bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-xl">
                  <MessageSquare size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">Care Network Chat</h3>
                  <p className="text-xs text-muted-foreground font-medium">Message your doctors directly</p>
                </div>
              </div>
              
              <div className="mt-5">
                <Select 
                  value={chatDoctorId} 
                  onChange={(e) => setChatDoctorId(e.target.value)} 
                  options={[{ value: '', label: 'Select connection...' }, ...doctors.map(d => ({ value: d._id, label: `Dr. ${d.firstName} ${d.lastName}` }))]}
                  className="bg-background shadow-sm"
                />
              </div>
            </div>
            
            <div className="flex-1 flex flex-col min-h-0 bg-background/30 pb-4">
              {!chatDoctorId ? (
                <div className="flex-1 flex flex-col justify-center items-center p-6 text-center text-sm text-muted-foreground gap-3">
                  <Stethoscope className="w-12 h-12 text-muted-foreground/30" />
                  Select a doctor above to start <br/> a secure conversation.
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
                        placeholder="Type a secure message..." 
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

export default PatientDashboard;
