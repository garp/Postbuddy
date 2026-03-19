export const selectStyles = {
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: 'white',
    borderColor: '#4B5563',
    borderRadius: '0.5rem',
    padding: '0.5rem 1rem',
    height: '46px'
  },
  dropdown: {
    backgroundColor: '#1d1b27',
    borderColor: '#4B5563',
    color: 'white',
    borderRadius: '0.5rem',
  },
  option: {
    backgroundColor: '#1d1b27',
    color: 'white !important',
    '&[data-selected]': { backgroundColor: '#7C3AED', color: 'white !important' },
    '&[data-hovered]': { backgroundColor: '#2C2E33', color: 'white !important' }
  }
};

export const inputClass = "w-full px-4 py-3 rounded-[6px] bg-white/[0.05] border border-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-white resize-none";
export const errorInputClass = "w-full px-4 py-3 rounded-[6px] bg-white/[0.05] border border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 text-white resize-none";