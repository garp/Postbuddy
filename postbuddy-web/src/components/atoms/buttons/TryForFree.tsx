import Link from 'next/link';
import React from 'react';

export default function TryForFree() {
  return (
    <div>
      <Link href={'/dashboard'} className="bg-[#5B3FA2] px-8 py-2 rounded-3xl text-2xl z-[200]">
        Try for Free
      </Link>
    </div>
  );
}
