import React from "react";

interface ModaleProps {
  isOpen: boolean;
  onClose: () => void;
  onDeactivate: () => void;
  onDelete: () => void;
}

const ModaleDesactivateDeleteUser: React.FC<ModaleProps> = ({
  isOpen,
  onClose,
  onDeactivate,
  onDelete,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Confirm Action</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to deactivate or delete this user? This action
          cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onDeactivate}
            className="px-4 py-2 rounded-xl bg-yellow-500 text-white hover:bg-yellow-600"
          >
            Deactivate
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModaleDesactivateDeleteUser;
