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
    Text,
    Flex,
    VStack,
    Divider,
    Avatar,
    Heading,
    HStack,
    useToast,
    Center,
} from "@chakra-ui/react";
import { trpc } from "@src/utils/trpc";
import { ChangeEvent, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import dayjs from "dayjs";
import { AutoResizeTextarea } from "@src/components/GenericUIComponents/AutoResizeTextarea";
import { useRouter } from "next/router";

const Chat: NextPage = () => {
    const session = useSession();
    const toast = useToast();
    const router = useRouter();
    const getChatsQuery = trpc.useQuery(["chats.getUserChats"], {
        refetchInterval: 5000,
    });
    const chats = getChatsQuery.data;
    const chatUsers = !!chats ? Object.keys(chats) : undefined;
    const [selectedUser, setSelectedUser] = useState<string | undefined>(
        undefined
    );
    const [receiverId, setReceiverId] = useState<string | undefined>();
    const [chatMessage, setChatMessage] = useState<string | undefined>();

    const sendMessageMutation = trpc.useMutation(["chats.sendMessage"], {
        onSuccess: () => {
            setChatMessage("");
            getChatsQuery.refetch();
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Couldnt deliver message",
                status: "error",
                duration: 4000,
                isClosable: true,
            });
        },
    });
    const handleSave = () => {
        if (!chatMessage || !receiverId) {
            toast({
                title: "Invalid input",
                description: "Please ensure all required fields are filled",
                status: "error",
                duration: 4000,
                isClosable: true,
            });
        } else {
            sendMessageMutation.mutate({
                message: chatMessage,
                receiverId: receiverId,
            });
        }
    };

    return (
        <>
            {getChatsQuery.isLoading && (
                <Center fontWeight={"semibold"} fontSize={"2xl"} h="400px">
                    {"Loading..."}
                </Center>
            )}
            <Flex direction={["column", "column", "row"]} h="80vh">
                {!!chats && (
                    <Box
                        borderRadius="15px"
                        bg={"gray.200"}
                        _dark={{ bg: "gray.700" }}
                        alignSelf="center"
                    >
                        <Stack
                            overflow={"auto"}
                            p={"15px"}
                            spacing={"10px"}
                            w={["80vw", "80vw", "fit-content"]}
                            h={["fit-content", "fit-content", "80vh"]}
                            borderRadius="15px"
                            direction={["row", "row", "column"]}
                            sx={{
                                "&::-webkit-scrollbar": {
                                    width: "16px",
                                    borderRadius: "8px",
                                    backgroundColor: `rgba(0, 0, 0, 0.1)`,
                                },
                                "&::-webkit-scrollbar-thumb": {
                                    backgroundColor: `rgba(0, 0, 0, 0.05)`,
                                },
                            }}
                        >
                            {!!chats &&
                                !!chatUsers &&
                                chatUsers.map((userName) => {
                                    const otherUser =
                                        chats[userName]?.[0]?.receiverId ===
                                        session.data?.user?.id
                                            ? chats[userName]?.[0]?.sender
                                            : chats[userName]?.[0]?.receiver;
                                    return (
                                        <Box key={userName}>
                                            <Button
                                                onClick={() => {
                                                    setSelectedUser(userName);
                                                    setReceiverId(
                                                        otherUser?.id
                                                    );
                                                }}
                                                alignItems="center"
                                                colorScheme={
                                                    userName === selectedUser
                                                        ? "teal"
                                                        : undefined
                                                }
                                            >
                                                <Avatar
                                                    size={"xs"}
                                                    mr="5px"
                                                    src={otherUser?.image ?? ""}
                                                />
                                                {userName}
                                            </Button>
                                        </Box>
                                    );
                                })}
                        </Stack>
                    </Box>
                )}

                <Box
                    w={"100%"}
                    bg={"gray.200"}
                    _dark={{ bg: "gray.700" }}
                    borderRadius={"10px"}
                    alignSelf="center"
                    m={"10px"}
                >
                    {!!selectedUser && (
                        <Flex
                            direction={"column"}
                            w={"100%"}
                            h={["65vh", "65vh", "80vh"]}
                        >
                            {!!selectedUser && !!chats && (
                                <Flex
                                    overflow={"auto"}
                                    p={"15px"}
                                    borderRadius="15px"
                                    direction={"column-reverse"}
                                    sx={{
                                        "&::-webkit-scrollbar": {
                                            width: "16px",
                                            borderRadius: "8px",
                                            backgroundColor: `rgba(0, 0, 0, 0.05)`,
                                        },
                                        "&::-webkit-scrollbar-thumb": {
                                            backgroundColor: `rgba(0, 0, 0, 0.05)`,
                                        },
                                    }}
                                >
                                    {chats[selectedUser]?.map((message) => {
                                        if (
                                            message.senderId ===
                                            session.data?.user?.id
                                        ) {
                                            return (
                                                <Flex
                                                    direction={"column"}
                                                    alignSelf={"flex-end"}
                                                    borderRadius="15px"
                                                    p="10px"
                                                    m="5px"
                                                    whiteSpace={"pre-line"}
                                                    maxW="80%"
                                                    bg={"gray.300"}
                                                    _dark={{ bg: "gray.600" }}
                                                    minW={["50%", "30%"]}
                                                >
                                                    {!!message.mentionedListing && (
                                                        <Flex
                                                            direction={"row"}
                                                            alignItems="center"
                                                            borderBottomWidth={
                                                                "1px"
                                                            }
                                                            pb="5px"
                                                            mb="5px"
                                                        >
                                                            <Avatar
                                                                size="md"
                                                                src={
                                                                    message
                                                                        .mentionedListing
                                                                        .mainImageUrl!
                                                                }
                                                            />
                                                            <Text
                                                                ml="5px"
                                                                cursor={
                                                                    "pointer"
                                                                }
                                                                _hover={{
                                                                    fontWeight:
                                                                        "semibold",
                                                                }}
                                                                onClick={() => {
                                                                    router.push(
                                                                        `/Listing/${message?.mentionedListing?.id}`
                                                                    );
                                                                }}
                                                            >
                                                                {
                                                                    message
                                                                        .mentionedListing
                                                                        .name
                                                                }
                                                            </Text>
                                                        </Flex>
                                                    )}

                                                    <Text textAlign={"start"}>
                                                        {message.message}
                                                    </Text>
                                                    <Text
                                                        alignSelf={"flex-end"}
                                                        mt="2px"
                                                        opacity={0.5}
                                                        fontSize={["xs", "sm"]}
                                                    >
                                                        {dayjs(
                                                            message.createdAt
                                                        ).format(
                                                            "DD/MM hh:mm a"
                                                        )}
                                                    </Text>
                                                </Flex>
                                            );
                                        } else {
                                            return (
                                                <Flex
                                                    direction={"column"}
                                                    alignSelf={"flex-start"}
                                                    borderRadius="15px"
                                                    p="10px"
                                                    m="5px"
                                                    whiteSpace={"pre-line"}
                                                    maxW="80%"
                                                    bg={"teal.300"}
                                                    _dark={{ bg: "teal.600" }}
                                                    minW={["50%", "30%"]}
                                                >
                                                    {!!message.mentionedListing && (
                                                        <Flex
                                                            direction={"row"}
                                                            alignItems="center"
                                                            borderBottomWidth={
                                                                "1px"
                                                            }
                                                            pb="5px"
                                                            mb="5px"
                                                        >
                                                            <Avatar
                                                                size="md"
                                                                src={
                                                                    message
                                                                        .mentionedListing
                                                                        .mainImageUrl!
                                                                }
                                                            />
                                                            <Text
                                                                ml="5px"
                                                                cursor={
                                                                    "pointer"
                                                                }
                                                                _hover={{
                                                                    fontWeight:
                                                                        "semibold",
                                                                }}
                                                                onClick={() => {
                                                                    router.push(
                                                                        `/Listing/${message?.mentionedListing?.id}`
                                                                    );
                                                                }}
                                                            >
                                                                {
                                                                    message
                                                                        .mentionedListing
                                                                        .name
                                                                }
                                                            </Text>
                                                        </Flex>
                                                    )}
                                                    <Text textAlign={"start"}>
                                                        {message.message}
                                                    </Text>

                                                    <Text
                                                        alignSelf={"flex-end"}
                                                        mt="2px"
                                                        opacity={0.5}
                                                        fontSize={["xs", "sm"]}
                                                    >
                                                        {dayjs(
                                                            message.createdAt
                                                        ).format(
                                                            "DD/MM hh:mm a"
                                                        )}
                                                    </Text>
                                                </Flex>
                                            );
                                        }
                                    })}
                                </Flex>
                            )}
                            <HStack
                                marginTop={"auto"}
                                w={"100%"}
                                p="10px"
                                borderBottomRadius={"10px"}
                            >
                                <AutoResizeTextarea
                                    value={chatMessage}
                                    bg="white"
                                    _dark={{ bg: "gray.700" }}
                                    onChange={(e) => {
                                        setChatMessage(e.target.value);
                                    }}
                                />
                                <Button
                                    colorScheme={"teal"}
                                    onClick={handleSave}
                                >
                                    Send
                                </Button>
                            </HStack>
                        </Flex>
                    )}
                </Box>
            </Flex>
        </>
    );
};

export default Chat;
