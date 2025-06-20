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
        <Link href='/' className='flex items-center gap-2'>
          <Image src='/logo.svg' alt='logo' width={38} height={32} />
          <h2 className="text-primary-100">PrepWise</h2>
        </Link>
        <SignOutButton /> {/* Added SignOutButton here */}
      </nav>
        {children}
    </div>
  )
}

export default RootLayout