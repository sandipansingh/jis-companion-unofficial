export interface SocialProfile {
  github?: string;
  linkedin?: string;
  portfolio?: string;
  discord?: string;
  x?: string;
}

export interface ScannedContact {
  id: number;
  scannedBy: string;
  payload: QRPayload;
  timestamp: number;
}

export interface QRPayload {
  studentId: string;
  fullName: string;
  profilePicUrl?: string;
  college?: {
    name: string;
    branch: string;
    semester: string;
  };
  contact?: {
    email: string;
    mobileNumber: string;
  };
  social?: SocialProfile;
}
