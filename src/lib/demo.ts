import { User } from '@supabase/supabase-js';

// Demo user ID from environment variables
export const DEMO_USER_ID = import.meta.env.VITE_DEMO_USER_ID as string;

/**
 * Check if the given user is the demo user
 * @param user Supabase user object or null
 * @returns boolean indicating if the user is the demo user
 */
export function isDemoUser(user: User | null): boolean {
    return user?.id === DEMO_USER_ID;
}

/**
 * Check if the current context is for demo data
 * @param userId User ID to check
 * @returns boolean indicating if the data is for demo
 */
export function isDemoData(userId: string | undefined): boolean {
    return userId === DEMO_USER_ID;
}

/**
 * Determine if the current user can edit data
 * @param user Supabase user object or null
 * @param dataUserId User ID of the data being accessed
 * @returns boolean indicating if editing is allowed
 */
export function canEditData(user: User | null, dataUserId?: string): boolean {
    // Allow editing if:
    // 1. User is logged in
    // 2. User is the demo user
    // 3. Data belongs to the user
    return !!user && (isDemoUser(user) || user.id === dataUserId);
}

/**
 * Get a display label for demo mode
 * @returns string indicating demo mode
 */
export function getDemoModeLabel(): string {
    return 'デモモード: 閲覧専用';
}
