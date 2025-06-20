'use client';

import { signOut } from '@/lib/actions/auth.actions';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/sign-in');
  };

  return (
    <Button onClick={handleSignOut} variant="outline">
      Sign Out
    </Button>
  );
};

export default SignOutButton;
