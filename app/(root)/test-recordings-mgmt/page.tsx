import EnhancedRecordingsView from '@/components/EnhancedRecordingsView';

export default function TestRecordingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Recording Management Demo</h1>
            <p className="mt-2 text-gray-600">
              View and manage your encrypted voice recordings from interviews
            </p>
          </div>
          
          <EnhancedRecordingsView />
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">📋 How Recording Management Works:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✅ All recordings are encrypted with AES-256-GCM</li>
              <li>✅ Metadata stored in MongoDB Atlas cloud database</li>
              <li>✅ Audio files stored locally (or Firebase Storage in production)</li>
              <li>✅ Automatic expiration after 30 days</li>
              <li>✅ User can delete recordings anytime</li>
              <li>✅ Complete privacy control and data management</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
