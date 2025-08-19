module.exports = {

"[project]/.next-internal/server/app/api/user/current/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/@opentelemetry/api [external] (@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("@opentelemetry/api", () => require("@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/firebase-admin [external] (firebase-admin, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("firebase-admin", () => require("firebase-admin"));

module.exports = mod;
}}),
"[externals]/fs [external] (fs, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}}),
"[externals]/path [external] (path, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}}),
"[project]/firebase/admin.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "auth": (()=>auth),
    "db": (()=>db),
    "storage": (()=>storage)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/firebase-admin [external] (firebase-admin, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
;
let app;
if (!__TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["default"].apps.length) {
    try {
        // Check for different ways to configure Firebase Admin
        let credential;
        let storageBucket;
        // Method 1: Use GOOGLE_APPLICATION_CREDENTIALS environment variable
        if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            console.log(`[Firebase Admin] Using service account from GOOGLE_APPLICATION_CREDENTIALS`);
            const serviceAccountPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS);
            const serviceAccountContent = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(serviceAccountPath, 'utf8');
            const serviceAccount = JSON.parse(serviceAccountContent);
            credential = __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["default"].credential.cert(serviceAccount);
            // Try multiple bucket naming conventions
            const possibleBuckets = [
                process.env.FIREBASE_STORAGE_BUCKET,
                `${serviceAccount.project_id}.appspot.com`,
                `${serviceAccount.project_id}.firebasestorage.app`,
                serviceAccount.project_id
            ].filter(Boolean);
            storageBucket = possibleBuckets[0];
        } else {
            console.log(`[Firebase Admin] Using fallback service account file`);
            const serviceAccountPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "ai-interview-prep-36e64-firebase-adminsdk-fbsvc-1400160581.json");
            const serviceAccountContent = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(serviceAccountPath, 'utf8');
            const serviceAccount = JSON.parse(serviceAccountContent);
            credential = __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["default"].credential.cert(serviceAccount);
            // Try multiple bucket naming conventions
            const possibleBuckets = [
                process.env.FIREBASE_STORAGE_BUCKET,
                `${serviceAccount.project_id}.appspot.com`,
                `${serviceAccount.project_id}.firebasestorage.app`,
                serviceAccount.project_id
            ].filter(Boolean);
            storageBucket = possibleBuckets[0];
        }
        // Initialize the app
        app = __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["default"].initializeApp({
            credential: credential,
            storageBucket: storageBucket,
            projectId: process.env.FIREBASE_PROJECT_ID || 'ai-interview-prep-36e64'
        });
        console.log(`[Firebase Admin] SDK initialized successfully. Project: ${app.options.projectId}, Storage bucket: ${storageBucket}`);
        // Test the connection
        try {
            const bucket = app.storage().bucket();
            console.log(`[Firebase Admin] Storage bucket confirmed: ${bucket.name}`);
        } catch (bucketError) {
            console.error(`[Firebase Admin] Storage bucket verification failed:`, bucketError);
        }
    } catch (error) {
        console.error("[Firebase Admin] SDK initialization failed:", error);
        throw new Error(`Failed to initialize Firebase Admin SDK: ${error.message}`);
    }
} else {
    app = __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["default"].app();
    console.log("[Firebase Admin] Using existing app instance.");
}
const auth = __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["default"].auth(app);
const db = __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["default"].firestore(app);
const storage = __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["default"].storage(app);
}}),
"[project]/lib/actions/auth.actions.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ [{"00263f5e21e85f0ca380a5e51ff6da4b39f81c5d6e":"signOut","00b5f3e109327d28000c9bf356bb2be7a33dfa50ee":"getCurrentUser","00ff6b4f56f1b102b7be818d18be36f95856aa4d63":"isAuthenticated","403ecab76148372f632f479de439274c3d1a43a758":"setSessionCookie","40b3b0ec3737f18a8c70016760fd96a1209ed4f61d":"signIn","40cc20103ed515955b0d0ed96906ceeea87d72531b":"signUp"},"",""] */ __turbopack_context__.s({
    "getCurrentUser": (()=>getCurrentUser),
    "isAuthenticated": (()=>isAuthenticated),
    "setSessionCookie": (()=>setSessionCookie),
    "signIn": (()=>signIn),
    "signOut": (()=>signOut),
    "signUp": (()=>signUp)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$firebase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/firebase/admin.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-route] (ecmascript)");
