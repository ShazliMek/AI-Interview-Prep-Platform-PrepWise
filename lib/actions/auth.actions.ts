'use server';
import { db } from '@/firebase/admin';
import {auth} from '@/firebase/admin';
import { cookies } from 'next/headers';


export async function signUp(params: SignUpParams){
    const {uid, name, email} = params;

    try{
        const userRecord = await db.collection('users').doc(uid).get();

        if(userRecord.exists) {
            return {
                success: false,
                message: 'User already exists. Please sign in instead.'
            };
        }
        await db.collection('users').doc(uid).set({
            name,
            email
        });

        return{
            success: true,
            message: 'Account created successfully. Please sign in.',
        }
    } catch (e: any) {
        console.error('Error signing up:', e);
        
        if(e.code === 'auth/email-already-exists') {
            return{
                success: false,
                message: 'This email is already registered. Please sign in instead.'
            }
    }
        return {
            success: false,
            message: 'Failed to create an account.'
}
}
}

export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: 60 * 60 * 24 * 7 * 1000, // 7 days
    });
    
    cookieStore.set('session', sessionCookie, {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
    });
}

export async function signIn(params: SignInParams){
    const { email, idToken } = params;

    try {
        const userRecord = await auth.getUserByEmail(email)

        if(!userRecord) {
            return {
                success: false,
                message: 'User not found. Please CREATE AN ACCOUNT.'
            };
        }

        await setSessionCookie(idToken);
    } catch (e){
        console.error(e);
    }
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
        return null;
    }

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        const userRecord = await db.collection('users').doc(decodedClaims.uid).get();

        if( !userRecord.exists) {
            return null;
        }

        return {
            ...userRecord.data(),
            id: userRecord.id,
        } as User;
    } catch (e) {
        console.log(e);
        return null;
    }
}

export async function isAuthenticated() {
    const user = await getCurrentUser();

    return !!user;
}