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
} from "@chakra-ui/react";
import { useState } from "react";

import { trpc } from "@src/utils/trpc";

type WithdrawModalProps = {
    isVisible: boolean;
    onClose: () => void;
    onSave: () => void;
};

const WithdrawModal = (props: WithdrawModalProps) => {
    const [amount, setAmount] = useState<number>(0);
    const toast = useToast();

    const withdraw = trpc.useMutation(["profiles.withdraw"], {
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Withdraw was successful",
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
                description: "Withdraw was not successful, or amount exceeds wallet amount",
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
        setAmount(0);
    };

    const handleSave = () => {
        if (!amount) {
            toast({
                title: "Invalid input",
                description: "Please ensure all required fields are filled",
                status: "error",
                duration: 4000,
                isClosable: true,
            });
        } else {
            withdraw.mutate({
                amount,
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
                <ModalHeader>Withdraw from Wallet</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <FormControl isRequired>
                        <FormLabel>Amount</FormLabel>
                        <NumberInput
                            onChange={(_, valueAsNumber) => {
                                setAmount(valueAsNumber);
                            }}
                        >
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </FormControl>
                </ModalBody>

                <ModalFooter pb="40px">
                    <Button
                        colorScheme="teal"
                        mr={3}
                        onClick={handleSave}
                        isLoading={withdraw.isLoading}
                    >
                        Withdraw
                    </Button>
                    <Button onClick={handleClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default WithdrawModal;
