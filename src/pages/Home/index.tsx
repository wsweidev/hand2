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

    const [value, setValue] = useState("");
    // const productMutation = trpc.useMutation(["product.add"]);

    // const submitProduct = () => {
    //     productMutation.mutate({
    //         id: "2",
    //         name: "Nice Watch",
    //         currency: "USD",
    //         price: 99,
    //         salePrice: 79,
    //         imageUrl:
    //             "https://images.unsplash.com/photo-1564594985645-4427056e22e2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    //         rating: 5,
    //         ratingCount: 17,
    //         description:
    //             "With a sleek design and a captivating essence, this is a modern Classic made for every occasion.",
    //     });
    // };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    return (
        <div>
            {/* <Button onClick={submitProduct} size="lg" colorScheme={"blue"} /> */}

            <Box
                maxW="7xl"
                mx="auto"
                px={{ base: "4", md: "8", lg: "12" }}
                py={{ base: "6", md: "8", lg: "12" }}
            >
                {/* {!!products.data && (
                    <ProductGrid>
                        {products.data.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </ProductGrid>
                )} */}
            </Box>
        </div>
    );
};

export default Home;
