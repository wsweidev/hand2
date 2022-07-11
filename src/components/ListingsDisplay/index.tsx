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
    Avatar,
} from "@chakra-ui/react";
import { trpc } from "@src/utils/trpc";
import { ChangeEvent, useState } from "react";
import { FaDollarSign } from "react-icons/fa";
import { signIn, signOut, useSession } from "next-auth/react";
import { Listing, User } from "@prisma/client";
import dayjs from "dayjs";
import { PriceSlider } from "@src/components/GenericUIComponents/PriceSlider";
import { useRouter } from "next/router";
import AddListingModal from "@src/components/AddListingModal";

type ListingsDisplayProps = {
    userId?: string;
};

const ListingsDisplay = ({ userId }: ListingsDisplayProps) => {
    const [listingsType, setListingsType] = useState<"all" | "bid" | "sell">(
        "all"
    );
    const [searchInput, setSearchInput] = useState<string>();
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [isVisibleListingModal, setIsVisibleListingModal] = useState(false);
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

        const passesExpiryFilter = dayjs(listing.expires).isAfter(dayjs());
        const passesPriceFilter =
            listing.price >= priceRange[0]! && listing.price <= priceRange[1]!;

        const passesIdFilter = !userId || listing.userId === userId;

        return (
            passesIdFilter &&
            passesSearchFilter &&
            passesTypeFilter &&
            passesExpiryFilter &&
            passesPriceFilter
        );
    });

    return (
        <>
            <AddListingModal
                isVisible={isVisibleListingModal}
                onClose={() => {
                    setIsVisibleListingModal(false);
                }}
                onSave={() => {
                    setIsVisibleListingModal(false);
                    listings.refetch();
                }}
            />
            <Flex direction={"column"} paddingY="20px">
                <Flex direction={"column"}>
                    <HStack alignItems={"center"} justifyContent="center">
                        <FormLabel>Search:</FormLabel>
                        <Input
                            bgColor={useColorModeValue("white", "gray.700")}
                            type="search"
                            maxW={[null, null, "45vw"]}
                            value={searchInput}
                            onChange={(e) => {
                                setSearchInput(e.target.value);
                            }}
                            _focus={{
                                borderColor: "teal",
                                boxShadow: "0 0 0 2px teal",
                            }}
                        />
                    </HStack>
                    <HStack
                        alignItems={"center"}
                        justifyContent="center"
                        mt="20px"
                    >
                        <FormLabel>Price:</FormLabel>
                        <Box w={["90vw", "90vw", "45vw"]}>
                            <PriceSlider
                                setSliderValue={setPriceRange}
                                sliderValue={priceRange}
                            />
                        </Box>
                    </HStack>
                    <Box alignSelf={"center"} mt="30px">
                        <RadioGroup
                            colorScheme={"teal"}
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
                    <Center alignSelf={"center"} mt="30px">
                        <Button
                            colorScheme={"teal"}
                            onClick={() => {
                                setIsVisibleListingModal(true);
                            }}
                        >
                            + Add Listing
                        </Button>
                    </Center>
                </Flex>
                <Box mt="40px">
                    {listingsArray && listingsArray.length > 0 ? (
                        <SimpleGrid columns={[1, 2, 3, 4]} spacing={5}>
                            {listingsArray.map((listing) => (
                                <ListingCard
                                    key={listing.id}
                                    listing={listing}
                                />
                            ))}
                        </SimpleGrid>
                    ) : (
                        <Center
                            fontWeight={"semibold"}
                            fontSize={"2xl"}
                            h="400px"
                        >
                            {listings.isLoading
                                ? "Loading..."
                                : "No listings to show"}
                        </Center>
                    )}
                </Box>
            </Flex>
        </>
    );
};

export default ListingsDisplay;

type listingCardProps = {
    listing: Listing & {
        user: User;
    };
};

const ListingCard = ({ listing }: listingCardProps) => {
    const router = useRouter();
    return (
        <Flex
            direction={"column"}
            p={5}
            shadow="md"
            borderWidth="1px"
            borderRadius={"10"}
            _hover={{
                backgroundColor: useColorModeValue("teal.400", "teal.500"),
            }}
            bgColor={useColorModeValue("white", "gray.700")}
            cursor="pointer"
            onClick={() => {
                router.push(`/Listing/${listing.id}`);
            }}
        >
            <AspectRatio
                ratio={4 / 3}
                borderWidth="1px"
                borderRadius={"10"}
                backgroundColor={useColorModeValue("white", "gray.700")}
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
            <Text alignSelf={"flex-end"} mt="2px" opacity={0.7}>
                {"Expires " + dayjs().to(dayjs(listing.expires))}
            </Text>
            <Heading fontSize={["lg", "xl"]} mt="10px">
                {listing.name}
            </Heading>

            <HStack mt={4}>
                <Text fontWeight="semibold">{"Type: "}</Text>
                <Text>{listing.type === "bid" ? "Bid" : "Sell"}</Text>
            </HStack>
            <HStack mt={4}>
                <FaDollarSign color="teal" />
                <Text fontWeight="semibold">{"RM " + listing.price}</Text>
            </HStack>

            <Text
                mt={4}
                noOfLines={6}
                textAlign="left"
                mb={"20px"}
                whiteSpace="pre-line"
            >
                {listing.description}
            </Text>
            <HStack mt="auto">
                <Avatar size={"xs"} src={listing.user.image!} />
                <Text fontSize={"sm"} opacity="0.8">
                    {listing.user.name}
                </Text>
            </HStack>
        </Flex>
    );
};
