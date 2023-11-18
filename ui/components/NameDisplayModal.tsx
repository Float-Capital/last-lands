import React from "react";

export default function NameDisplayModal(props: any) {
  let { open, setOpen, selectedCountryName } = props;

  return open ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="relative w-auto max-w-3xl mx-auto my-6">
        <div className="relative flex flex-col bg-white border-0 p-4 shadow-lg">
          <p>{selectedCountryName}</p>
          <div className="flex items-center justify-end p-3 mt-1">
            <button
              className="px-6 py-2 mb-1 text-sm font-semibold text-red-500 uppercase"
              type="button"
              onClick={() => setOpen(false)}
            >
              close
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}
