import type { NextPage } from "next";
import Head from "next/head";

import {
    AspectRatio,
    Box,
    Button,
    ButtonGroup,
    Center,
    Flex,
    HStack,
    Input,
    SimpleGrid,
    Stack,
    Wrap,
    Image,
    WrapItem,
    Text,
    FormLabel,
    RadioGroup,
    Radio,
    VStack,
    Heading,
    useColorModeValue,
} from "@chakra-ui/react";
import { trpc } from "@src/utils/trpc";
import { ChangeEvent, useState } from "react";
import { ProductGrid } from "@src/components/ProductGrid";
import { ProductCard } from "@src/components/ProductCard";
import { signIn, signOut, useSession } from "next-auth/react";
import { Listing, User } from "@prisma/client";

const Home: NextPage = () => {
    const session = useSession();
    const [listingsType, setListingsType] = useState<"all" | "bid" | "sell">(
        "all"
    );
    const [searchInput, setSearchInput] = useState<string>();
    const listings = trpc.useQuery(["listings.getAll"]);

    const listingsArray = listings.data?.filter((listing) => {
        const passesSearchFilter =
            !searchInput ||
            listing.name.toLowerCase().includes(searchInput.toLowerCase()) ||
            listing.description
                .toLowerCase()
                .includes(searchInput.toLowerCase()) ||
            listing.user.name
                ?.toLowerCase()
                .includes(searchInput.toLowerCase());

        const passesTypeFilter =
            listingsType == "all" || listing.type == listingsType;

        return passesSearchFilter && passesTypeFilter;
    });

    return (
        <Flex direction={"column"}>
            <Flex direction={"column"}>
                <HStack alignItems={"center"} justifyContent="center">
                    <FormLabel>Search:</FormLabel>
                    <Input
                        type="search"
                        maxW={[null, null, "45vw"]}
                        value={searchInput}
                        onChange={(e) => {
                            setSearchInput(e.target.value);
                        }}
                    />
                </HStack>

                <Box alignSelf={"center"} mt="20px">
                    <RadioGroup
                        onChange={(value: "sell" | "bid" | "all") => {
                            setListingsType(value);
                        }}
                        value={listingsType}
                    >
                        <Stack direction="row" spacing={5}>
                            <Radio value="all">All</Radio>
                            <Radio value="sell">For Sale</Radio>
                            <Radio value="bid">For Bidding</Radio>
                        </Stack>
                    </RadioGroup>
                </Box>
            </Flex>
            <Box mt="20px">
                {listingsArray && listingsArray.length > 0 ? (
                    <SimpleGrid columns={[1, 2, 3, 4]} spacing={5}>
                        {listingsArray.map((listing) => (
                            <ListingCard key={listing.id} listing={listing} />
                        ))}
                    </SimpleGrid>
                ) : (
                    <Center fontWeight={"semibold"} fontSize={"2xl"} h="400px">
                        {listings.isLoading
                            ? "Loading..."
                            : "No listings to show"}
                    </Center>
                )}
            </Box>
        </Flex>
    );
};

export default Home;

type listingCardProps = {
    listing: Listing & {
        user: User;
    };
};

const ListingCard = ({ listing }: listingCardProps) => {
    return (
        <Box
            p={5}
            shadow="md"
            borderWidth="1px"
            borderRadius={"10"}
            _hover={{
                backgroundColor: useColorModeValue("teal.400", "teal.500"),
            }}
            cursor="pointer"
        >
            <AspectRatio
                ratio={4 / 3}
                borderWidth="1px"
                borderRadius={"10"}
                backgroundColor={useColorModeValue("gray.100", "gray.700")}
            >
                <Center>
                    <Image
                        width="100%"
                        height="100%"
                        src={listing.mainImageUrl!}
                        alt="listing image"
                        objectFit="contain"
                        alignSelf={"center"}
                    />
                </Center>
            </AspectRatio>
            <Heading fontSize={["lg", "xl"]} mt="10px">
                {listing.name}
            </Heading>
            <Text mt={4}>{listing.description}</Text>
        </Box>
    );
};
