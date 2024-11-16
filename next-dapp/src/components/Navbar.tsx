import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SVGProps } from 'react';
import { UserNav } from '@/components/UserNav';
import Image from 'next/image';
import WorldIdButton from './WorldIdButton';

const links = [
  { name: 'Home', href: '/' },
  { name: 'Discover', href: 'discover/' },
  { name: 'Suggest', href: 'suggest-topic/' },
];

export default function Navbar() {
  return (
    <header className="flex h-20 w-full shrink-0 items-center px-8 md:px-10 mt-2">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <MenuIcon className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <div className="grid gap-6 pt-12">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex w-full items-center text-lg font-semibold"
                prefetch={false}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>
      <Link href="#" className="mr-6 hidden lg:flex" prefetch={false}>
        <Image src="app-logo.svg" alt="app-logo" width={200} height={200} />
      </Link>
      <nav className="ml-auto hidden lg:flex items-center gap-4">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-base font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50"
            prefetch={false}
          >
            {link.name}
          </Link>
        ))}
        <WorldIdButton />
        <div className="ml-[20px] mt-[6px]">
          <UserNav
            walletAddress="0xf2b5BfE0c6e9D2e04B896F0f8030931d92421D87"
            name="John Doe"
          />
        </div>
      </nav>
    </header>
  );
}

function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}
