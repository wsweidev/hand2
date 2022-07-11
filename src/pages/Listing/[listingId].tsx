import {
    Flex,
    useColorModeValue,
    AspectRatio,
    Center,
    Heading,
    HStack,
    Avatar,
    Image,
    Text,
    Box,
    Button,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from "@chakra-ui/react";
import { trpc } from "@src/utils/trpc";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaDollarSign } from "react-icons/fa";

const Listing = () => {
    const router = useRouter();
    const [bid, setBid] = useState<number | undefined>();
    const { listingId } = router.query as { listingId: string };
    const listingQuery = trpc.useQuery(
        ["listings.getListingById", { id: listingId }],
        { enabled: !!listingId }
    );
    const listing = listingQuery.data;

    return (
        <Flex direction="column" alignItems="center" h={"1000px"} w="100%">
            {!!listing && (
                <Flex
                    w={["100%", "75%", "50%"]}
                    direction={"column"}
                    p={5}
                    shadow="md"
                    borderWidth="1px"
                    borderRadius={"10"}
                    // _hover={{
                    //     backgroundColor: "teal.400",
                    //     _dark: { bg: "teal.500" },
                    // }}
                    bg="white"
                    _dark={{ bg: "gray.700" }}
                    onClick={() => {
                        router.push(`/Listing/${listing.id}`);
                    }}
                >
                    <AspectRatio
                        ratio={4 / 3}
                        borderWidth="1px"
                        borderRadius={"10"}
                        bg="white"
                        _dark={{ bg: "gray.700" }}
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
                        <Text fontWeight="semibold">
                            {"RM " + listing.price}
                        </Text>
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
                        <Avatar size={"xs"} src={listing.user?.image!} />
                        <Text
                            fontSize={"sm"}
                            opacity="0.8"
                            cursor={"pointer"}
                            _hover={{ fontWeight: "bold" }}
                            onClick={() => {
                                router.push(`/Profile/${listing.userId}`);
                            }}
                        >
                            {listing.user?.name +
                                (listing.isOwn ? " (You)" : "")}
                        </Text>
                    </HStack>
                    <Flex
                        mt="20px"
                        pt="20px"
                        w="100%"
                        direction={"row"}
                        justifyContent={"space-around"}
                        borderTop="1px"
                        borderTopColor={"gray.300"}
                    >
                        {!listing.isOwn && (
                            <>
                                <Button
                                    flex={1}
                                    colorScheme={"red"}
                                    fontSize={"sm"}
                                    m="2"
                                >
                                    Cancel Listing
                                </Button>
                            </>
                        )}
                        {listing.isOwn && (
                            <>
                                <Button fontSize={"sm"} flex={1} m="2">
                                    Contact Seller
                                </Button>
                                {listing.type === "sell" && (
                                    <Button
                                        colorScheme={"teal"}
                                        fontSize={"sm"}
                                        flex={1}
                                        m="2"
                                    >
                                        Purchase
                                    </Button>
                                )}
                                {listing.type === "bid" && (
                                    <Flex direction={"row"} flex={1} m="2">
                                        <NumberInput
                                            onChange={(_, valueAsNumber) => {
                                                setBid(valueAsNumber);
                                                console.log(valueAsNumber);
                                            }}
                                        >
                                            <NumberInputField
                                                borderRightRadius={0}
                                                placeholder={"RM"}
                                                flex={3}
                                            />
                                        </NumberInput>
                                        <Button
                                            borderLeftRadius={0}
                                            flex={2}
                                            fontSize={"sm"}
                                            colorScheme={"teal"}
                                        >
                                            Bid
                                        </Button>
                                    </Flex>
                                )}
                            </>
                        )}
                    </Flex>
                </Flex>
            )}
        </Flex>
    );
};

export default Listing;
