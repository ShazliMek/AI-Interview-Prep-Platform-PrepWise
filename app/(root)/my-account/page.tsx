import { getCurrentUser } from '@/lib/actions/auth.actions';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const MyAccountPage = async () => {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/sign-in');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Account</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-5 mb-6">
            <div className="rounded-full overflow-hidden w-20 h-20 bg-gray-100 flex items-center justify-center">
              <Image 
                src="/user-avatar.png" 
                alt="Profile" 
                width={80} 
                height={80}
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{user.name}</h2>
              <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-medium mb-4">Account Details</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Name:</p>
                <p className="font-medium">{user.name}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email:</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Privacy & Data Security</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                We store your interview data with industry-leading encryption to provide personalized insights
                and help you improve your interview skills. Voice recordings are automatically deleted after 30 days.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md border border-blue-100 dark:border-blue-800">
                <div className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v-1l1-1 1-1-2.257-2.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300">Quantum-Resistant Encryption</h4>
                    <p className="text-xs text-blue-600 dark:text-blue-400">Your voice data is protected using advanced encryption that's resistant to future quantum computing threats.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium mb-3">Account Management</h3>
              <div className="flex flex-col gap-3">
                <Link href="/my-account/privacy">
                  <Button 
                    variant="outline" 
                    className="justify-start text-sm w-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v-1l1-1 1-1-2.257-2.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                    </svg>
                    Privacy Settings
                  </Button>
                </Link>
                
                <Button 
                  variant="outline" 
                  className="justify-start text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit Profile
                </Button>
                
                <Button 
                  variant="outline" 
                  className="justify-start text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Download My Data
                </Button>
                
                <Link href="/my-account/recordings">
                  <Button 
                    variant="outline" 
                    className="justify-start text-sm w-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    My Voice Recordings
                  </Button>
                </Link>
                
                <Link href="/my-account/test-encryption">
                  <Button 
                    variant="outline" 
                    className="justify-start text-sm w-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v-1l1-1 1-1-2.257-2.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                    </svg>
                    Test Encryption
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccountPage;
