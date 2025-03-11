import {
  Dialog as BaseDialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { type ReactNode, useState } from 'react';

type DialogProps = {
  title: string;
  open: boolean;
  children: ReactNode;
  footer?: ReactNode;
  setOpen: (value: boolean) => void;
};

export default function Dialog({
  title,
  open,
  children,
  setOpen,
  footer = null,
}: DialogProps) {
  return (
    <BaseDialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-zinc-800/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
      />
      <div className="fixed inset-0" />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col divide-y divide-zinc-700 bg-zinc-800 shadow-xl">
                <div className="flex min-h-0 flex-1 flex-col overflow-y-auto py-6">
                  <div className="px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <DialogTitle className="text-base font-semibold text-white">
                        {title}
                      </DialogTitle>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          className="relative cursor-pointer rounded-md bg-zinc text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-zinc-500 focus:outline-hidden"
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="relative mt-6 flex-1 px-4 sm:px-6">
                    {children}
                  </div>
                </div>
                {footer && (
                  <div className="flex gap-2 shrink-0 justify-end px-4 py-4">
                    {footer}
                  </div>
                )}
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </BaseDialog>
  );
}
