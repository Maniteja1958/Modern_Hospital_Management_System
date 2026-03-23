const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true }, // e.g., '500mg'
  timing: { type: String, required: true }, // e.g., 'Morning, Night'
  duration: { type: String, required: true }, // e.g., '5 days'
  foodInstructions: { type: String, required: true }, // e.g., 'After Meal'
});

const PrescriptionSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    imageUrl: {
      type: String, // If uploaded by patient for OCR
    },
    medicines: [MedicineSchema],
    status: {
      type: String,
      enum: ['Active', 'Completed'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Prescription', PrescriptionSchema);
