import { Loader } from "@mantine/core";

export default function DeleteVoice({ onClose, onConfirm, voiceName, isLoadingDeleteBrandVoice }: { 
  onClose: () => void;
  onConfirm: () => void;
  voiceName: string;
  isLoadingDeleteBrandVoice: boolean;
}) {
  return (
    <div className="text-white py-2">
      <div className="bg-[#1d1b27] border rounded-xl shadow-lg shadow-red-900/10 p-5">
        <div className="mb-6">
          <div className="flex items-center mb-5">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Delete Brand Voice</h3>
              <p className="text-gray-400 text-sm">Permanently remove this voice from your account</p>
            </div>
          </div>
          
          <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-4 mb-5">
            <p className="mb-3">Are you sure you want to delete <span className="font-semibold text-red-400">{voiceName}</span>?</p>
            <p className="text-gray-300 text-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              This action cannot be undone and any content associated with this voice will remain unchanged.
            </p>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-2 border-t border-gray-700">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-md transition-colors flex items-center"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white rounded-md transition-colors flex items-center font-medium"
          >
            {isLoadingDeleteBrandVoice ? (
              <Loader size="sm" color="#fff" className="mr-2" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
            {isLoadingDeleteBrandVoice ? "Deleting..." : "Delete Voice"}
          </button>
        </div>
      </div>
    </div>
  );
}
