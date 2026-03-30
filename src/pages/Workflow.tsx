import { CheckCircle2, UserPlus, CalendarCheck, FileText, Pill, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const workflowSteps = [
  {
    id: 1,
    title: "Account Registration",
    description: "Patients and doctors sign up for secure access onto the PharmaCare system.",
    icon: UserPlus,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    id: 2,
    title: "Appointment Booking",
    description: "Patients browse the directory and request timeslots with registered doctors.",
    icon: CalendarCheck,
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    id: 3,
    title: "Doctor Approval",
    description: "Doctors review pending requests and approve/reject bookings instantly.",
    icon: CheckCircle2,
    color: "bg-green-500/10 text-green-500",
  },
  {
    id: 4,
    title: "Digital Prescription",
    description: "Doctors issue highly structured, digitized prescriptions directly to the patient's portal.",
    icon: FileText,
    color: "bg-amber-500/10 text-amber-500",
  },
  {
    id: 5,
    title: "Medication Fulfillment",
    description: "Patients review their automated medication schedules safely retrieved via OCR/system linkage.",
    icon: Pill,
    color: "bg-red-500/10 text-red-500",
  }
];

export default function Workflow() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div className="flex items-center gap-3">
        <div className="p-3 glass-card rounded-xl border border-primary/20">
          <Activity className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">System Workflow</h1>
          <p className="text-muted-foreground text-sm">Visual representation of standard operational procedures.</p>
        </div>
      </div>

      <div className="relative border-l-2 border-primary/20 ml-6 md:ml-8 pl-8 space-y-12 py-4">
        {workflowSteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.id} className="relative">
              {/* Timeline dot/icon */}
              <div className={`absolute -left-[45px] top-1 h-10 w-10 rounded-full flex items-center justify-center border-2 border-background shadow-sm ${step.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              
              <Card className="glass-card hover:shadow-md transition-shadow border-muted duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Step {step.id}: {step.title}</CardTitle>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border">
                      Phase {index + 1}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm md:text-base leading-relaxed text-muted-foreground">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
      
    </div>
  );
}