;
;
;
;
// Session duration (1 week)
const SESSION_DURATION = 60 * 60 * 24 * 7;
async function setSessionCookie(idToken) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$firebase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["auth"]) {
        console.error("Error setting session cookie: Firebase Admin SDK not initialized.");
        return false;
    }
    try {
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
        console.log("Creating session cookie from idToken (first 10 chars):", idToken.substring(0, 10) + "...");
        // Verify the ID token first
        try {
            const decodedToken = await __TURBOPACK__imported__module__$5b$project$5d2f$firebase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["auth"].verifyIdToken(idToken);
            console.log("ID token verified. User UID:", decodedToken.uid);
            console.log("ID token audience:", decodedToken.aud);
            console.log("ID token issuer:", decodedToken.iss);
        } catch (verifyError) {
            console.error("Error verifying ID token:", verifyError);
            return false;
        }
        // Create session cookie
        const sessionCookie = await __TURBOPACK__imported__module__$5b$project$5d2f$firebase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["auth"].createSessionCookie(idToken, {
            expiresIn: SESSION_DURATION * 1000
        });
        console.log("Session cookie created successfully");
        // Set cookie in the browser
        cookieStore.set("session", sessionCookie, {
            maxAge: SESSION_DURATION,
            httpOnly: true,
            secure: ("TURBOPACK compile-time value", "development") === "production",
            path: "/",
            sameSite: "lax"
        });
        return true;
    } catch (error) {
        console.error("Error setting session cookie:", error);
        return false;
    }
}
async function signUp(params) {
    const { uid, name, email, password } = params;
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$firebase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"]) {
        console.error("Sign-up error: Firebase Admin SDK (Firestore) not initialized.");
        return {
            success: false,
            message: "Server database error. Please try again later."
        };
    }
    try {
        // check if user exists in db
        const userRecord = await __TURBOPACK__imported__module__$5b$project$5d2f$firebase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection("users").doc(uid).get();
        if (userRecord.exists) return {
            success: false,
            message: "User already exists. Please sign in."
        };
        // save user to db
        await __TURBOPACK__imported__module__$5b$project$5d2f$firebase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection("users").doc(uid).set({
            name,
            email
        });
        // Get the ID token to set session cookie
        // Note: password is not needed here as auth is already handled by Firebase client
        // but we keep it in the params to match the interface
        return {
            success: true,
            message: "Account created successfully. Please sign in."
        };
    } catch (error) {
        console.error("Error creating user", error);
        // Handle Firebase specific errors
        if (error.code === "auth/email-already-exists") {
            return {
                success: false,
                message: "This email is already in use"
            };
        } else if (error.code === "auth/invalid-email") {
            return {
                success: false,
                message: "The email address is not valid"
            };
        } else if (error.code === "auth/operation-not-allowed") {
            return {
                success: false,
                message: "Email/password accounts are not enabled"
            };
        } else if (error.code === "auth/uid-already-exists") {
            return {
                success: false,
                message: "The provided user ID is already in use"
            };
        }
        return {
            success: false,
            message: "Failed to create account. Please try again."
        };
    }
}
async function signIn(params) {
    const { email, idToken } = params;
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$firebase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["auth"]) {
        console.error("Sign-in error: Firebase Admin SDK not initialized.");
        return {
            success: false,
            message: "Server authentication error. Please try again later."
        };
    }
    try {
        if (!idToken) {
            console.error("Sign-in error: No ID token provided");
            return {
                success: false,
                message: "Authentication failed. Please try again."
            };
        }
        console.log("Verifying user email:", email);
        const userRecord = await __TURBOPACK__imported__module__$5b$project$5d2f$firebase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["auth"].getUserByEmail(email);
        if (!userRecord) {
            console.error("Sign-in error: User not found for email:", email);
            return {
                success: false,
                message: "User does not exist. Create an account."
            };
        }
        // Clear any existing session cookies first
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
        cookieStore.delete("session");
        console.log("Cleared existing session cookies");
        console.log("Setting session cookie for user:", userRecord.uid);
        const cookieSet = await setSessionCookie(idToken);
        if (!cookieSet) {
            console.error("Failed to set session cookie");
            return {
                success: false,
                message: "Failed to create session. Please try again."
            };
        }
        console.log("Sign-in successful for user:", userRecord.uid);
        return {
            success: true,
            message: "Signed in successfully."
        };
    } catch (error) {
        console.error("Sign-in error:", error);
        // Handle specific Firebase auth error codes
        if (error.code === "auth/user-not-found") {
            return {
                success: false,
                message: "User not found. Please create an account."
            };
        } else if (error.code === "auth/invalid-credential") {
            return {
                success: false,
                message: "Invalid credentials. Please try again."
            };
        } else if (error.code === "auth/id-token-expired") {
            return {
                success: false,
                message: "Your session has expired. Please sign in again."
            };
        } else if (error.code === "auth/id-token-revoked") {
            return {
                success: false,
                message: "Your session has been revoked. Please sign in again."
            };
        } else if (error.code === "auth/invalid-id-token") {
            return {
                success: false,
                message: "Invalid authentication token. Please try again."
            };
        }
        return {
            success: false,
            message: "Failed to log into account. Please try again."
        };
    }
}
async function signOut() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.delete("session");
}
async function getCurrentUser() {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$firebase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["auth"] || !__TURBOPACK__imported__module__$5b$project$5d2f$firebase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"]) {
        console.error("[getCurrentUser] Error: Firebase Admin SDK (Auth or Firestore) not initialized.");
        return null;
    }
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    const sessionCookie = cookieStore.get('session')?.value;
    console.log("[getCurrentUser] Attempting to get session cookie. Value:", sessionCookie ? "Exists" : "Not Found");
    if (!sessionCookie) {
        console.log("[getCurrentUser] No session cookie found.");
        return null;
    }
    try {
        console.log("[getCurrentUser] Verifying session cookie...");
        // Get project ID safely
        let projectId = "unknown";
        try {
            projectId = __TURBOPACK__imported__module__$5b$project$5d2f$firebase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["auth"].app.options?.projectId || "unknown";
        } catch (e) {
            console.log("[getCurrentUser] Could not access project ID:", e);
        }
        console.log("[getCurrentUser] Auth project ID:", projectId);
        try {
            // First try to decode the session cookie without verification to see what's in it
            const parts = sessionCookie.split('.');
            if (parts.length === 3) {
                const decoded = JSON.parse(Buffer.from(parts[1], 'base64').toString());
                console.log("[getCurrentUser] Session cookie audience:", decoded.aud);
                console.log("[getCurrentUser] Session cookie issuer:", decoded.iss);
            }
        } catch (decodeError) {
            console.log("[getCurrentUser] Could not decode session cookie:", decodeError);
        }
        const decodedClaims = await __TURBOPACK__imported__module__$5b$project$5d2f$firebase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["auth"].verifySessionCookie(sessionCookie, true); // true checks for revocation
        console.log("[getCurrentUser] Session cookie verified. UID:", decodedClaims.uid);
        // get user info from db
        const userRecord = await __TURBOPACK__imported__module__$5b$project$5d2f$firebase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection("users").doc(decodedClaims.uid).get();
        if (!userRecord.exists) {
            console.log("[getCurrentUser] User not found in Firestore DB for UID:", decodedClaims.uid);
            return null;
        }
        console.log("[getCurrentUser] User found in Firestore DB. Email:", userRecord.data()?.email);
        return {
            ...userRecord.data(),
            id: userRecord.id
        };
    } catch (error) {
        console.error("[getCurrentUser] Error verifying session cookie or fetching user:", error instanceof Error ? error.message : String(error));
        if (typeof error === 'object' && error !== null && 'code' in error) {
            console.error("[getCurrentUser] Error code:", error.code);
        }
        // Invalid or expired session
        return null;
    }
}
async function isAuthenticated() {
    console.log("[isAuthenticated] Checking authentication status...");
    const user = await getCurrentUser();
    console.log("[isAuthenticated] User object:", user ? `Exists (ID: ${user.id})` : "null");
    return !!user;
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    setSessionCookie,
    signUp,
    signIn,
    signOut,
    getCurrentUser,
    isAuthenticated
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["registerServerReference"])(setSessionCookie, "403ecab76148372f632f479de439274c3d1a43a758", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["registerServerReference"])(signUp, "40cc20103ed515955b0d0ed96906ceeea87d72531b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["registerServerReference"])(signIn, "40b3b0ec3737f18a8c70016760fd96a1209ed4f61d", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["registerServerReference"])(signOut, "00263f5e21e85f0ca380a5e51ff6da4b39f81c5d6e", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["registerServerReference"])(getCurrentUser, "00b5f3e109327d28000c9bf356bb2be7a33dfa50ee", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["registerServerReference"])(isAuthenticated, "00ff6b4f56f1b102b7be818d18be36f95856aa4d63", null);
}}),
"[project]/app/api/user/current/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "GET": (()=>GET)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$auth$2e$actions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/actions/auth.actions.ts [app-route] (ecmascript)");
;
;
async function GET(request) {
    try {
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$auth$2e$actions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentUser"])();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            user: user || null
        });
    } catch (error) {
        console.error('Error getting current user:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to get user',
            user: null
        }, {
            status: 500
        });
    }
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__80864a7d._.js.map