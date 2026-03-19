import React from 'react';

type FeedBackProps = {
  imgUrl: string;
  name: string;
  feedback: string;
};

export default function FeedBackCard({ name, feedback }: FeedBackProps) {
  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <h3 className="text-lg font-semibold">{name}</h3>
      </div>
      <p className="text-sm">{feedback}</p>
    </div>
  );
}
