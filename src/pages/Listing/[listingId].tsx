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
    useToast,
} from "@chakra-ui/react";
import MessageModal from "@src/components/MessageModal";
import { trpc } from "@src/utils/trpc";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaDollarSign, FaRegMoneyBillAlt, FaRegUser } from "react-icons/fa";
import { GiTakeMyMoney } from "react-icons/gi";

const Listing = () => {
    const session = useSession();
    const toast = useToast();
    const router = useRouter();
    const { listingId } = router.query as { listingId: string };

    const [bid, setBid] = useState<number | undefined>();
    const [isShowMessageModal, setIsShowMessageModal] = useState(false);
    const [receiverId, setReceiverId] = useState<string | undefined>();

    const listingQuery = trpc.useQuery(
        ["listings.getListingById", { id: listingId }],
        { enabled: !!listingId }
    );
    const listing = listingQuery.data;

    const ownProfileQuery = trpc.useQuery(["profiles.getOwnProfile"], {
        enabled: !!session.data?.user?.id,
    });
    const ownProfile = ownProfileQuery.data;

    const addBidMutation = trpc.useMutation("listings.addBid", {
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Bid added successfully",
                status: "success",
                duration: 4000,
                isClosable: true,
            });
            listingQuery.refetch();
        },
        onError: () => {
            toast({
                title: "Error",
                description: "We were unable to add bid",
                status: "error",
                duration: 4000,
                isClosable: true,
            });
        },
    });

    const purchaseMutation = trpc.useMutation("listings.purchase", {
        onSuccess: () => {
            toast({
                title: "Success",
                description:
                    "Item purchased successfully, please contact the seller",
                status: "success",
                duration: 4000,
                isClosable: true,
            });
            listingQuery.refetch();
        },
        onError: () => {
            toast({
                title: "Error",
                description: "We were unable to proccess the purchase",
                status: "error",
                duration: 4000,
                isClosable: true,
            });
        },
    });

    const finaliseBidMutation = trpc.useMutation("listings.finaliseBid", {
        onSuccess: () => {
            toast({
                title: "Success",
                description:
                    "Bid confirmed successfully, please contact the buyer",
                status: "success",
                duration: 4000,
                isClosable: true,
            });
            listingQuery.refetch();
        },
        onError: () => {
            toast({
                title: "Error",
                description: "We were unable to confirm the bid",
                status: "error",
                duration: 4000,
                isClosable: true,
            });
        },
    });

    const cancelListingMutation = trpc.useMutation("listings.cancelListing", {
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Listing canceled successfully",
                status: "success",
                duration: 4000,
                isClosable: true,
            });
            listingQuery.refetch();
        },
        onError: () => {
            toast({
                title: "Error",
                description: "We were unable to cancel listing",
                status: "error",
                duration: 4000,
                isClosable: true,
            });
        },
    });

    const addBid = () => {
        if (!bid) {
            toast({
                title: "Invalid input",
                description: "Please ensure all required fields are filled",
                status: "error",
                duration: 4000,
                isClosable: true,
            });
        } else if (bid <= listing?.price!) {
            toast({
                title: "Invalid number",
                description: "Bid must be higher than current bid/price",
                status: "error",
                duration: 4000,
                isClosable: true,
            });
        } else {
            addBidMutation.mutate({
                amount: bid,
                listingId: listing?.id!,
            });
        }
    };

    const purchaseItem = () => {
        if (ownProfile?.wallet! < listing?.price!) {
            toast({
                title: "Unable to purchase",
                description: "You don't have the required amount",
                status: "error",
                duration: 4000,
                isClosable: true,
            });
        } else {
            purchaseMutation.mutate({
                listingId: listing?.id!,
            });
        }
    };

    const confirmBid = () => {
        finaliseBidMutation.mutate({
            listingId: listing?.id!,
        });
    };

    const cancelListing = () => {
        cancelListingMutation.mutate({
            listingId: listing?.id!,
        });
    };

    const showMessageModal = (id: string) => {
        setIsShowMessageModal(true);
        setReceiverId(id);
    };

    return (
        <>
            {!!receiverId && (
                <MessageModal
                    isVisible={isShowMessageModal}
                    onClose={() => {
                        setIsShowMessageModal(false);
                    }}
                    onSave={() => {
                        setIsShowMessageModal(false);
                        router.push("/Chat");
                    }}
                    listing={listing}
                    receiverId={receiverId}
                />
            )}
            <Flex direction="column" alignItems="center" w="100%">
                {!!listing && (
                    <Flex
                        w={["100%", "75%", "50%"]}
                        direction={"column"}
                        p={5}
                        shadow="md"
                        borderWidth="1px"
                        borderRadius={"10"}
                        bg="white"
                        _dark={{ bg: "gray.700" }}
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
                                    borderRadius={"10"}
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
                            {listing.type === "bid" ? (
                                <GiTakeMyMoney color="teal" />
                            ) : (
                                <FaRegMoneyBillAlt color="teal" />
                            )}
                            <Text fontWeight="semibold">{"Type: "}</Text>
                            <Text>
                                {listing.type === "bid" ? "Bid" : "Sell"}
                            </Text>
                        </HStack>
                        <HStack mt={4}>
                            <FaDollarSign color="teal" />
                            <Text fontWeight="semibold">
                                {listing.type === "bid"
                                    ? "Highest Bid: "
                                    : "Price: "}
                            </Text>
                            <Text>{"RM " + listing.price}</Text>
                            {!listing.highestBidderId &&
                                listing.type === "bid" && (
                                    <Text>{" (No bids)"}</Text>
                                )}
                        </HStack>

                        {listing.status === "listed" &&
                            listing.type === "bid" &&
                            !!listing.highestBidder && (
                                <HStack mt={4}>
                                    <FaRegUser color="teal" />
                                    <Text fontWeight="semibold">
                                        {"Bid by: "}
                                    </Text>
                                    <Text
                                        cursor={"pointer"}
                                        _hover={{
                                            fontWeight: "semibold",
                                            borderColor: "teal",
                                        }}
                                        onClick={() => {
                                            router.push(
                                                `/Profile/${listing.highestBidderId}`
                                            );
                                        }}
                                        borderWidth="0.5px"
                                        borderRadius={"10px"}
                                        p="3px"
                                    >
                                        {listing.highestBidder.name}
                                    </Text>
                                </HStack>
                            )}
                        {listing.status === "sold" && !!listing.buyer && (
                            <HStack mt={4}>
                                <FaRegUser color="teal" />
                                <Text fontWeight="semibold">{"Sold to: "}</Text>
                                <Text
                                    cursor={"pointer"}
                                    _hover={{
                                        fontWeight: "semibold",
                                        borderColor: "teal",
                                    }}
                                    onClick={() => {
                                        router.push(
                                            `/Profile/${listing.soldToId}`
                                        );
                                    }}
                                    borderWidth="0.5px"
                                    borderRadius={"10px"}
                                    p="3px"
                                >
                                    {listing.buyer.name}
                                </Text>
                            </HStack>
                        )}

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
                            {listing.isOwn && (
                                <>
                                    {listing.status === "listed" &&
                                        !listing.soldToId &&
                                        !listing.highestBidderId && (
                                            <Button
                                                flex={1}
                                                colorScheme={"red"}
                                                fontSize={"sm"}
                                                m="2"
                                                onClick={cancelListing}
                                            >
                                                Cancel Listing
                                            </Button>
                                        )}
                                    {listing.type === "bid" &&
                                        dayjs(listing.expires).isBefore(
                                            dayjs()
                                        ) &&
                                        !!listing.highestBidderId &&
                                        listing.status === "listed" && (
                                            <Button
                                                flex={1}
                                                colorScheme={"teal"}
                                                fontSize={"sm"}
                                                m="2"
                                                onClick={confirmBid}
                                            >
                                                Confirm Bid
                                            </Button>
                                        )}
                                    {listing.status === "sold" &&
                                        !!listing.soldToId && (
                                            <Button
                                                fontSize={"sm"}
                                                flex={1}
                                                m="2"
                                                onClick={() => {
                                                    showMessageModal(
                                                        listing.soldToId!
                                                    );
                                                }}
                                            >
                                                Contact Buyer
                                            </Button>
                                        )}
                                </>
                            )}
                            {!listing.isOwn && (
                                <>
                                    <Button
                                        fontSize={"sm"}
                                        flex={1}
                                        m="2"
                                        onClick={() => {
                                            showMessageModal(listing.userId!);
                                        }}
                                    >
                                        Contact Seller
                                    </Button>
                                    {listing.type === "sell" &&
                                        listing.status === "listed" && (
                                            <Button
                                                colorScheme={"teal"}
                                                fontSize={"sm"}
                                                flex={1}
                                                m="2"
                                                onClick={purchaseItem}
                                            >
                                                Purchase
                                            </Button>
                                        )}
                                    {listing.type === "bid" && (
                                        <Flex direction={"row"} flex={1} m="2">
                                            <NumberInput
                                                onChange={(
                                                    _,
                                                    valueAsNumber
                                                ) => {
                                                    setBid(valueAsNumber);
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
                                                onClick={addBid}
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
        </>
    );
};

export default Listing;
