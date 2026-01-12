const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patient_name: {
    type: {
      first: {
        type: String,
        required: true
      },
      middle: {
        type: String,
        default: null
      },
      last: {
        type: String,
        required: true
      }
    },
    required: true
  },
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    default: null
  },
  age: {
    type: Number,
    required: true
  },
  contact_information: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{7,10}$/.test(v);
      },
      message: props => `${props.value} is not a valid contact number! Use 7-10 digits`
    }
  },
  appointment_date: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])-\d{4}$/.test(v);
      },
      message: props => `${props.value} is not a valid date format! Use MM-DD-YYYY`
    }
  },
  appointment_time: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^(?:0[1-9]|1[0-2]):[0-5]\d\s(?:AM|PM)$/.test(v);
      },
      message: props => `${props.value} is not a valid time format! Use HH:MM AM/PM`
    }
  },
  appointment_type: {
    type: String,
    enum: [
      'Routine Check-up',
      'Follow-up',
      'New patient',
      'Consultation',
      'Emergency',
      'Specialist Consultation',
      'Procedure or Treatment',
      'Vaccination',
      'Counselling or Therapy',
      'Emergency Visit',
      'Telemedicine Appointment',
      'Other'
    ]
  },
  reason_for_appointment: {
    type: String,
    enum: [
      'General Health Check-up',
      'Regular',
      'Follow-up Visit',
      'Specialist Consultation',
      'Vaccination',
      'Screening Test ',
      'Symptoms Evaluation',
      'Emergency',
      'Routine check',
      'Urgent',
      'Routine Procedure (e.g., blood test, X-ray)',
      'Counseling or Therapy',
      'Prescription Refill',
      'Health Education',
      'Other'
    ]
  },
  urgency: {
    type: String,
    enum: ['No', 'Yes']
  },
  doctor: {
    type: String
  },
  comments: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports =
  mongoose.models.Appointment || mongoose.model("Appointment", appointmentSchema);

