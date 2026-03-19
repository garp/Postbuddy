import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSendInviteMutation } from '@/redux/api/services/userManagement'
import { Loader } from '@mantine/core';
import { toast } from 'react-hot-toast';

export default function InviteUser({ onClose, refetch }: { onClose: () => void, refetch: () => void }) {

  const [sendInvite, { isLoading }] = useSendInviteMutation();

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
    }),
    onSubmit: async (values) => {
      try { 
        await sendInvite({ 
          email: values.email,
        }).unwrap();
        toast.success('Invitation sent successfully!');
        refetch();
        onClose();
      } catch (error) {
        console.error('Failed to send invitation:', error);
        toast.error('Only Admins can send invitations!');
      }
    },
  });

  return (
    <div className="p-6 bg-[#1E1B2E] rounded-lg shadow-lg relative">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-white"
        aria-label="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <h2 className="text-2xl font-bold text-white mb-4">Invite User</h2>
      <form className="space-y-4" onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-gray-300 mb-1">Email <span className="text-red-500">*</span></label>
          <input
            type="email"
            id="email"
            name="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className={`w-full p-2 rounded bg-[#2D293F] text-white border ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-[#473F6B]'} focus:outline-none focus:ring-2 focus:ring-[#9D6FFF]`}
            placeholder="Enter email address"
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
          ) : null}
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 h-[36px] bg-[#9D6FFF] hover:bg-[#8A5CF7] text-white font-medium rounded transition duration-200 disabled:opacity-70"
          disabled={isLoading}
        >
          {isLoading ? <Loader color='white' size={20} /> : 'Send Invitation'}
        </button>
      </form>
    </div>
  )
}
