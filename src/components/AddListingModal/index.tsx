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
    Input,
    Image,
    Text,
    Textarea,
    AspectRatio,
    Center,
    Icon,
    Select,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import { AddIcon } from "@chakra-ui/icons";
import dayjs from "dayjs";
import { AutoResizeTextarea } from "../GenericUIComponents/AutoResizeTextarea";
import { trpc } from "@src/utils/trpc";

type AddListingModalProps = {
    isVisible: boolean;
    onClose: () => void;
    onSave: () => void;
};

const AddListingModal = (props: AddListingModalProps) => {
    const [imageBase64, setImageBase64] = useState<string | undefined>();
    const [method, setMethod] = useState<"bid" | "sell" | undefined>("sell");
    const [price, setPrice] = useState<number>(0);
    const [expiryDate, setExpiryDate] = useState<Date | undefined>();
    const [name, setName] = useState<string | undefined>();
    const [description, setDescription] = useState<string | undefined>();

    const addListing = trpc.useMutation(["listings.add"], {
        onSuccess: () => {
            alert("Listing added successfully");
            resetFields();
            props.onSave();
        },
        onError: () => {
            alert("Error crating a new listing");
        },
    });

    const handleClose = () => {
        resetFields();
        props.onClose();
    };

    const getBase64 = (file: File): Promise<string | undefined> => {
        return new Promise((resolve, reject) => {
            // Make new FileReader
            let reader = new FileReader();

            // Convert the file to base64 text
            reader.readAsDataURL(file);

            // on reader load somthing...
            reader.onload = () => {
                // Make a fileInfo Object
                const baseURL = reader.result as string;
                if (baseURL) {
                    console.log(baseURL);
                    resolve(baseURL);
                } else {
                    reject("");
                }
            };
        });
    };

    const handleImagePick = async (e: ChangeEvent<HTMLInputElement>) => {
        let file = e.target.files?.item(0);
        if (file) {
            try {
                const imageInBase46 = await getBase64(file);
                setImageBase64(imageInBase46);
            } catch (err) {
                alert("Unable to select this image");
                setImageBase64(undefined);
            }
        }
    };

    const resetFields = () => {
        setImageBase64(undefined);
        setMethod("sell");
        setPrice(0);
        setExpiryDate(undefined);
        setName(undefined);
        setDescription(undefined);
    };

    const handleSave = () => {
        if (
            !description ||
            !name ||
            !expiryDate ||
            !price ||
            !method ||
            !imageBase64
        ) {
            alert("Please ensure all required fields are filled");
        } else {
            addListing.mutate({
                description,
                name,
                expires: expiryDate,
                price,
                type: method,
                mainImageUrl: imageBase64,
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
                <ModalHeader>Add Listing</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <FormLabel>Item image</FormLabel>
                    <AspectRatio
                        ratio={4 / 3}
                        mt={4}
                        borderWidth="1px"
                        borderRadius={"10"}
                    >
                        <>
                            <Center>
                                {!!imageBase64 ? (
                                    <Image
                                        width="100%"
                                        height="100%"
                                        src={imageBase64}
                                        alt="listing image"
                                        objectFit="contain"
                                        alignSelf={"center"}
                                    />
                                ) : (
                                    <Center boxSize={"100%"}>
                                        <AddIcon
                                            p="10px"
                                            boxSize={["40%", "50%"]}
                                            color={["teal.400"]}
                                        />
                                    </Center>
                                )}
                            </Center>
                            <Input
                                type="file"
                                height="100%"
                                width="100%"
                                top="0"
                                left="0"
                                opacity="0"
                                aria-hidden="true"
                                accept="image/*"
                                onChange={handleImagePick}
                            />
                        </>
                    </AspectRatio>
                    <FormControl mt={4} isRequired>
                        <FormLabel>Listing name</FormLabel>
                        <Input
                            placeholder="Listing name"
                            onChange={(e) => {
                                setName(e.target.value);
                            }}
                            value={name}
                        />
                    </FormControl>

                    <FormControl mt={4} isRequired>
                        <FormLabel>Description</FormLabel>
                        <AutoResizeTextarea
                            placeholder="Description"
                            onChange={(e) => {
                                setDescription(e.target.value);
                            }}
                            value={description}
                        />
                    </FormControl>
                    <FormControl mt={4} isRequired>
                        <FormLabel>Selling method</FormLabel>
                        <Select
                            placeholder="Select..."
                            onChange={(e) => {
                                const chosenMethod = e.target.value as
                                    | "sell"
                                    | "bid"
                                    | undefined;
                                setMethod(chosenMethod);
                            }}
                            value={method}
                        >
                            <option value={"sell"}>Sell</option>
                            <option value={"bid"}>Bid</option>
                        </Select>
                    </FormControl>
                    <FormControl mt={4} isRequired>
                        <FormLabel>
                            {method == "bid" ? "Starting Price" : "Price"}
                        </FormLabel>
                        <NumberInput
                            onChange={(_, valueAsNumber) => {
                                setPrice(valueAsNumber);
                            }}
                        >
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </FormControl>
                    <FormControl mt={4} isRequired>
                        <FormLabel>Expires on</FormLabel>
                        <Input
                            type="datetime-local"
                            colorScheme={"teal"}
                            onChange={(e) => {
                                setExpiryDate(dayjs(e.target.value).toDate());
                            }}
                        />
                    </FormControl>
                </ModalBody>

                <ModalFooter pb="40px">
                    <Button
                        colorScheme="teal"
                        mr={3}
                        onClick={handleSave}
                        isLoading={addListing.isLoading}
                    >
                        Save
                    </Button>
                    <Button onClick={handleClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AddListingModal;
