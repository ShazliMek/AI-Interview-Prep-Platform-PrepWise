module.exports = {

"[project]/.next-internal/server/app/api/user/recordings/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

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
"[externals]/crypto [external] (crypto, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}}),
"[project]/lib/services/voiceDataService.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// Voice data storage and encryption service
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "voiceDataService": (()=>voiceDataService)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$firebase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/firebase/admin.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
;
;
// Constants
const RECORDING_EXPIRY_DAYS = 30;
const COLLECTION_RECORDINGS = 'voice_recordings';
const COLLECTION_ANALYSES = 'voice_analyses';
const COLLECTION_ENCRYPTION_KEYS = 'encryption_keys';
const LOCAL_STORAGE_PATH = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"])(process.cwd(), 'temp', 'encrypted-recordings');
const voiceDataService = {
    /**
   * Store an encrypted voice recording
   */ async storeVoiceRecording (userId, interviewId, recordingBuffer, metadata) {
        try {
            // 1. Generate a new encryption key for this recording
            const { keyId, encryptedData } = await encryptBuffer(recordingBuffer);
            // 2. Generate a unique filename
            const filename = `voice-recordings/${userId}/${interviewId}/${(0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomUUID"])()}.enc`;
            // 3. Upload encrypted data to Firebase Storage (with fallback to local storage)
            let fileUrl;
            let isLocalStorage = false;
            try {
                const fileRef = __TURBOPACK__imported__module__$5b$project$5d2f$firebase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storage"].bucket().file(filename);
                await fileRef.save(encryptedData, {
                    metadata: {
                        contentType: 'application/octet-stream',
                        metadata: {
                            encryptionKeyId: keyId,
                            originalContentType: metadata.mimeType
                        }
                    }
                });
                // Get signed URL (7 day expiry, for internal use only)
                const [url] = await fileRef.getSignedUrl({
                    action: 'read',
                    expires: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
                });
                fileUrl = filename; // Store the path, not the signed URL
            } catch (storageError) {
                console.warn('Firebase Storage failed, using local storage fallback:', storageError);
                // Fallback to local file system
                if (!(0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"])(LOCAL_STORAGE_PATH)) {
                    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["mkdirSync"])(LOCAL_STORAGE_PATH, {
                        recursive: true
                    });
                }
                const localFilename = `${(0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomUUID"])()}.enc`;
                const localPath = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"])(LOCAL_STORAGE_PATH, localFilename);
                (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["writeFileSync"])(localPath, encryptedData);
                fileUrl = `local://${localFilename}`;
                isLocalStorage = true;
            }
            // 4. Calculate expiry date (30 days from now)
            const now = new Date();
            const expiresAt = new Date(now.getTime() + RECORDING_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
            // 5. Store recording metadata in Firestore
            const recordingData = {
                userId,
                interviewId,
                recordingUrl: fileUrl,
                encryptionKeyId: keyId,
                processingStatus: 'pending',
                createdAt: now.toISOString(),
                expiresAt: expiresAt.toISOString(),
                metadata: {
                    ...metadata,
                    storageType: isLocalStorage ? 'local' : 'firebase'
                }
            };
            const recordingRef = await __TURBOPACK__imported__module__$5b$project$5d2f$firebase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection(COLLECTION_RECORDINGS).add(recordingData);
            // 6. Return recording ID
            return recordingRef.id;
        } catch (error) {
            console.error('Error storing voice recording:', error);
            throw new Error('Failed to store voice recording');
        }
    },
    /**
   * Retrieve and decrypt a voice recording
   */ async getVoiceRecording (recordingId) {
        try {
            // 1. Get recording metadata
            const recordingDoc = await __TURBOPACK__imported__module__$5b$project$5d2f$firebase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection(COLLECTION_RECORDINGS).doc(recordingId).get();
            if (!recordingDoc.exists) {
                throw new Error('Recording not found');
            }
            const recordingData = {
                id: recordingDoc.id,
                ...recordingDoc.data()
            };
            // 2. Check if recording has expired
            if (new Date(recordingData.expiresAt) < new Date()) {
                throw new Error('Recording has expired and has been deleted');
            }
            // 3. Get the file from storage
            let encryptedBuffer;
            if (recordingData.recordingUrl.startsWith('local://')) {
                // Local storage
                const filename = recordingData.recordingUrl.replace('local://', '');
                const localPath = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"])(LOCAL_STORAGE_PATH, filename);
                if (!(0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"])(localPath)) {
                    throw new Error('Recording file not found in local storage');
                }
                encryptedBuffer = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["readFileSync"])(localPath);
            } else {
                // Firebase Storage
                const fileRef = __TURBOPACK__imported__module__$5b$project$5d2f$firebase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storage"].bucket().file(recordingData.recordingUrl);
                const [exists] = await fileRef.exists();
                if (!exists) {
                    throw new Error('Recording file not found in storage');
                }
                // 4. Download the encrypted file
                const [buffer] = await fileRef.download();
                encryptedBuffer = buffer;
            }
            // 5. Get the encryption key and decrypt
            const decryptedBuffer = await decryptBuffer(encryptedBuffer, recordingData.encryptionKeyId);
            // 6. Return the decrypted buffer and metadata
            return {
                buffer: decryptedBuffer,
                metadata: recordingData
            };
        } catch (error) {
            console.error('Error retrieving voice recording:', error);
            throw new Error(`Failed to retrieve voice recording: ${error.message}`);
        }
    },
    /**
   * Delete a voice recording (both metadata and file)
   */ async deleteVoiceRecording (recordingId, userId) {
        try {
            // 1. Get recording metadata
            const recordingRef = __TURBOPACK__imported__module__$5b$project$5d2f$firebase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection(COLLECTION_RECORDINGS).doc(recordingId);
            const recordingDoc = await recordingRef.get();
            if (!recordingDoc.exists) {
                throw new Error('Recording not found');
            }
            const recordingData = recordingDoc.data();
            // 2. Verify ownership
            if (recordingData.userId !== userId) {
                throw new Error('Not authorized to delete this recording');
            }
            // 3. Delete the file from storage
            const fileRef = __TURBOPACK__imported__module__$5b$project$5d2f$firebase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storage"].bucket().file(recordingData.recordingUrl);
            await fileRef.delete().catch((err)=>{
                console.warn('Could not delete file from storage:', err);
            // Continue even if file deletion fails
            });
            // 4. Delete recording metadata
            await recordingRef.delete();
            // 5. Delete any associated analyses
            const analysesSnapshot = await __TURBOPACK__imported__module__$5b$project$5d2f$firebase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection(COLLECTION_ANALYSES).where('recordingId', '==', recordingId).get();
            const batch = __TURBOPACK__imported__module__$5b$project$5d2f$firebase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].batch();
            analysesSnapshot.docs.forEach((doc)=>{
                batch.delete(doc.ref);
            });
            await batch.commit();
        } catch (error) {
            console.error('Error deleting voice recording:', error);
            throw new Error(`Failed to delete voice recording: ${error.message}`);
        }
    },
    /**
   * Set up automatic deletion of expired recordings (called by a scheduled function)
   */ async cleanupExpiredRecordings () {
        try {
            const now = new Date();
            const expiredRecordings = await __TURBOPACK__imported__module__$5b$project$5d2f$firebase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection(COLLECTION_RECORDINGS).where('expiresAt', '<', now.toISOString()).get();
            if (expiredRecordings.empty) {
                return 0;
            }
            const batch = __TURBOPACK__imported__module__$5b$project$5d2f$firebase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].batch();
            const filesToDelete = [];
            expiredRecordings.docs.forEach((doc)=>{
                const data = doc.data();
                filesToDelete.push(data.recordingUrl);
                batch.delete(doc.ref);
            });
            // Delete metadata batch
            await batch.commit();
            // Delete files from storage
            const deletePromises = filesToDelete.map(async (filePath)=>{
                const fileRef = __TURBOPACK__imported__module__$5b$project$5d2f$firebase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storage"].bucket().file(filePath);
                return fileRef.delete().catch(()=>{
                // Ignore errors if file doesn't exist
                });
            });
            await Promise.all(deletePromises);
            return expiredRecordings.size;
        } catch (error) {
            console.error('Error cleaning up expired recordings:', error);
            throw new Error('Failed to clean up expired recordings');
        }
    }
};
// Helper functions for encryption/decryption
/**
 * Encrypt a buffer using quantum-resistant hybrid encryption
 */ async function encryptBuffer(buffer) {
    try {
        // In a real implementation, we'd use a quantum-resistant algorithm
        // For now, we'll simulate with AES-GCM which is still secure for current threats
        // 1. Generate a new AES-256 key
        const symmetricKey = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomBytes"])(32);
        const iv = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomBytes"])(16);
        // 2. Encrypt the buffer
        const cipher = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["createCipheriv"])('aes-256-gcm', symmetricKey, iv);
        const encrypted = Buffer.concat([
            cipher.update(buffer),
            cipher.final()
        ]);
        const authTag = cipher.getAuthTag();
        // 3. Store the encryption key metadata in Firestore
        const keyData = {
            algorithm: 'AES-GCM',
            version: 1,
            createdAt: new Date().toISOString(),
            rotatedAt: new Date().toISOString(),
            public: false,
            // Store the symmetric key and IV separately from the encrypted data
            keyData: Buffer.concat([
                symmetricKey,
                iv
            ]).toString('base64')
        };
        const keyRef = await __TURBOPACK__imported__module__$5b$project$5d2f$firebase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection(COLLECTION_ENCRYPTION_KEYS).add(keyData);
        // 4. Combine encrypted data with auth tag
        // Format: [16-byte Auth Tag][Encrypted Data]
        const encryptedData = Buffer.concat([
            authTag,
            encrypted
        ]);
        return {
            keyId: keyRef.id,
            encryptedData
        };
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Failed to encrypt data');
    }
}
/**
 * Decrypt a buffer using the stored encryption key
 */ async function decryptBuffer(encryptedBuffer, keyId) {
    try {
        // 1. Retrieve the encryption key
        const keyDoc = await __TURBOPACK__imported__module__$5b$project$5d2f$firebase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection(COLLECTION_ENCRYPTION_KEYS).doc(keyId).get();
        if (!keyDoc.exists) {
            throw new Error('Encryption key not found');
        }
        const keyData = keyDoc.data();
        // In a real implementation, we'd check the algorithm and use the appropriate decryption
        if (keyData.algorithm !== 'AES-GCM') {
            throw new Error(`Unsupported encryption algorithm: ${keyData.algorithm}`);
        }
        // 2. Extract key material from stored data
        const keyMaterial = Buffer.from(keyData.keyData || '', 'base64');
        const symmetricKey = keyMaterial.subarray(0, 32);
        const iv = keyMaterial.subarray(32, 48);
        // 3. Extract components from encrypted data
        // Format: [16-byte Auth Tag][Encrypted Data]
        const authTag = encryptedBuffer.subarray(0, 16);
        const encrypted = encryptedBuffer.subarray(16);
        // 4. Set up the decipher
        const decipher = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["createDecipheriv"])('aes-256-gcm', symmetricKey, iv);
        decipher.setAuthTag(authTag);
        // 5. Decrypt the data
        const decrypted = Buffer.concat([
            decipher.update(encrypted),
            decipher.final()
        ]);
        return decrypted;
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Failed to decrypt data');
    }
}
const __TURBOPACK__default__export__ = voiceDataService;
}}),
"[project]/app/api/user/recordings/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "DELETE": (()=>DELETE),
    "GET": (()=>GET),
    "POST": (()=>POST)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$auth$2e$actions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/actions/auth.actions.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$firebase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/firebase/admin.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$voiceDataService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/services/voiceDataService.ts [app-route] (ecmascript)");
