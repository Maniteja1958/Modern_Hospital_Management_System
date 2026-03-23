const cron = require('node-cron');
const Prescription = require('../models/Prescription');

const startCronJobs = () => {
  // Check for 'Morning' medicines every day at 8:00 AM
  cron.schedule('0 8 * * *', async () => {
    console.log('--- EXECUTING MORNING CRON JOB ---');
    await notifyPatients('Morning');
  });

  // Check for 'Afternoon' medicines every day at 1:00 PM
  cron.schedule('0 13 * * *', async () => {
    console.log('--- EXECUTING AFTERNOON CRON JOB ---');
    await notifyPatients('Afternoon');
  });

  // Check for 'Night' medicines every day at 8:00 PM
  cron.schedule('0 20 * * *', async () => {
    console.log('--- EXECUTING NIGHT CRON JOB ---');
    await notifyPatients('Night');
  });

  console.log('✅ Background Cron Jobs initialized for Medicine Reminders.');
};

const notifyPatients = async (timeOfDay) => {
  const activePrescriptions = await Prescription.find({ status: 'Active' }).populate('patient', 'firstName email');
  
  activePrescriptions.forEach(px => {
    const medsToTake = px.medicines.filter(m => m.timing.toLowerCase().includes(timeOfDay.toLowerCase()));
    
    if (medsToTake.length > 0) {
      // In a real app, send Email via SendGrid or Push Notification to px.patient.email
      console.log(`🔔 NOTIFICATION SENT TO ${px.patient.email}:`);
      console.log(`Time to take your ${timeOfDay} medicines:`);
      medsToTake.forEach(m => console.log(`  - ${m.name} (${m.dosage}) ${m.foodInstructions}`));
    }
  });
};

module.exports = startCronJobs;
