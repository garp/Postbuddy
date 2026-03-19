'use client';
import { Button, Loader, Input } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { useUpdateUserMutation } from '@/redux/api/services/user';
import { useUploadFileMutation } from '@/redux/api/services/fileUpload';
import toast from 'react-hot-toast';
import { setToken } from '@/redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import Image from 'next/image';

export default function EditProfile({ User, onClose, refetch }: any) {
  const [fullName, setFullName] = useState(User?.fullName || '');
  const [email, setEmail] = useState(User?.email || '');
  const [profileImage, setProfileImage] = useState(User?.profileUrl || '');
  const [isModified, setIsModified] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();

  useEffect(() => {
    if (User) {
      setFullName(User.fullName || '');
      setEmail(User.email || '');
      setProfileImage(User?.profileUrl || '');
    }
  }, [User]);

  const handleChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    originalValue: string,
  ) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value.trim();

      if (newValue && !/^[A-Za-z\s]+$/.test(newValue)) {
        setError('Only letters allowed.');
      } else if (newValue && (newValue.match(/[A-Za-z]/g) || []).length < 1) {
        setError('At least 1 letter required.');
      } else {
        setError('');
      }

      // Mark as modified if value differs from the original value
      setIsModified(newValue !== originalValue);
      setter(e.target.value);
    };
  };

  // When a file is selected, pass the raw file to the mutation.
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast.error('No file selected.');
      return;
    }

    setIsModified(true);
    try {
      // Call the mutation with the raw file; the mutation builds FormData.
      const s3Url = await uploadFile(file).unwrap();
      setProfileImage(s3Url);
      toast.success('Image uploaded successfully!');
    } catch (uploadError) {
      console.error('Upload error:', uploadError);
      toast.error('Failed to upload image');
    }
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (error) {
      toast.error(error);
      return;
    }

    // If user clears a field, we fall back to the original value.
    const finalFullName = fullName.trim() === '' ? User.fullName : fullName;
    const finalProfileImage =
      profileImage.trim() === '' ? User.profileImage : profileImage;

    // If both final values are empty, show an error.
    if (!finalFullName && !finalProfileImage) {
      toast.error('Please fill in at least one required field.');
      return;
    }

    try {
      const res = await updateUser({
        email,
        fullName: finalFullName,
        profileImage: finalProfileImage,
      }).unwrap();
      dispatch(setToken(res?.data?.token));
      toast.success('Profile updated successfully');
      refetch();
      onClose();
    } catch (submitError) {
      console.log('Error updating user:', submitError);
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="border-2 border-[#6022b5] bg-[#2b1e4e] text-white p-8 rounded-lg max-w-md mx-auto">
      <h3 className="text-red-400 text-sm mb-2 font-bold font-Poppins">
        EDIT PROFILE
      </h3>
      <h2 className="text-3xl font-semibold mb-4">
        Updating profile information :)
      </h2>

      <form className="flex flex-col gap-4 mb-6" onSubmit={submitHandler}>
        <div className="flex flex-col items-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="fileInput"
          />
          <label htmlFor="fileInput" className="cursor-pointer">
            {profileImage ? (
              <div className="relative group">
                <Image
                  src={profileImage}
                  alt="Profile Preview"
                  width={96}
                  height={96}
                  className="rounded-full object-cover border border-gray-300"
                  priority
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <CiEdit className="text-white text-2xl" />
                </div>
              </div>
            ) : (
              <div className="w-24 h-24 flex items-center justify-center rounded-full bg-[#110f1b] text-white text-sm">
                Upload Image
              </div>
            )}
          </label>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Name:</label>
          <Input
            placeholder="Enter your name"
            value={fullName}
            onChange={handleChange(setFullName, User?.fullName)}
            required
          />
          {error && <span className="text-red-400 text-xs">{error}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Email:</label>
          <Input placeholder="Enter your email" value={email} disabled />
        </div>

        <div className="flex items-center justify-between font-Poppins mt-4">
          <Button color="violet" variant="filled" onClick={() => onClose()}>
            Cancel
          </Button>
          <Button
            color="red"
            variant="filled"
            type="submit"
            disabled={!isModified || !!error || isLoading || !fullName}
          >
            {isLoading || isUploading ? (
              <Loader color="white" size="sm" />
            ) : (
              'Update'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
