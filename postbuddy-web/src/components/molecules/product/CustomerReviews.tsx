'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const CustomerReviews = () => {
  const [rating, setRating] = useState(0);
  const [ratingError, setRatingError] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [ratingData, setRatingData] = useState<any>(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_STRAPI_BASE_URL;

  // Fetch the review calculator data from the API
  useEffect(() => {
    const fetchRatingData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/review-calulator`);
        setRatingData(response.data);
      } catch (error) {
        console.error('Error fetching rating data:', error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/reviews?filters[review_status][$eq]=Approve`,
        );
        setReviews(response.data.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchRatingData();
    fetchReviews();
  }, []);

  const handleSubmitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (rating === 0) {
      setRatingError(true);
      return;
    }
    const formData = new FormData(e.currentTarget);

    // Format the date
    const formattedDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const newReview = {
      Rating: rating,
      Name: formData.get('name') as string,
      Review: formData.get('review') as string,
      review_date: formattedDate,
    };

    try {
      // Post the new review to the API
      await axios.post(`${baseUrl}/api/reviews`, { data: newReview });
      setReviews([newReview, ...reviews]);
      e.currentTarget.reset();
      setRating(0);
      setRatingError(false);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  // const handleSubmitReview = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const formData = new FormData(e.currentTarget);
  //   const newReview = {
  //     name: formData.get('name') as string,
  //     date: new Date().toLocaleDateString(),
  //     review: formData.get('review') as string,
  //     rating,
  //     verified: false,
  //   };
  //   setReviews([newReview, ...reviews]);
  //   e.currentTarget.reset();
  //   setRating(0);
  // };

  return (
    <div className="bg-[#110f1b] md:p-8 rounded-[8px] shadow-md">
      {/* Customer Reviews Summary */}
      {ratingData && (
        <div className="bg-[#725ba947] p-6 rounded-[8px] shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-white ">Customer Reviews</h2>
          <div className="w-full md:w-[80%] flex items-center gap-2">
            <div className="w-full flex items-center justify-center gap-2 mt-4 ">
              <span className="text-4xl font-bold text-white">
                {ratingData?.averageRating}
              </span>
              <div className="flex flex-col">
                <div className="text-yellow-500 text-xl">
                  {/* {'★'.repeat(4)}
                  {'☆'.repeat(1)} */}
                  {'★'.repeat(Math.round(ratingData?.averageRating))}
                  {'☆'.repeat(5 - Math.round(ratingData?.averageRating))}
                </div>
                <span className="text-white">
                  {/* Based on 22 reviews */}
                  Based on{' '}
                  {ratingData?.ratingDistribution.reduce(
                    (acc: any, cur: any) => acc + parseInt(cur?.percentage),
                    0,
                  )}{' '}
                  reviews
                </span>
              </div>
            </div>
            {/* Ratings distribution */}
            <div className="w-full mt-4 flex flex-col gap-2 ">
              {ratingData?.ratingDistribution.map((rating: any) => (
                <div key={rating.rating} className="flex items-center gap-2">
                  <span className="text-white">{rating.rating} </span>
                  <div className="h-2 w-full bg-gray-300 rounded-lg overflow-hidden">
                    <div
                      className="bg-yellow-500 h-2"
                      style={{
                        width: rating?.percentage,
                      }}
                    ></div>
                  </div>
                  <span className="text-white">{rating?.percentage}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Write a Review */}
      <div className="bg-[#725ba947] p-6 rounded-[8px] shadow-sm mb-8">
        <h3 className="text-lg font-bold text-white mb-4">Write a Review</h3>
        <form onSubmit={handleSubmitReview}>
          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-white">Rating</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => {
                  setRating(star);
                  setRatingError(false);
                }}
                aria-required="true"
                className={`text-xl ${
                  star <= rating ? 'text-yellow-500' : 'text-gray-300'
                }`}
              >
                ★
              </button>
            ))}
          </div>
          {ratingError && (
            <p className="text-red-500 text-sm mb-4">Rating is required</p>
          )}
          {/* Name */}
          <input
            name="name"
            type="text"
            placeholder="Enter your name"
            className="w-full text-black border border-gray-300 rounded-[8px] p-2 mb-4 outline-none"
            required
          />
          {/* Review */}
          <textarea
            name="review"
            placeholder="Share your experience with this product..."
            className="w-full text-black border border-gray-300 rounded-[8px] p-2 mb-4 outline-none"
            rows={4}
            required
          ></textarea>
          {/* Submit Button */}
          <button
            type="submit"
            className="bg-[#5f40ab] text-white py-2 px-4 rounded-[8px] hover:bg-black"
          >
            Submit Review
          </button>
        </form>
      </div>

      {/* Reviews */}
      <div>
        {reviews.map((review, index) => (
          <div
            key={index}
            className="bg-[#725ba947] p-4 rounded-[8px] shadow-sm mb-4 "
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-white">{review.Name}</h4>
              <span className="text-sm text-white">{review.review_date}</span>
            </div>
            <div className="text-yellow-500 text-lg">
              {'★'.repeat(review.Rating)}
              {'☆'.repeat(5 - review.Rating)}
            </div>
            <p className="text-white mt-2">{review.Review}</p>
            {review.review_status === 'Approve' && (
              <span className="text-green-600 text-sm font-semibold mt-2 inline-block">
                Verified Purchase
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerReviews;
