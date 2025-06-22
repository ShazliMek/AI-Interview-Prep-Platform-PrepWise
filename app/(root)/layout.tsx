import {ReactNode} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { isAuthenticated } from '@/lib/actions/auth.actions'
import { redirect } from 'next/navigation'
import SignOutButton from '@/components/SignOutButton'


const RootLayout = async ({children}:{children: ReactNode}) => {

  const isUserAuthenticated = await isAuthenticated();
  
  if (!isUserAuthenticated) redirect('/sign-in')
  return (
    <div className='root-layout'>
      <nav className='flex items-center justify-between gap-2 p-4'> {/* Added justify-between for spacing */}
        <Link 
          href='/' 
          className='flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer'
        >
          <Image src='/logo.svg' alt='logo' width={38} height={32} />
          <h2 className="text-primary-100">PrepWise</h2>
        </Link>
        <div className='flex items-center gap-3'>
          {/* Test Vapi link removed from production UI */}
          {/* 
          <Link href='/test-vapi' className='px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors'>
            Test Vapi
          </Link>
          */}
          <Link href='/my-account' className='px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-md hover:bg-primary-600 transition-colors'>
            My Account
          </Link>
          <SignOutButton /> {/* Added SignOutButton here */}
        </div>
      </nav>
        {children}
    </div>
  )
}

export default RootLayout