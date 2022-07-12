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
} from "@chakra-ui/react";
import { trpc } from "@src/utils/trpc";
import { ChangeEvent, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

const Chat: NextPage = () => {
    const session = useSession();
    const getChatsQuery = trpc.useQuery(["chats.getUserChats"]);
    const chats = getChatsQuery.data;
    const chatUsers = !!chats ? Object.keys(chats) : undefined;
    const [selectedUser, setSelectedUser] = useState<string | undefined>(
        undefined
    );

    return (
        <>
            <Flex direction={"row"}>
                <VStack>
                    {!!chats &&
                        !!chatUsers &&
                        chatUsers.map((userName) => {
                            return (
                                <Box key={userName}>
                                    <Button
                                        onClick={() => {
                                            setSelectedUser(userName);
                                        }}
                                    >
                                        {userName}
                                    </Button>
                                </Box>
                            );
                        })}
                </VStack>
                <Box width={"23px"} color="black" bg="black" />
                {!!selectedUser && !!chats && (
                    <VStack>
                        {chats[selectedUser]?.map((message) => {
                            if (message.senderId === session.data?.user?.id) {
                                return (
                                    <Box>
                                        {!!message.mentionedListing && (
                                            <Text>
                                                {"Includes listing: " +
                                                    message.mentionedListing
                                                        .name}
                                            </Text>
                                        )}
                                        <Text>
                                            {"Message From Me:" +
                                                message.message}
                                        </Text>
                                    </Box>
                                );
                            } else {
                                return (
                                    <Box>
                                        {!!message.mentionedListing && (
                                            <Text>
                                                {"Includes listing: " +
                                                    message.mentionedListing
                                                        .name}
                                            </Text>
                                        )}
                                        <Text>
                                            {`Message From ${message.sender.name}: ` +
                                                message.message}
                                        </Text>
                                    </Box>
                                );
                            }
                        })}
                    </VStack>
                )}
            </Flex>
        </>
    );
};

export default Chat;
