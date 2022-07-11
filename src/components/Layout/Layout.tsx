import React from "react";
import type { FC, PropsWithChildren } from "react";
import NavBar from "@src/components/Layout/Navbar";
import Footer from "@src/components/Layout/Footer";
import { Box, useDisclosure, useColorModeValue } from "@chakra-ui/react";
import { DrawerContext } from "./DrawerContext";

const Layout: FC<PropsWithChildren> = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
            <DrawerContext.Provider value={{ isOpen, onOpen, onClose }}>
                <NavBar />
                <Box
                    minHeight={"calc(92.5vh)"}
                    h="fit-content"
                    p="10"
                    backgroundColor={useColorModeValue("gray.50", "gray.800")}
                >
                    {children}
                </Box>
                <Footer />
            </DrawerContext.Provider>
        </>
    );
};

export default Layout;
