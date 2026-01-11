import mongoose, { Document, Schema } from 'mongoose';

export interface IDoctor extends Document {
  userId: mongoose.Types.ObjectId;
  specialization: string;
  licenseNumber: string;
  yearsOfExperience: number;
  qualifications: string[];
  clinicAddress?: string;
  consultationFee: number;
  availableDays: string[];
  availableTimeSlots: {
    start: string;
    end: string;
  }[];
  bio?: string;
  isVerified: boolean;
  rating: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

const DoctorSchema = new Schema<IDoctor>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      trim: true
    },
    licenseNumber: {
      type: String,
      required: [true, 'License number is required'],
      unique: true,
      trim: true
    },
    yearsOfExperience: {
      type: Number,
      required: [true, 'Years of experience is required'],
      min: [0, 'Years of experience cannot be negative']
    },
    qualifications: {
      type: [String],
      required: [true, 'At least one qualification is required'],
      validate: {
        validator: function(v: string[]) {
          return v && v.length > 0;
        },
        message: 'At least one qualification is required'
      }
    },
    clinicAddress: {
      type: String,
      trim: true
    },
    consultationFee: {
      type: Number,
      required: [true, 'Consultation fee is required'],
      min: [0, 'Consultation fee cannot be negative']
    },
    availableDays: {
      type: [String],
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      default: []
    },
    availableTimeSlots: [
      {
        start: {
          type: String,
          required: true,
          match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Please provide valid time format (HH:MM)']
        },
        end: {
          type: String,
          required: true,
          match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Please provide valid time format (HH:MM)']
        }
      }
    ],
    bio: {
      type: String,
      maxlength: [1000, 'Bio cannot exceed 1000 characters']
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Indexes for better query performance
DoctorSchema.index({ userId: 1 });
DoctorSchema.index({ specialization: 1 });
DoctorSchema.index({ isVerified: 1 });
DoctorSchema.index({ rating: -1 });

export const Doctor = mongoose.model<IDoctor>('Doctor', DoctorSchema);