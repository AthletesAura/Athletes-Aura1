import { 
  collection, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  getDocFromServer,
  onSnapshot
} from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytesResumable, uploadBytes } from 'firebase/storage';
import { db, storage, auth, handleFirestoreError, OperationType } from '../firebase.ts';
import { Program, Coach, BlogPost, Offer, Lead, SiteSettings, Testimonial, MembershipTier, PlanInquiry, FreeResource, LegalPage, CounselingService } from '../types.ts';
import { SEED_PROGRAMS, SEED_COACHES, SEED_BLOGS, SEED_OFFERS, SEED_SETTINGS, SEED_TESTIMONIALS, SEED_MEMBERSHIPS, SEED_FREE_RESOURCES, SEED_LEGAL_PAGES, SEED_COUNSELING } from '../constants.ts';

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const StorageService = {
  uploadImage: async (file: File, folder: string = 'uploads', onProgress?: (progress: number) => void): Promise<string> => {
    console.log(`Starting upload for ${file.name} to ${folder}...`);
    console.log(`Using storage bucket: ${storage.app.options.storageBucket}`);
    if (!auth.currentUser) {
      console.warn("No authenticated user found for storage upload.");
    }
    
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `${folder}/${fileName}`);
      
      return new Promise((resolve, reject) => {
        const uploadTask = uploadBytesResumable(storageRef, file);
        
        const timeout = setTimeout(() => {
          uploadTask.cancel();
          reject(new Error("Upload timed out after 600 seconds."));
        }, 600000);

        uploadTask.on('state_changed', 
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload progress: ${Math.round(progress)}% (${snapshot.bytesTransferred}/${snapshot.totalBytes} bytes)`);
            if (onProgress) onProgress(progress);
          }, 
          async (error) => {
            clearTimeout(timeout);
            console.error("Upload task failed with error:", error.code, error.message);
            
            // If it's a CORS/Preflight error, try the simpler uploadBytes
            if (error.code === 'storage/unknown' || (error.message && error.message.includes('preflight'))) {
              console.log("Attempting fallback to uploadBytes...");
              try {
                const result = await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(result.ref);
                console.log("Fallback uploadBytes successful:", downloadURL);
                resolve(downloadURL);
              } catch (fallbackError: any) {
                console.error("Fallback uploadBytes failed:", fallbackError);
                reject(fallbackError);
              }
            } else {
              reject(error);
            }
          }, 
          async () => {
            clearTimeout(timeout);
            console.log("Upload task completed successfully. Fetching download URL...");
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log("Download URL obtained:", downloadURL);
              resolve(downloadURL);
            } catch (urlError) {
              console.error("Failed to get download URL:", urlError);
              reject(urlError);
            }
          }
        );
      });
    } catch (e) {
      console.error("Error in uploadImage wrapper:", e);
      throw e;
    }
  },

  init: async () => {
    try {
      // Test connection
      try {
        await getDocFromServer(doc(db, 'settings', 'global'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }

      // Ensure Auth exists in localStorage for the "old way"
      const AUTH_KEY = 'aa_auth_data';
      if (!localStorage.getItem(AUTH_KEY)) {
        const defaultAuth = {
          passwordHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', // admin123
          securityPhraseHash: '', // Empty initially
        };
        localStorage.setItem(AUTH_KEY, JSON.stringify(defaultAuth));
      }

      const settingsDoc = await getDoc(doc(db, 'settings', 'global'));
      
      if (!settingsDoc.exists()) {
        console.log('Seeding Content to Firestore...');
        
        const seedCollection = async (colName: string, data: any[]) => {
          for (const item of data) {
            const { id, ...rest } = item;
            if (id) {
              await setDoc(doc(db, colName, id), rest);
            } else {
              await addDoc(collection(db, colName), rest);
            }
          }
        };

        await seedCollection('programs', SEED_PROGRAMS);
        await seedCollection('coaches', SEED_COACHES);
        await seedCollection('blogs', SEED_BLOGS);
        await seedCollection('offers', SEED_OFFERS);
        await seedCollection('testimonials', SEED_TESTIMONIALS);
        await seedCollection('memberships', SEED_MEMBERSHIPS);
        await seedCollection('free_resources', SEED_FREE_RESOURCES);
        await seedCollection('legal_pages', SEED_LEGAL_PAGES);
        await seedCollection('counseling', SEED_COUNSELING);
        
        await setDoc(doc(db, 'settings', 'global'), SEED_SETTINGS);
      }
    } catch (e) {
      console.error("Failed to initialize storage.", e);
    }
  },

  // Subscriptions for real-time updates
  subscribePrograms: (callback: (items: Program[]) => void) => {
    return onSnapshot(collection(db, 'programs'), (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Program)));
    }, (e) => handleFirestoreError(e, OperationType.GET, 'programs'));
  },

  subscribeCoaches: (callback: (items: Coach[]) => void) => {
    return onSnapshot(collection(db, 'coaches'), (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Coach)));
    }, (e) => handleFirestoreError(e, OperationType.GET, 'coaches'));
  },

  subscribeBlogs: (callback: (items: BlogPost[]) => void) => {
    return onSnapshot(query(collection(db, 'blogs'), orderBy('date', 'desc')), (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost)));
    }, (e) => handleFirestoreError(e, OperationType.GET, 'blogs'));
  },

  subscribeOffers: (callback: (items: Offer[]) => void) => {
    return onSnapshot(collection(db, 'offers'), (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Offer)));
    }, (e) => handleFirestoreError(e, OperationType.GET, 'offers'));
  },

  subscribeTestimonials: (callback: (items: Testimonial[]) => void) => {
    return onSnapshot(collection(db, 'testimonials'), (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial)));
    }, (e) => handleFirestoreError(e, OperationType.GET, 'testimonials'));
  },

  subscribeLegalPages: (callback: (items: LegalPage[]) => void) => {
    return onSnapshot(collection(db, 'legal_pages'), (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LegalPage)));
    }, (e) => handleFirestoreError(e, OperationType.GET, 'legal_pages'));
  },

  subscribeCounseling: (callback: (items: CounselingService[]) => void) => {
    return onSnapshot(collection(db, 'counseling'), (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CounselingService)));
    }, (e) => handleFirestoreError(e, OperationType.GET, 'counseling'));
  },

  subscribeLeads: (callback: (items: Lead[]) => void) => {
    return onSnapshot(query(collection(db, 'leads'), orderBy('date', 'desc')), (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead)));
    }, (e) => handleFirestoreError(e, OperationType.GET, 'leads'));
  },

  subscribePlanInquiries: (callback: (items: PlanInquiry[]) => void) => {
    return onSnapshot(query(collection(db, 'plan_inquiries'), orderBy('date', 'desc')), (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PlanInquiry)));
    }, (e) => handleFirestoreError(e, OperationType.GET, 'plan_inquiries'));
  },

  subscribeFreeResources: (callback: (items: FreeResource[]) => void) => {
    return onSnapshot(collection(db, 'free_resources'), (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FreeResource)));
    }, (e) => handleFirestoreError(e, OperationType.GET, 'free_resources'));
  },

  subscribeSettings: (callback: (settings: SiteSettings) => void) => {
    return onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as SiteSettings);
      }
    }, (e) => handleFirestoreError(e, OperationType.GET, 'settings/global'));
  },

  getPrograms: async (): Promise<Program[]> => {
    try {
      const snapshot = await getDocs(collection(db, 'programs'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Program));
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, 'programs');
      return [];
    }
  },
  saveProgram: async (item: Program) => {
    try {
      const { id, ...data } = item;
      // If it's a temp ID from UI (13 digits), let Firestore generate a real one
      if (id && /^\d{13}$/.test(id)) {
        await addDoc(collection(db, 'programs'), data);
      } else if (id) {
        await setDoc(doc(db, 'programs', id), data);
      } else {
        await addDoc(collection(db, 'programs'), data);
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'programs');
    }
  },
  updateProgram: async (item: Program) => {
    try {
      const { id, ...data } = item;
      if (!id) throw new Error('Program ID is required for update');
      await setDoc(doc(db, 'programs', id), data);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'programs');
    }
  },
  deleteProgram: async (id: string) => {
    try {
      await deleteDoc(doc(db, 'programs', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, 'programs');
    }
  },

  getCoaches: async (): Promise<Coach[]> => {
    try {
      const snapshot = await getDocs(collection(db, 'coaches'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Coach));
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, 'coaches');
      return [];
    }
  },
  saveCoach: async (item: Coach) => {
    try {
      const { id, ...data } = item;
      if (id && /^\d{13}$/.test(id)) {
        await addDoc(collection(db, 'coaches'), data);
      } else if (id) {
        await setDoc(doc(db, 'coaches', id), data);
      } else {
        await addDoc(collection(db, 'coaches'), data);
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'coaches');
    }
  },
  updateCoach: async (item: Coach) => {
    try {
      const { id, ...data } = item;
      if (!id) throw new Error('Coach ID is required for update');
      await setDoc(doc(db, 'coaches', id), data);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'coaches');
    }
  },
  deleteCoach: async (id: string) => {
    try {
      await deleteDoc(doc(db, 'coaches', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, 'coaches');
    }
  },

  getBlogs: async (): Promise<BlogPost[]> => {
    try {
      const snapshot = await getDocs(query(collection(db, 'blogs'), orderBy('date', 'desc')));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, 'blogs');
      return [];
    }
  },
  saveBlog: async (item: BlogPost) => {
    try {
      const { id, ...data } = item;
      if (id && /^\d{13}$/.test(id)) {
        await addDoc(collection(db, 'blogs'), data);
      } else if (id) {
        await setDoc(doc(db, 'blogs', id), data);
      } else {
        await addDoc(collection(db, 'blogs'), data);
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'blogs');
    }
  },
  updateBlog: async (item: BlogPost) => {
    try {
      const { id, ...data } = item;
      if (!id) throw new Error('Blog ID is required for update');
      await setDoc(doc(db, 'blogs', id), data);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'blogs');
    }
  },
  deleteBlog: async (id: string) => {
    try {
      await deleteDoc(doc(db, 'blogs', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, 'blogs');
    }
  },

  getOffers: async (): Promise<Offer[]> => {
    try {
      const snapshot = await getDocs(collection(db, 'offers'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Offer));
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, 'offers');
      return [];
    }
  },
  saveOffer: async (item: Offer) => {
    try {
      const { id, ...data } = item;
      if (id && /^\d{13}$/.test(id)) {
        await addDoc(collection(db, 'offers'), data);
      } else if (id) {
        await setDoc(doc(db, 'offers', id), data);
      } else {
        await addDoc(collection(db, 'offers'), data);
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'offers');
    }
  },
  updateOffer: async (item: Offer) => {
    try {
      const { id, ...data } = item;
      if (!id) throw new Error('Offer ID is required for update');
      await setDoc(doc(db, 'offers', id), data);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'offers');
    }
  },
  deleteOffer: async (id: string) => {
    try {
      await deleteDoc(doc(db, 'offers', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, 'offers');
    }
  },

  getTestimonials: async (): Promise<Testimonial[]> => {
    try {
      const snapshot = await getDocs(collection(db, 'testimonials'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, 'testimonials');
      return [];
    }
  },
  saveTestimonial: async (item: Testimonial) => {
    try {
      const { id, ...data } = item;
      if (id && /^\d{13}$/.test(id)) {
        await addDoc(collection(db, 'testimonials'), data);
      } else if (id) {
        await setDoc(doc(db, 'testimonials', id), data);
      } else {
        await addDoc(collection(db, 'testimonials'), data);
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'testimonials');
    }
  },
  updateTestimonial: async (item: Testimonial) => {
    try {
      const { id, ...data } = item;
      if (!id) throw new Error('Testimonial ID is required for update');
      await setDoc(doc(db, 'testimonials', id), data);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'testimonials');
    }
  },
  deleteTestimonial: async (id: string) => {
    try {
      await deleteDoc(doc(db, 'testimonials', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, 'testimonials');
    }
  },

  getMemberships: async (): Promise<MembershipTier[]> => {
    try {
      const snapshot = await getDocs(collection(db, 'memberships'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MembershipTier));
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, 'memberships');
      return [];
    }
  },
  saveMembership: async (item: MembershipTier) => {
    try {
      const { id, ...data } = item;
      if (id && /^\d{13}$/.test(id)) {
        await addDoc(collection(db, 'memberships'), data);
      } else if (id) {
        await setDoc(doc(db, 'memberships', id), data);
      } else {
        await addDoc(collection(db, 'memberships'), data);
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'memberships');
    }
  },
  updateMembership: async (item: MembershipTier) => {
    try {
      const { id, ...data } = item;
      if (!id) throw new Error('Membership ID is required for update');
      await setDoc(doc(db, 'memberships', id), data);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'memberships');
    }
  },
  deleteMembership: async (id: string) => {
    try {
      await deleteDoc(doc(db, 'memberships', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, 'memberships');
    }
  },

  getLeads: async (): Promise<Lead[]> => {
    try {
      const snapshot = await getDocs(query(collection(db, 'leads'), orderBy('date', 'desc')));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead));
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, 'leads');
      return [];
    }
  },
  addLead: async (item: Lead) => {
    try {
      const data = { ...item };
      delete (data as any).id;
      await addDoc(collection(db, 'leads'), { ...data, date: new Date().toISOString() });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'leads');
    }
  },
  deleteLead: async (id: string) => {
    try {
      await deleteDoc(doc(db, 'leads', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, 'leads');
    }
  },

  getPlanInquiries: async (): Promise<PlanInquiry[]> => {
    try {
      const snapshot = await getDocs(query(collection(db, 'plan_inquiries'), orderBy('date', 'desc')));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PlanInquiry));
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, 'plan_inquiries');
      return [];
    }
  },
  addPlanInquiry: async (item: PlanInquiry) => {
    try {
      const data = { ...item };
      delete (data as any).id;
      await addDoc(collection(db, 'plan_inquiries'), { ...data, date: new Date().toISOString() });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'plan_inquiries');
    }
  },
  deletePlanInquiry: async (id: string) => {
    try {
      await deleteDoc(doc(db, 'plan_inquiries', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, 'plan_inquiries');
    }
  },

  getFreeResources: async (): Promise<FreeResource[]> => {
    try {
      const snapshot = await getDocs(collection(db, 'free_resources'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FreeResource));
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, 'free_resources');
      return [];
    }
  },
  saveFreeResource: async (item: FreeResource) => {
    try {
      const { id, ...data } = item;
      if (id && /^\d{13}$/.test(id)) {
        await addDoc(collection(db, 'free_resources'), data);
      } else if (id) {
        await setDoc(doc(db, 'free_resources', id), data);
      } else {
        await addDoc(collection(db, 'free_resources'), data);
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'free_resources');
    }
  },
  updateFreeResource: async (item: FreeResource) => {
    try {
      const { id, ...data } = item;
      if (!id) throw new Error('Resource ID is required for update');
      await setDoc(doc(db, 'free_resources', id), data);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'free_resources');
    }
  },
  deleteFreeResource: async (id: string) => {
    try {
      await deleteDoc(doc(db, 'free_resources', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, 'free_resources');
    }
  },

  getLegalPages: async (): Promise<LegalPage[]> => {
    try {
      const snapshot = await getDocs(collection(db, 'legal_pages'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LegalPage));
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, 'legal_pages');
      return [];
    }
  },
  saveLegalPage: async (item: LegalPage) => {
    try {
      const { id, ...data } = item;
      if (id && /^\d{13}$/.test(id)) {
        await addDoc(collection(db, 'legal_pages'), data);
      } else if (id) {
        await setDoc(doc(db, 'legal_pages', id), data);
      } else {
        await addDoc(collection(db, 'legal_pages'), data);
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'legal_pages');
    }
  },
  updateLegalPage: async (item: LegalPage) => {
    try {
      const { id, ...data } = item;
      if (!id) throw new Error('Legal page ID is required for update');
      await setDoc(doc(db, 'legal_pages', id), data);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'legal_pages');
    }
  },
  deleteLegalPage: async (id: string) => {
    try {
      await deleteDoc(doc(db, 'legal_pages', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, 'legal_pages');
    }
  },

  getCounselingServices: async (): Promise<CounselingService[]> => {
    try {
      const snapshot = await getDocs(collection(db, 'counseling'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CounselingService));
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, 'counseling');
      return [];
    }
  },
  saveCounselingService: async (item: CounselingService) => {
    try {
      const { id, ...data } = item;
      if (id && /^\d{13}$/.test(id)) {
        await addDoc(collection(db, 'counseling'), data);
      } else if (id) {
        await setDoc(doc(db, 'counseling', id), data);
      } else {
        await addDoc(collection(db, 'counseling'), data);
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'counseling');
    }
  },
  updateCounselingService: async (item: CounselingService) => {
    try {
      const { id, ...data } = item;
      if (!id) throw new Error('Counseling service ID is required for update');
      await setDoc(doc(db, 'counseling', id), data);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'counseling');
    }
  },
  deleteCounselingService: async (id: string) => {
    try {
      await deleteDoc(doc(db, 'counseling', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, 'counseling');
    }
  },

  getSettings: async (): Promise<SiteSettings> => {
    try {
      const docRef = doc(db, 'settings', 'global');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as SiteSettings;
      }
      return SEED_SETTINGS;
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, 'settings/global');
      return SEED_SETTINGS;
    }
  },
  saveSettings: async (settings: SiteSettings) => {
    try {
      await setDoc(doc(db, 'settings', 'global'), settings);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'settings/global');
    }
  },
  updateSettings: async (settings: SiteSettings) => {
    return StorageService.saveSettings(settings);
  },

  // Auth - "Old way" using local storage and hashing
  verifyPassword: async (input: string): Promise<boolean> => {
    const stored = localStorage.getItem('aa_auth_data');
    if (!stored) return false;
    const authData = JSON.parse(stored);
    const inputHash = await sha256(input);
    return inputHash === authData.passwordHash;
  },
  
  verifySecurityPhrase: async (input: string): Promise<boolean> => {
    const stored = localStorage.getItem('aa_auth_data');
    if (!stored) return false;
    const authData = JSON.parse(stored);
    if (!authData.securityPhraseHash) return false;
    const inputHash = await sha256(input.trim().toLowerCase());
    return inputHash === authData.securityPhraseHash;
  },

  updatePassword: async (newPass: string) => {
    const stored = localStorage.getItem('aa_auth_data');
    const authData = stored ? JSON.parse(stored) : { passwordHash: '', securityPhraseHash: '' };
    authData.passwordHash = await sha256(newPass);
    localStorage.setItem('aa_auth_data', JSON.stringify(authData));
  },

  setSecurityPhrase: async (phrase: string) => {
    const stored = localStorage.getItem('aa_auth_data');
    const authData = stored ? JSON.parse(stored) : { passwordHash: '', securityPhraseHash: '' };
    authData.securityPhraseHash = await sha256(phrase.trim().toLowerCase());
    localStorage.setItem('aa_auth_data', JSON.stringify(authData));
  },

  seedData: async () => {
    try {
      // Seed Settings
      await setDoc(doc(db, 'settings', 'global'), SEED_SETTINGS);
      
      // Seed Collections
      const seedCollection = async (collName: string, data: any[]) => {
        for (const item of data) {
          const { id, ...rest } = item;
          await setDoc(doc(db, collName, id), rest);
        }
      };

      await seedCollection('programs', SEED_PROGRAMS);
      await seedCollection('coaches', SEED_COACHES);
      await seedCollection('blogs', SEED_BLOGS);
      await seedCollection('offers', SEED_OFFERS);
      await seedCollection('testimonials', SEED_TESTIMONIALS);
      await seedCollection('memberships', SEED_MEMBERSHIPS);
      await seedCollection('free_resources', SEED_FREE_RESOURCES);
      await seedCollection('counseling', SEED_COUNSELING);
      await seedCollection('legal_pages', SEED_LEGAL_PAGES);

      return true;
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'multiple collections');
      return false;
    }
  }
};
