import NavLinks from '@/app/ui/dashboard/nav-links';
import Link from 'next/link';
import { lusitana } from '../fonts';
import SignInActions from '../sign-in';

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
        href="/"
      >
        <div className="text-white md:w-40">
          <div
            className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
          >
            <p className="text-[44px]">Wilson Park Ceramics</p>
          </div>
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <SignInActions />
      </div>
    </div>
  );
}
