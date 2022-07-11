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
    useToast,
    Center,
    HStack,
    Text,
} from "@chakra-ui/react";
import { useState } from "react";
// @ts-ignore
import ReactStars from "react-rating-stars-component";

import { trpc } from "@src/utils/trpc";

type RatingModalProps = {
    receiverId: string;
    isVisible: boolean;
    onClose: () => void;
    onSave: () => void;
};

const RatingModal = (props: RatingModalProps) => {
    const [stars, setStars] = useState<number>(0);
    const toast = useToast();

    const rate = trpc.useMutation(["profiles.addRating"], {
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Rating added successfully",
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
                description: "Rating was not successful",
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
        setStars(0);
    };

    const handleSave = () => {
        if (!stars) {
            toast({
                title: "Invalid input",
                description: "Please ensure all required fields are filled",
                status: "error",
                duration: 4000,
                isClosable: true,
            });
        } else {
            rate.mutate({
                receiverId: props.receiverId,
                stars,
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
                <ModalHeader>Rate user</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <FormControl isRequired>
                        <Center pb="5px">
                            <HStack>
                                <ReactStars
                                    count={5}
                                    size={24}
                                    onChange={(selectedNumber: number) => {
                                        setStars(selectedNumber);
                                    }}
                                    value={stars}
                                    activeColor="#ffd700"
                                />
                                <Text>{stars + " Stars"}</Text>
                            </HStack>
                        </Center>
                    </FormControl>
                </ModalBody>

                <ModalFooter pb="40px">
                    <Button
                        colorScheme="teal"
                        mr={3}
                        onClick={handleSave}
                        isLoading={rate.isLoading}
                    >
                        Save
                    </Button>
                    <Button onClick={handleClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default RatingModal;
