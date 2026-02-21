import { create } from "zustand";
import {
  deleteScannedContact,
  getScannedContacts,
  getSocialProfile,
  saveScannedContact,
  saveSocialProfile,
} from "../api";
import { QRPayload, ScannedContact, SocialProfile } from "../types";

interface ConnectState {
  socialProfile: SocialProfile | null;
  scannedContacts: ScannedContact[];
  isProfileLoading: boolean;
  hasFetchedSocialProfile: boolean;
  isContactsLoading: boolean;
  error: string | null;
  fetchSocialProfile: (studentId: string) => Promise<void>;
  updateSocialProfile: (
    studentId: string,
    profile: SocialProfile
  ) => Promise<void>;
  fetchScannedContacts: (studentId: string) => Promise<void>;
  addScannedContact: (studentId: string, payload: QRPayload) => Promise<void>;
  removeScannedContact: (id: number, studentId: string) => Promise<void>;
}

export const useConnectStore = create<ConnectState>((set) => ({
  socialProfile: null,
  scannedContacts: [],
  isProfileLoading: false,
  hasFetchedSocialProfile: false,
  isContactsLoading: false,
  error: null,

  fetchSocialProfile: async (studentId: string) => {
    set({ isProfileLoading: true, error: null });
    try {
      const profile = await getSocialProfile(studentId);
      set({ socialProfile: profile, isProfileLoading: false, hasFetchedSocialProfile: true });
    } catch (error: any) {
      set({ error: error.message, isProfileLoading: false, hasFetchedSocialProfile: true });
    }
  },

  updateSocialProfile: async (studentId: string, profile: SocialProfile) => {
    set({ isProfileLoading: true, error: null });
    try {
      await saveSocialProfile(studentId, profile);
      set({ socialProfile: profile, isProfileLoading: false });
    } catch (error: any) {
      set({ error: error.message, isProfileLoading: false });
    }
  },

  fetchScannedContacts: async (studentId: string) => {
    set({ isContactsLoading: true, error: null });
    try {
      const contacts = await getScannedContacts(studentId);
      set({ scannedContacts: contacts, isContactsLoading: false });
    } catch (error: any) {
      set({ error: error.message, isContactsLoading: false });
    }
  },

  addScannedContact: async (studentId: string, payload: QRPayload) => {
    set({ isContactsLoading: true, error: null });
    try {
      await saveScannedContact(studentId, payload);
      const contacts = await getScannedContacts(studentId);
      set({ scannedContacts: contacts, isContactsLoading: false });
    } catch (error: any) {
      set({ error: error.message, isContactsLoading: false });
      throw error;
    }
  },

  removeScannedContact: async (id: number, studentId: string) => {
    set({ isContactsLoading: true, error: null });
    try {
      await deleteScannedContact(id);
      const contacts = await getScannedContacts(studentId);
      set({ scannedContacts: contacts, isContactsLoading: false });
    } catch (error: any) {
      set({ error: error.message, isContactsLoading: false });
    }
  },
}));
