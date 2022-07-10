import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

import {
    Box,
    Button,
    ButtonGroup,
    Input,
    Stack,
    Wrap,
    WrapItem,
} from "@chakra-ui/react";
import { trpc } from "@src/utils/trpc";
import { ChangeEvent, useState } from "react";
import { ProductGrid } from "@src/components/ProductGrid";
import { ProductCard } from "@src/components/ProductCard";
import { signIn, signOut, useSession } from "next-auth/react";

const Home: NextPage = () => {
    const session = useSession();

    return <></>;
};

export default Home;
