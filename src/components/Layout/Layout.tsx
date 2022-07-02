import React from "react";
import type { FC, PropsWithChildren } from "react";
import NavBar from "@src/components/Layout/Navbar";
import Footer from "@src/components/Layout/Footer";
import { Box } from "@chakra-ui/react";

const Layout: FC<PropsWithChildren> = ({ children }) => {
    return (
        <>
            <NavBar />
            <Box minHeight={"calc(92.5vh)"} h="fit-content" p="10">
                {children}
            </Box>
            <Footer />
        </>
    );
};

export default Layout;
