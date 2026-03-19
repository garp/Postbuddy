import Link from 'next/link';
import React from 'react';

export default function GetLifeTimeAccess() {
  return (
    <div>
      <Link href={`/plans`} className="lifetime-access-btn font-Poppins rounded-3xl px-4 py-2 text-2xl">
        Get Lifetime Access
      </Link>
    </div>
  );
}
