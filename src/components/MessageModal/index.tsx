import {
    Box,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    useToast,
    Flex,
    Checkbox,
    Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { trpc } from "@src/utils/trpc";
import { AutoResizeTextarea } from "../GenericUIComponents/AutoResizeTextarea";
import { Listing } from "@prisma/client";
import { InferQueryOutput } from "@src/utils/trpc-types-helper";

type MessageModalProps = {
    isVisible: boolean;
    onClose: () => void;
    onSave: () => void;
    receiverId: string;
    listing?: InferQueryOutput<"listings.getListingById">;
};

const MessageModal = (props: MessageModalProps) => {
    const [chatMessage, setChatMessage] = useState<string | undefined>();
    const [includeListing, setIncludeListing] = useState(false);
    const toast = useToast();

    const sendMessageMutation = trpc.useMutation(["chats.sendMessage"], {
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Message sent successfully",
                status: "success",
                duration: 4000,
                isClosable: true,
            });
            resetFields();
            props.onSave();
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

    const handleClose = () => {
        resetFields();
        props.onClose();
    };

    const resetFields = () => {
        setChatMessage(undefined);
        setIncludeListing(false);
    };

    const handleSave = () => {
        if (!chatMessage) {
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
                receiverId: props.receiverId,
                mentionedListing:
                    includeListing && !!props.listing
                        ? props.listing.id
                        : undefined,
            });
        }
    };

    return (
        <Modal
            closeOnOverlayClick={false}
            isOpen={props.isVisible}
            onClose={handleClose}
            preserveScrollBarGap
        >
            <ModalOverlay />
            <ModalContent
                mt={"100px"}
                w="600px"
                paddingInline={["0", "10", "50"]}
                maxW={"85vw"}
                pt={6}
            >
                <ModalHeader>Send Message</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <Flex direction="row" alignItems={"center"}>
                        <FormLabel>{"Mention Listing"}</FormLabel>
                        <Checkbox
                            checked={includeListing}
                            onChange={(e) => {
                                setIncludeListing(e.target.checked);
                            }}
                        />
                    </Flex>
                    <FormControl isRequired>
                        <FormLabel>Message</FormLabel>
                        <AutoResizeTextarea
                            placeholder="Message..."
                            onChange={(e) => {
                                setChatMessage(e.target.value);
                            }}
                            value={chatMessage}
                        />
                    </FormControl>
                </ModalBody>

                <ModalFooter pb="40px">
                    <Button
                        colorScheme="teal"
                        mr={3}
                        onClick={handleSave}
                        isLoading={sendMessageMutation.isLoading}
                    >
                        Send
                    </Button>
                    <Button onClick={handleClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default MessageModal;
