const Tesseract = require('tesseract.js');
const Prescription = require('../models/Prescription');

// @desc    Upload image and run OCR extraction
// @route   POST /api/patient/upload-prescription
// @access  Private/Patient
const extractPrescriptionText = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image uploaded' });
  }

  try {
    // Run OCR Using Tesseract.js
    const { data: { text } } = await Tesseract.recognize(req.file.path, 'eng');

    // Dynamic AI Regex extraction engine
    const lines = text.split('\n');
    const dynamicMedicines = [];
    
    const timeKeywords = ['morning', 'night', 'afternoon', 'bedtime', 'evening'];

    lines.forEach(line => {
      const lowerLine = line.toLowerCase();
      // Look for dosages (e.g. 500mg, 10ml)
      const dosageMatch = lowerLine.match(/(\d+\s*(?:mg|ml|g|mcg|tablet|tab|capsule)s?)/i);
      
      if (dosageMatch) {
         // Clean up name by extracting out the dosage and stripping weird chars
         let name = line.replace(new RegExp(dosageMatch[0], 'i'), '').trim();
         name = name.replace(/[^a-zA-Z\s]/g, '').trim();
         
         if (name.length > 2) {
           let timingStr = 'As directed';
           timeKeywords.forEach(tk => {
             if (lowerLine.includes(tk)) timingStr = tk.charAt(0).toUpperCase() + tk.slice(1);
           });
           
           dynamicMedicines.push({
             name: name.substring(0, 30), // Prevent giant gibberish strings
             dosage: dosageMatch[0],
             timing: timingStr,
             duration: lowerLine.includes('day') ? '7 Days' : 'As needed',
             foodInstructions: lowerLine.includes('food') || lowerLine.includes('meal') ? 'With food' : 'Routine'
           });
         }
      }
    });

    // Provide intelligent fallback if regex finds no clean matches in the bad handwriting
    if (dynamicMedicines.length === 0 && text.length > 15) {
      dynamicMedicines.push({
        name: 'Extracted: ' + text.substring(0, 15).replace(/[^a-zA-Z\s]/g, '').trim(),
        dosage: 'See Label',
        timing: 'As Directed',
        duration: 'See Script',
        foodInstructions: 'See Script'
      });
    }

    const extractedData = {
      rawText: text,
      medicines: dynamicMedicines.length > 0 ? dynamicMedicines : [
        { name: 'AI Fallback (Illegible)', dosage: 'Unknown', timing: '-', duration: '-', foodInstructions: '-' }
      ]
    };

    res.status(200).json(extractedData);
  } catch (error) {
    res.status(500).json({ message: 'Failed to process image: ' + error.message });
  }
};

module.exports = {
  extractPrescriptionText,
};
