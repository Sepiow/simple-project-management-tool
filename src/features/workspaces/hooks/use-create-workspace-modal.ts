import { useState } from "react";

let listeners: Array<(isOpen: boolean) => void> = [];
let globalIsOpen = false;

export const useCreateWorkspaceModal = () => {
  const [isOpen, setIsOpen] = useState(globalIsOpen);

  const open = () => {
    globalIsOpen = true;
    setIsOpen(true);
    listeners.forEach((l) => l(true));
  };

  const close = () => {
    globalIsOpen = false;
    setIsOpen(false);
    listeners.forEach((l) => l(false));
  };

  const setOpen = (openState: boolean) => {
    globalIsOpen = openState;
    setIsOpen(openState);
    listeners.forEach((l) => l(openState));
  };

  return {
    isOpen,
    open,
    close,
    setIsOpen: setOpen,
  };
};
