import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.actions";
import { db } from "@/firebase/admin";
import { UserPrivacySettings } from "@/types/voiceData";

// GET user privacy settings
export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Look for existing settings
    const settingsQuery = await db
      .collection("user_privacy_settings")
      .where("userId", "==", user.id)
      .limit(1)
      .get();
    
    if (settingsQuery.empty) {
      // Return default settings
      const defaultSettings: UserPrivacySettings = {
        id: "",
        userId: user.id,
        dataRetentionPeriod: 30, // 30 days by default
        analyticsConsent: true,
        voiceProcessingConsent: true,
        recommendationsEnabled: true,
        lastUpdated: new Date().toISOString()
      };
      
      return NextResponse.json({ 
        success: true, 
        settings: defaultSettings 
      });
    }
    
    // Return existing settings
    const settingsDoc = settingsQuery.docs[0];
    const settings = {
      id: settingsDoc.id,
      ...settingsDoc.data()
    } as UserPrivacySettings;
    
    return NextResponse.json({ 
      success: true, 
      settings 
    });
  } catch (error) {
    console.error("Error fetching privacy settings:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch privacy settings" },
      { status: 500 }
    );
  }
}

// PUT/UPDATE user privacy settings
export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Parse the request body
    const body = await request.json();
    const {
      dataRetentionPeriod,
      analyticsConsent,
      voiceProcessingConsent,
      recommendationsEnabled
    } = body;
    
    // Validate inputs
    if (dataRetentionPeriod !== undefined && 
        (typeof dataRetentionPeriod !== 'number' || dataRetentionPeriod < 1 || dataRetentionPeriod > 30)) {
      return NextResponse.json(
        { success: false, message: "Data retention period must be between 1-30 days" },
        { status: 400 }
      );
    }
    
    // Look for existing settings
    const settingsQuery = await db
      .collection("user_privacy_settings")
      .where("userId", "==", user.id)
      .limit(1)
      .get();
    
    // Create a new settings object with updated fields
    const updatedSettings: Partial<UserPrivacySettings> = {
      lastUpdated: new Date().toISOString()
    };
    
    if (dataRetentionPeriod !== undefined) updatedSettings.dataRetentionPeriod = dataRetentionPeriod;
    if (analyticsConsent !== undefined) updatedSettings.analyticsConsent = analyticsConsent;
    if (voiceProcessingConsent !== undefined) updatedSettings.voiceProcessingConsent = voiceProcessingConsent;
    if (recommendationsEnabled !== undefined) updatedSettings.recommendationsEnabled = recommendationsEnabled;
    
    let settingsId: string;
    
    if (settingsQuery.empty) {
      // Create new settings
      const newSettings = {
        userId: user.id,
        dataRetentionPeriod: dataRetentionPeriod ?? 30,
        analyticsConsent: analyticsConsent ?? true,
        voiceProcessingConsent: voiceProcessingConsent ?? true,
        recommendationsEnabled: recommendationsEnabled ?? true,
        lastUpdated: new Date().toISOString()
      };
      
      const docRef = await db.collection("user_privacy_settings").add(newSettings);
      settingsId = docRef.id;
    } else {
      // Update existing settings
      const settingsDoc = settingsQuery.docs[0];
      await settingsDoc.ref.update(updatedSettings);
      settingsId = settingsDoc.id;
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Privacy settings updated successfully",
      settingsId
    });
  } catch (error) {
    console.error("Error updating privacy settings:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update privacy settings" },
      { status: 500 }
    );
  }
}
