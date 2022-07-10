import type { NextPage } from "next";
import { ChangeEvent, useState } from "react";
import { Box, Button, Image, Text } from "@chakra-ui/react";
import { trpc } from "@src/utils/trpc";
import AddListingModal from "@src/components/AddListingModal";

const MyListings: NextPage = () => {
    const listings = trpc.useQuery(["listings.getAll"]);
    const [isVisibleListingModal, setIsVisibleListingModal] = useState(false);

    return (
        <>
            <AddListingModal
                isVisible={isVisibleListingModal}
                onClose={() => {
                    setIsVisibleListingModal(false);
                }}
            />
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
            </Box>
        </>
    );
};

export default MyListings;
