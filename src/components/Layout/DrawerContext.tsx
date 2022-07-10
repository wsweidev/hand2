import { createContext } from "react";

export const DrawerContext = createContext({
    isOpen: false,
    onOpen: () => {},
    onClose: () => {},
});
