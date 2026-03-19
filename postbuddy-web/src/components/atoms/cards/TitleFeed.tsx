import React from 'react';

interface TitleFeedProps {
  name: string;
}

export default function TitleFeed({ name }: TitleFeedProps) {
  return (
    <div>
      <h1>
        {name === 'Premium'
          ? <p className='bg-[#332957] p-1 text-white shadow-xl font-Poppins font-semibold rounded-[2px]'>Flexible</p>
          : name !== 'Basic'
            ? <p className='bg-green-500 p-1 text-green-800 font-Poppins font-semibold rounded-[2px]'>Most Loved ❤️</p>
            : <p></p>}
      </h1>
    </div>
  );
}
