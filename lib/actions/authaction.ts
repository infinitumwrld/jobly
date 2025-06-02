"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";
import { cache } from 'react';

const ONE_WEEK = 60 * 60 * 24 * 7;
const SESSION_CACHE_TIME = 5 * 60 * 1000; // 5 minutes

// Secure cache implementation
class SecureCache {
    private static cache = new Map<string, { 
        data: any; 
        timestamp: number;
    }>();

    static set(key: string, data: any) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    static get(key: string) {
        const entry = this.cache.get(key);
        if (!entry) return null;

        // Check if entry has expired
        if (Date.now() - entry.timestamp > SESSION_CACHE_TIME) {
            this.cache.delete(key);
            return null;
        }

        return entry.data;
    }

    static clear(key: string) {
        this.cache.delete(key);
    }

    // Clear expired entries
    static cleanup() {
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.timestamp > SESSION_CACHE_TIME) {
                this.cache.delete(key);
            }
        }
    }
}

// Run cache cleanup every minute
if (typeof setInterval !== 'undefined') {
    setInterval(() => SecureCache.cleanup(), 60 * 1000);
}

// Cached version of getCurrentUser
export const getCurrentUser = cache(async (): Promise<User | null> => {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) return null;

    try {
        // Always verify session first
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        const uid = decodedClaims.uid;

        // Check cache first
        const cachedUser = SecureCache.get(uid);
        if (cachedUser) {
            return {
                ...cachedUser,
                id: uid,
            } as User;
        }

        // If not in cache or expired, fetch from Firestore
        const userRecord = await db.collection('users').doc(uid).get();

        if (!userRecord.exists) {
            SecureCache.clear(uid);
            return null;
        }

        // Update cache
        const userData = userRecord.data();
        SecureCache.set(uid, userData);

        return {
            ...userData,
            id: uid,
        } as User;

    } catch (e) {
        console.error('Session verification failed:', e);
        return null;
    }
});

export async function signUp(params: SignUpParams) {
    const { uid, name, email } = params;

    try {
        const userRef = db.collection('users').doc(uid);
        
        return await db.runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userRef);
            
            if (userDoc.exists) {
                return { 
                    success: false,
                    message: 'User already exists. Please sign in instead.'
                };
            }

            transaction.set(userRef, { 
                name, 
                email,
                createdAt: new Date().toISOString()
            });
            
            return {
                success: true,
                message: 'Account created successfully. Please sign in.'
            };
        });

    } catch (e: any) {
        console.error('Error creating user:', e);
        SecureCache.clear(uid);

        if (e.code === 'auth/email-already-exists') {
            return {
                success: false,
                message: 'This email is already in use. Please sign in instead.'
            };
        }

        return {
            success: false,
            message: 'Failed to create an account. Please try again.'
        };
    }
}

export async function signIn(params: SignInParams) {
    const { email, idToken } = params;
    try {
        const userRecord = await auth.getUserByEmail(email);
       
        if (!userRecord) {
            return {
                success: false,
                message: 'User does not exist. Please create an account first.'
            };
        }

        await setSessionCookie(idToken);
        
        // Clear any existing cache for this user
        SecureCache.clear(userRecord.uid);

        return {
            success: true,
            message: 'Signed in successfully'
        };

    } catch (e) {
        console.error('Sign in error:', e);
        return {
            success: false,
            message: 'Failed to log in. Please try again.'
        };
    }
}

export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();

    const sessionCookies = await auth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEK * 1000,
    });

    cookieStore.set('session', sessionCookies, {
        maxAge: ONE_WEEK * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax'
    });
}

// Cached version of isAuthenticated
export const isAuthenticated = cache(async () => {
    const user = await getCurrentUser();
    return !!user;
});

