import {
  deleteScannedContact as deleteScannedContactDb,
  getScannedContacts as getScannedContactsDb,
  getSocialProfile as getSocialProfileDb,
  saveScannedContact as saveScannedContactDb,
  saveSocialProfile as saveSocialProfileDb,
} from "@/src/services/database";
import { QRPayload, ScannedContact, SocialProfile } from "../types";

export const saveSocialProfile = async (
  studentId: string,
  profile: SocialProfile
): Promise<void> => {
  return saveSocialProfileDb(studentId, profile);
};

export const getSocialProfile = async (
  studentId: string
): Promise<SocialProfile | null> => {
  return getSocialProfileDb(studentId);
};

export const saveScannedContact = async (
  scannedBy: string,
  payload: QRPayload
): Promise<void> => {
  return saveScannedContactDb(scannedBy, payload);
};

export const getScannedContacts = async (
  scannedBy: string
): Promise<ScannedContact[]> => {
  return getScannedContactsDb(scannedBy);
};

export const deleteScannedContact = async (id: number): Promise<void> => {
  return deleteScannedContactDb(id);
};
