'use client';

import { useState, useEffect } from 'react';
import { UserPrivacySettings } from '@/types/voiceData';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PrivacySettingsPage() {
  const [settings, setSettings] = useState<UserPrivacySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  useEffect(() => {
    // Fetch user privacy settings
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/user/privacy');
        const data = await response.json();
        
        if (data.success) {
          setSettings(data.settings);
        } else {
          setError(data.message || 'Failed to load settings');
        }
      } catch (err) {
        setError('Failed to load privacy settings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);
  
  const updateSettings = async (updates: Partial<UserPrivacySettings>) => {
    setSuccess(null);
    setError(null);
    setSaving(true);
    
    try {
      const response = await fetch('/api/user/privacy', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSettings(prev => prev ? { ...prev, ...updates } : null);
        setSuccess('Settings updated successfully');
      } else {
        setError(data.message || 'Failed to update settings');
      }
    } catch (err) {
      setError('Error saving settings');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };
  
  const handleRetentionChange = (days: number) => {
    updateSettings({ dataRetentionPeriod: days });
  };
  
  const handleToggle = (setting: keyof UserPrivacySettings, value: boolean) => {
    updateSettings({ [setting]: value } as any);
  };
  
  const handleDeleteAllRecordings = async () => {
    if (!confirm('Are you sure you want to delete all voice recordings? This action cannot be undone.')) {
      return;
    }
    
    setError(null);
    setSuccess(null);
    setSaving(true);
    
    try {
      const response = await fetch('/api/user/recordings?all=true', {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess('All voice recordings deleted successfully');
      } else {
        setError(data.message || 'Failed to delete recordings');
      }
    } catch (err) {
      setError('Error deleting recordings');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Privacy Settings</h1>
          <p>Loading your privacy settings...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Privacy Settings</h1>
          <Link href="/my-account" className="text-sm text-blue-500 hover:text-blue-600">
            Back to Account
          </Link>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Data Retention</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Voice Recording Retention Period
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Choose how long we store your voice recordings before they are automatically deleted.
              </p>
              <div className="flex flex-wrap gap-3">
                {[7, 14, 30].map((days) => (
                  <button
                    key={days}
                    onClick={() => handleRetentionChange(days)}
                    className={`px-4 py-2 border rounded-md ${
                      settings?.dataRetentionPeriod === days
                        ? 'bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:border-blue-400 dark:text-blue-300'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    disabled={saving}
                  >
                    {days} days
                  </button>
                ))}
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-medium mb-3">Consent Settings</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Voice Processing</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Allow us to analyze your voice patterns to provide feedback
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={settings?.voiceProcessingConsent ?? false} 
                      onChange={() => handleToggle('voiceProcessingConsent', !settings?.voiceProcessingConsent)}
                      className="sr-only peer"
                      disabled={saving}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Analytics</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Allow us to collect usage data to improve our service
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={settings?.analyticsConsent ?? false} 
                      onChange={() => handleToggle('analyticsConsent', !settings?.analyticsConsent)}
                      className="sr-only peer"
                      disabled={saving}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">AI Recommendations</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive personalized interview improvement suggestions
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={settings?.recommendationsEnabled ?? false} 
                      onChange={() => handleToggle('recommendationsEnabled', !settings?.recommendationsEnabled)}
                      className="sr-only peer"
                      disabled={saving}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-red-600 dark:text-red-400">Danger Zone</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            These actions cannot be undone. Please be certain.
          </p>
          
          <Button 
            variant="destructive" 
            onClick={handleDeleteAllRecordings}
            disabled={saving}
          >
            Delete All Voice Recordings
          </Button>
        </div>
      </div>
    </div>
  );
}
