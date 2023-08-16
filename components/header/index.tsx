"use client";

import { useAppSelector } from '@/redux/hooks';
import Link from 'next/link'

const Header = () => {
  const state = useAppSelector(state => state.auth);
  console.log(state);
  return (
    <header className="flex justify-center text-[orange] gap-2">
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/contact">Contact Us</Link>
      <Link href="/cart">Cart</Link>
      <Link href="/login">Login</Link>
    </header>
  );
}

export default Header