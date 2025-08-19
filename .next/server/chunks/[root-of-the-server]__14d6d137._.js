module.exports = {

"[project]/.next-internal/server/app/api/user/recordings-mongodb/[id]/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

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
"[externals]/mongodb [external] (mongodb, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("mongodb", () => require("mongodb"));

module.exports = mod;
}}),
"[externals]/mongoose [external] (mongoose, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("mongoose", () => require("mongoose"));

module.exports = mod;
}}),
"[project]/lib/mongodb.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "closeConnection": (()=>closeConnection),
    "connectToMongoDB": (()=>connectToMongoDB),
    "default": (()=>__TURBOPACK__default__export__),
    "getDatabase": (()=>getDatabase),
    "getMongoClient": (()=>getMongoClient)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongodb [external] (mongodb, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
;
if (!process.env.MONGODB_URI) {
    throw new Error('Please add your MongoDB URI to .env.local');
}
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'ai-interview-prep';
let client;
let clientPromise;
if ("TURBOPACK compile-time truthy", 1) {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    let globalWithMongo = global;
    if (!globalWithMongo._mongoClientPromise) {
        client = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["MongoClient"](uri);
        globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
} else {
    "TURBOPACK unreachable";
}
// Mongoose connection (for schemas)
let mongoose_connection = null;
async function connectToMongoDB() {
    try {
        if (mongoose_connection?.connection?.readyState === 1) {
            return mongoose_connection;
        }
        console.log('[MongoDB] Connecting to database...');
        mongoose_connection = await __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connect(uri, {
            dbName: dbName
        });
        console.log(`[MongoDB] Connected successfully to database: ${dbName}`);
        return mongoose_connection;
    } catch (error) {
        console.error('[MongoDB] Connection failed:', error);
        throw error;
    }
}
async function getMongoClient() {
    return clientPromise;
}
async function getDatabase() {
    const client = await getMongoClient();
    return client.db(dbName);
}
async function closeConnection() {
    if (mongoose_connection) {
        await mongoose_connection.disconnect();
        mongoose_connection = null;
    }
    const client = await getMongoClient();
    await client.close();
}
const __TURBOPACK__default__export__ = clientPromise;
}}),
"[project]/lib/models/mongodb-schemas.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "EncryptionKey": (()=>EncryptionKey),
    "InterviewAnalysis": (()=>InterviewAnalysis),
    "UserPrivacySettings": (()=>UserPrivacySettings),
    "VoiceAnalysis": (()=>VoiceAnalysis),
    "VoiceRecording": (()=>VoiceRecording),
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const VoiceRecordingSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    userId: {
        type: String,
        required: true,
        index: true
    },
    interviewId: {
        type: String,
        required: true,
        index: true
    },
    recordingUrl: {
        type: String,
        required: true
    },
    encryptionKeyId: {
        type: String,
        required: true
    },
    processingStatus: {
        type: String,
        enum: [
            'pending',
            'processed',
            'failed'
        ],
        default: 'pending',
        index: true
    },
    rec_length: {
        type: Number,
        required: true,
        default: 0,
        validate: {
            validator: Number.isInteger,
            message: 'rec_length must be an integer'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: true
    },
    metadata: {
        duration: {
            type: Number,
            required: true
        },
        fileSize: {
            type: Number,
            required: true
        },
        mimeType: {
            type: String,
            required: true
        },
        originalFileName: String,
        storageType: {
            type: String,
            enum: [
                'local',
                'firebase',
                'aws',
                'gcp'
            ],
            default: 'local'
        },
        quality: String,
        language: {
            type: String,
            default: 'en'
        },
        transcription: String,
        analysis: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.Mixed
    }
}, {
    timestamps: true,
    collection: 'voice_recordings'
});
// Add indexes for performance
VoiceRecordingSchema.index({
    userId: 1,
    createdAt: -1
});
VoiceRecordingSchema.index({
    expiresAt: 1
}, {
    expireAfterSeconds: 0
}); // TTL index
VoiceRecordingSchema.index({
    processingStatus: 1,
    createdAt: 1
});
const EncryptionKeySchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    algorithm: {
        type: String,
        required: true,
        default: 'AES-GCM'
    },
    version: {
        type: Number,
        required: true,
        default: 1
    },
    keyData: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    rotatedAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
    public: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    collection: 'encryption_keys'
});
const VoiceAnalysisSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    recordingId: {
        type: String,
        required: true,
        index: true
    },
    userId: {
        type: String,
        required: true,
        index: true
    },
    interviewId: {
        type: String,
        required: true,
        index: true
    },
    analysisType: {
        type: String,
        enum: [
            'sentiment',
            'transcription',
            'keywords',
            'confidence',
            'pace'
        ],
        required: true,
        index: true
    },
    results: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.Mixed,
        required: true
    },
    confidence: {
        type: Number,
        min: 0,
        max: 1
    },
    processingTime: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    collection: 'voice_analyses'
});
VoiceAnalysisSchema.index({
    recordingId: 1,
    analysisType: 1
});
const UserPrivacySettingsSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    userId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    voiceRecording: {
        enabled: {
            type: Boolean,
            default: true
        },
        autoDelete: {
            type: Boolean,
            default: true
        },
        retentionDays: {
            type: Number,
            default: 30,
            min: 1,
            max: 365
        }
    },
    dataSharing: {
        allowAnalytics: {
            type: Boolean,
            default: false
        },
        allowImprovement: {
            type: Boolean,
            default: false
        },
        allowThirdParty: {
            type: Boolean,
            default: false
        }
    },
    notifications: {
        recordingReminders: {
            type: Boolean,
            default: true
        },
        dataExpiry: {
            type: Boolean,
            default: true
        },
        analysisComplete: {
            type: Boolean,
            default: true
        }
    }
}, {
    timestamps: true,
    collection: 'user_privacy_settings'
});
const InterviewAnalysisSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    recordingId: {
        type: String,
        required: true,
        index: true
    },
    userId: {
        type: String,
        required: true,
        index: true
    },
    interviewId: {
        type: String,
        required: true,
        index: true
    },
    analysis: {
        clarity: {
            filler_word_count: {
                type: Number,
                required: true
            }
        },
        confidence_metrics: {
            pitch_stability_score: {
                type: Number,
                required: true
            }
        },
        pace: {
            type: Number,
            required: true
        },
        transcript: String,
        tone: {
            label: String,
            confidence: Number
        },
        duration_seconds: Number,
        overallScore: Number,
        recommendations: [
            String
        ]
    }
}, {
    timestamps: true,
    collection: 'interview_analyses'
});
InterviewAnalysisSchema.index({
    recordingId: 1
}, {
    unique: true
});
InterviewAnalysisSchema.index({
    userId: 1,
    createdAt: -1
});
const VoiceRecording = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.VoiceRecording || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('VoiceRecording', VoiceRecordingSchema);
const EncryptionKey = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.EncryptionKey || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('EncryptionKey', EncryptionKeySchema);
const VoiceAnalysis = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.VoiceAnalysis || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('VoiceAnalysis', VoiceAnalysisSchema);
const UserPrivacySettings = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.UserPrivacySettings || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('UserPrivacySettings', UserPrivacySettingsSchema);
const InterviewAnalysis = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.InterviewAnalysis || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('InterviewAnalysis', InterviewAnalysisSchema);
const __TURBOPACK__default__export__ = {
    VoiceRecording,
    EncryptionKey,
    VoiceAnalysis,
    UserPrivacySettings,
    InterviewAnalysis
};
}}),
"[externals]/crypto [external] (crypto, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}}),
"[project]/lib/services/voiceDataServiceMongoDB.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// Voice data storage and encryption service - MongoDB version
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "voiceDataServiceMongoDB": (()=>voiceDataServiceMongoDB)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$mongodb$2d$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/mongodb-schemas.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
;
;
;
// Constants
const RECORDING_EXPIRY_DAYS = 30;
const LOCAL_STORAGE_PATH = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"])(process.cwd(), 'temp', 'encrypted-recordings');
const voiceDataServiceMongoDB = {
    /**
   * Store an encrypted voice recording
   */ async storeVoiceRecording (userId, interviewId, recordingBuffer, metadata) {
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToMongoDB"])();
            // 1. Generate a new encryption key for this recording
            const { keyId, encryptedData } = await encryptBuffer(recordingBuffer);
            // 2. Generate a unique filename
            const filename = `voice-recordings/${userId}/${interviewId}/${(0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomUUID"])()}.enc`;
            // 3. Store encrypted data (Firebase Storage or local fallback)
            let fileUrl;
            let storageType = 'local';
            try {
                // Try Firebase Storage first (if available)
                const { storage } = await __turbopack_context__.r("[project]/firebase/admin.ts [app-route] (ecmascript, async loader)")(__turbopack_context__.i);
                const fileRef = storage.bucket().file(filename);
                await fileRef.save(encryptedData, {
                    metadata: {
                        contentType: 'application/octet-stream',
                        metadata: {
                            encryptionKeyId: keyId,
                            originalContentType: metadata.mimeType
                        }
                    }
                });
                fileUrl = filename;
                storageType = 'firebase';
                console.log('[MongoDB Voice Service] Stored in Firebase Storage');
            } catch (storageError) {
                console.warn('[MongoDB Voice Service] Firebase Storage failed, using local storage:', storageError);
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
                storageType = 'local';
                console.log('[MongoDB Voice Service] Stored in local storage');
            }
            // 4. Calculate expiry date (30 days from now)
            const now = new Date();
            const expiresAt = new Date(now.getTime() + RECORDING_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
            // 5. Store recording metadata in MongoDB
            const voiceRecording = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$mongodb$2d$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VoiceRecording"]({
                userId,
                interviewId,
                recordingUrl: fileUrl,
                encryptionKeyId: keyId,
                processingStatus: 'pending',
                createdAt: now,
                expiresAt: expiresAt,
                metadata: {
                    ...metadata,
                    originalFileName: metadata.originalFileName,
                    storageType
                }
            });
            const savedRecording = await voiceRecording.save();
            console.log(`[MongoDB Voice Service] Recording saved with ID: ${savedRecording._id}`);
            return savedRecording._id.toString();
        } catch (error) {
            console.error('[MongoDB Voice Service] Error storing voice recording:', error);
            throw new Error('Failed to store voice recording');
        }
    },
    /**
   * Retrieve and decrypt a voice recording
   */ async getVoiceRecording (recordingId) {
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToMongoDB"])();
            // 1. Get recording metadata from MongoDB
            const recordingData = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$mongodb$2d$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VoiceRecording"].findById(recordingId);
            if (!recordingData) {
                throw new Error('Recording not found');
            }
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
                console.log('[MongoDB Voice Service] Retrieved from local storage');
            } else {
                // Firebase Storage
                const { storage } = await __turbopack_context__.r("[project]/firebase/admin.ts [app-route] (ecmascript, async loader)")(__turbopack_context__.i);
                const fileRef = storage.bucket().file(recordingData.recordingUrl);
                const [exists] = await fileRef.exists();
                if (!exists) {
                    throw new Error('Recording file not found in storage');
                }
                const [buffer] = await fileRef.download();
                encryptedBuffer = buffer;
                console.log('[MongoDB Voice Service] Retrieved from Firebase Storage');
            }
            // 4. Get the encryption key and decrypt
            const decryptedBuffer = await decryptBuffer(encryptedBuffer, recordingData.encryptionKeyId);
            // 5. Return the decrypted buffer and metadata
            return {
                buffer: decryptedBuffer,
                metadata: recordingData
            };
        } catch (error) {
            console.error('[MongoDB Voice Service] Error retrieving recording:', error);
            throw new Error('Failed to retrieve voice recording');
        }
    },
    /**
   * Get all voice recordings for a user
   */ async getUserRecordings (userId, limit = 50) {
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToMongoDB"])();
            const recordings = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$mongodb$2d$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VoiceRecording"].find({
                userId
            }).sort({
                createdAt: -1
            }).limit(limit).lean();
            return recordings;
        } catch (error) {
            console.error('[MongoDB Voice Service] Error fetching user recordings:', error);
            throw new Error('Failed to fetch user recordings');
        }
    },
    /**
   * Update recording duration for a specific interview
   */ async updateRecordingDuration (interviewId, duration, userId) {
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToMongoDB"])();
            // Ensure duration is an integer
            const integerDuration = Math.floor(duration);
            console.log(`[MongoDB Voice Service] Updating recording duration for interview: ${interviewId}, duration: ${integerDuration}s (integer)`);
            // Build query - include userId if provided for additional security
            const query = {
                interviewId
            };
            if (userId) {
                query.userId = userId;
                console.log(`[MongoDB Voice Service] Including userId in query for additional security: ${userId}`);
            }
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$mongodb$2d$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VoiceRecording"].updateOne(query, {
                $set: {
                    rec_length: integerDuration
                }
            });
            if (result.matchedCount > 0) {
                console.log(`[MongoDB Voice Service] ✅ Successfully updated duration for interview: ${interviewId}`);
                return true;
            } else {
                console.warn(`[MongoDB Voice Service] ❌ No recording found for interview: ${interviewId}${userId ? ` and user: ${userId}` : ''}`);
                return false;
            }
        } catch (error) {
            console.error('[MongoDB Voice Service] Error updating recording duration:', error);
            throw new Error('Failed to update recording duration');
        }
    },
    /**
   * Delete a voice recording
   */ async deleteVoiceRecording (recordingId, userId) {
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToMongoDB"])();
            // 1. Find the recording
            const recording = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$mongodb$2d$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VoiceRecording"].findOne({
                _id: recordingId,
                userId
            });
            if (!recording) {
                throw new Error('Recording not found or unauthorized');
            }
            // 2. Delete the file from storage
            try {
                if (recording.recordingUrl.startsWith('local://')) {
                    // Local storage
                    const filename = recording.recordingUrl.replace('local://', '');
                    const localPath = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"])(LOCAL_STORAGE_PATH, filename);
                    if ((0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"])(localPath)) {
                        (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["unlinkSync"])(localPath);
                    }
                } else {
                    // Firebase Storage
                    const { storage } = await __turbopack_context__.r("[project]/firebase/admin.ts [app-route] (ecmascript, async loader)")(__turbopack_context__.i);
                    const fileRef = storage.bucket().file(recording.recordingUrl);
                    await fileRef.delete();
                }
            } catch (storageError) {
                console.warn('[MongoDB Voice Service] Error deleting storage file:', storageError);
            // Continue with database deletion even if storage deletion fails
            }
            // 3. Delete encryption key
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$mongodb$2d$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EncryptionKey"].findByIdAndDelete(recording.encryptionKeyId);
            } catch (keyError) {
                console.warn('[MongoDB Voice Service] Error deleting encryption key:', keyError);
            }
            // 4. Delete recording from database
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$mongodb$2d$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VoiceRecording"].findByIdAndDelete(recordingId);
            // 5. Delete associated analyses
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$mongodb$2d$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VoiceAnalysis"].deleteMany({
                recordingId
            });
            console.log(`[MongoDB Voice Service] Recording ${recordingId} deleted successfully`);
            return true;
        } catch (error) {
            console.error('[MongoDB Voice Service] Error deleting recording:', error);
            throw new Error('Failed to delete voice recording');
        }
    },
    /**
   * Clean up expired recordings
   */ async cleanupExpiredRecordings () {
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToMongoDB"])();
            const now = new Date();
            const expiredRecordings = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$mongodb$2d$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VoiceRecording"].find({
                expiresAt: {
                    $lt: now
                }
            });
            let deletedCount = 0;
            for (const recording of expiredRecordings){
                try {
                    await this.deleteVoiceRecording(recording._id.toString(), recording.userId);
                    deletedCount++;
                } catch (error) {
                    console.error(`[MongoDB Voice Service] Failed to delete expired recording ${recording._id}:`, error);
                }
            }
            console.log(`[MongoDB Voice Service] Cleaned up ${deletedCount} expired recordings`);
            return deletedCount;
        } catch (error) {
            console.error('[MongoDB Voice Service] Error cleaning up expired recordings:', error);
            throw new Error('Failed to clean up expired recordings');
        }
    }
};
// Helper functions for encryption/decryption (same as before)
/**
 * Encrypt a buffer using AES-GCM
 */ async function encryptBuffer(buffer) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToMongoDB"])();
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
        // 3. Store the encryption key in MongoDB
        const encryptionKey = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$mongodb$2d$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EncryptionKey"]({
            algorithm: 'AES-GCM',
            version: 1,
            keyData: Buffer.concat([
                symmetricKey,
                iv
            ]).toString('base64'),
            createdAt: new Date(),
            rotatedAt: new Date(),
            isActive: true,
            public: false
        });
        const savedKey = await encryptionKey.save();
        // 4. Combine encrypted data with auth tag
        const encryptedData = Buffer.concat([
            authTag,
            encrypted
        ]);
        return {
            keyId: savedKey._id.toString(),
            encryptedData
        };
    } catch (error) {
        console.error('[MongoDB Voice Service] Encryption error:', error);
        throw new Error('Failed to encrypt data');
    }
}
/**
 * Decrypt a buffer using the stored encryption key
 */ async function decryptBuffer(encryptedBuffer, keyId) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToMongoDB"])();
        // 1. Retrieve the encryption key from MongoDB
        const keyData = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$mongodb$2d$schemas$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EncryptionKey"].findById(keyId);
        if (!keyData) {
            throw new Error('Encryption key not found');
        }
        if (keyData.algorithm !== 'AES-GCM') {
            throw new Error(`Unsupported encryption algorithm: ${keyData.algorithm}`);
        }
        // 2. Extract key material from stored data
        const keyMaterial = Buffer.from(keyData.keyData, 'base64');
        const symmetricKey = keyMaterial.subarray(0, 32);
        const iv = keyMaterial.subarray(32, 48);
        // 3. Extract components from encrypted data
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
        console.error('[MongoDB Voice Service] Decryption error:', error);
        throw new Error('Failed to decrypt data');
    }
}
const __TURBOPACK__default__export__ = voiceDataServiceMongoDB;
}}),
"[project]/app/api/user/recordings-mongodb/[id]/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "GET": (()=>GET)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$auth$2e$actions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/actions/auth.actions.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$voiceDataServiceMongoDB$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/services/voiceDataServiceMongoDB.ts [app-route] (ecmascript)");
;
;
;
async function GET(request, { params }) {
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
        const { id: recordingId } = await params;
        console.log(`[MongoDB Retrieval API] Getting recording ${recordingId} for user ${user.id}`);
        // Retrieve and decrypt the recording using MongoDB service
        const { buffer, metadata } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$voiceDataServiceMongoDB$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].getVoiceRecording(recordingId);
        // Verify the recording belongs to the requesting user
        if (metadata.userId !== user.id) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: "Unauthorized access to recording"
            }, {
                status: 403
            });
        }
        console.log(`[MongoDB Retrieval API] Retrieved recording: ${buffer.length} bytes`);
        // Return the audio data as binary response
        return new Response(buffer, {
            status: 200,
            headers: {
                'Content-Type': metadata.metadata.mimeType || 'audio/webm',
                'Content-Length': buffer.length.toString(),
                'Content-Disposition': `inline; filename="recording-${recordingId}.${getFileExtension(metadata.metadata.mimeType)}"`,
                'Cache-Control': 'private, max-age=3600' // Cache for 1 hour
            }
        });
    } catch (error) {
        console.error("Error retrieving recording from MongoDB:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: "Failed to retrieve recording",
            error: error.message
        }, {
            status: 500
        });
    }
}
function getFileExtension(mimeType) {
    if (!mimeType) return 'webm';
    const extensions = {
        'audio/webm': 'webm',
        'audio/mp4': 'm4a',
        'audio/mpeg': 'mp3',
        'audio/wav': 'wav',
        'audio/ogg': 'ogg'
    };
    return extensions[mimeType] || 'webm';
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__14d6d137._.js.map