;
;
;
;
async function GET() {
    try {
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$auth$2e$actions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentUser"])();
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: "Unauthorized"
            }, {
                status: 401
            });
        }
        // Fetch recordings from Firestore
        const recordingsSnapshot = await __TURBOPACK__imported__module__$5b$project$5d2f$firebase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection("voice_recordings").where("userId", "==", user.id).orderBy("createdAt", "desc").limit(50) // Pagination could be implemented
        .get();
        const recordings = recordingsSnapshot.docs.map((doc)=>({
                id: doc.id,
                ...doc.data(),
                // Don't include encryption key details
                encryptionKeyId: undefined
            }));
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            recordings
        });
    } catch (error) {
        console.error("Error fetching recordings:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: "Failed to fetch recordings"
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$auth$2e$actions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentUser"])();
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: "Unauthorized"
            }, {
                status: 401
            });
        }
        // Get form data with audio file
        const formData = await request.formData();
        const audioFile = formData.get('audio');
        const interviewId = formData.get('interviewId');
        const metadataStr = formData.get('metadata');
        if (!audioFile || !interviewId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: "Missing audio file or interview ID"
            }, {
                status: 400
            });
        }
        const metadata = metadataStr ? JSON.parse(metadataStr) : {};
        // Convert file to buffer for encryption
        const arrayBuffer = await audioFile.arrayBuffer();
        const audioBuffer = Buffer.from(arrayBuffer);
        // Store the recording using voice data service
        const recordingId = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$voiceDataService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].storeVoiceRecording(user.id, interviewId, audioBuffer, {
            ...metadata,
            originalFileName: audioFile.name,
            mimeType: audioFile.type,
            fileSize: audioFile.size
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            recordingId,
            message: "Recording stored successfully"
        });
    } catch (error) {
        console.error("Error storing recording:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: "Failed to store recording"
        }, {
            status: 500
        });
    }
}
async function DELETE(request) {
    try {
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$auth$2e$actions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentUser"])();
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: "Unauthorized"
            }, {
                status: 401
            });
        }
        // Get the URL to extract parameters
        const { searchParams } = new URL(request.url);
        const recordingId = searchParams.get('id');
        const deleteAll = searchParams.get('all') === 'true';
        if (deleteAll) {
            // Find all user recordings
            const recordingsSnapshot = await __TURBOPACK__imported__module__$5b$project$5d2f$firebase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].collection("voice_recordings").where("userId", "==", user.id).get();
            // Delete each recording
            const deletePromises = recordingsSnapshot.docs.map((doc)=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$voiceDataService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].deleteVoiceRecording(doc.id, user.id));
            await Promise.all(deletePromises);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                message: `Successfully deleted ${recordingsSnapshot.size} recordings`
            });
        } else if (recordingId) {
            // Delete a specific recording
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$voiceDataService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].deleteVoiceRecording(recordingId, user.id);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                message: "Recording deleted successfully"
            });
        } else {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: "Missing recording ID or 'all' parameter"
            }, {
                status: 400
            });
        }
    } catch (error) {
        console.error("Error deleting recordings:", error);
        const message = error instanceof Error ? error.message : "Failed to delete recordings";
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message
        }, {
            status: 500
        });
    }
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__4cc123aa._.js.map