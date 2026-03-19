import { Loader } from "@mantine/core";

export default function ActivateVoice({ onClose, onConfirm, voiceName, isLoadingActivateBrandVoice }: { 
  onClose: () => void;
  onConfirm: () => void;
  voiceName: string;
  isLoadingActivateBrandVoice: boolean;
}) {
  return (
    <div className="text-white py-2">
      <div className="bg-[#1d1b27] border border-purple-900/40 rounded-xl shadow-lg shadow-purple-900/10 p-5">
        <div className="mb-6">
          <div className="flex items-center mb-5">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Activate Brand Voice</h3>
              <p className="text-gray-400 text-sm">Set this voice as your active brand identity</p>
            </div>
          </div>
          
          <div className="bg-purple-900/20 border border-purple-800/30 rounded-lg p-4 mb-5">
            <p className="mb-3">Are you sure you want to set <span className="font-semibold text-purple-400">{voiceName}</span> as your active brand voice?</p>
            <p className="text-gray-300 text-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              This voice will be used for all your content generation until you change it.
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
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white rounded-md transition-colors flex items-center font-medium"
          >
            {isLoadingActivateBrandVoice ? (
              <Loader size="sm" color="#fff" className="mr-2" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {isLoadingActivateBrandVoice ? "Activating..." : "Activate Voice"}
          </button>
        </div>
      </div>
    </div>
  );
}
