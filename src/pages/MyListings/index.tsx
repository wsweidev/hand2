import type { NextPage } from "next";
import { ChangeEvent, useState } from "react";
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
} from "@chakra-ui/react";
import { trpc } from "@src/utils/trpc";

const MyListings: NextPage = () => {
    const listings = trpc.useQuery(["listings.getAll"]);
    const [isVisibleListingModal, setIsVisibleListingModal] = useState(false);
    const [imageBase64, setImageBase64] = useState<string | undefined>(
        undefined
    );
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
    return (
        <>
            <Modal
                closeOnOverlayClick={false}
                isOpen={isVisibleListingModal}
                onClose={() => {
                    setIsVisibleListingModal(false);
                }}
            >
                <ModalOverlay />
                <ModalContent alignSelf={"center"}>
                    <ModalHeader>Create your account</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel>First name</FormLabel>
                            <Input placeholder="First name" />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Last name</FormLabel>
                            <Input placeholder="Last name" />
                        </FormControl>
                        <Box>
                            <p>upload file</p>
                            <Input
                                type="file"
                                height="100%"
                                width="100%"
                                position="absolute"
                                top="0"
                                left="0"
                                opacity="0"
                                aria-hidden="true"
                                accept="image/*"
                                onChange={handleImagePick}
                            />
                        </Box>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3}>
                            Save
                        </Button>
                        <Button
                            onClick={() => {
                                setIsVisibleListingModal(false);
                            }}
                        >
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Box>
                {listings.data &&
                    listings.data.map((listing) => (
                        <>
                            <Text>{listing.name}</Text>
                            <Text>{listing.description}</Text>
                            <Text>{listing.price}</Text>
                            <Text>{listing.status}</Text>
                            <Text>{listing.type}</Text>
                            <Text>{listing.user.name}</Text>
                            <Text>{listing.expires.toDateString()}</Text>
                            <Image
                                width="500"
                                height="200"
                                src={listings.data[0]?.mainImageUrl!}
                                alt="listing image"
                            />
                        </>
                    ))}
                <Button
                    title="Add Listing"
                    onClick={() => {
                        setIsVisibleListingModal(true);
                    }}
                />
                <Image
                    width="500"
                    height="200"
                    src={imageBase64}
                    alt="listing image"
                />
            </Box>
        </>
    );
};

export default MyListings;
