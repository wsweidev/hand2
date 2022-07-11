import type { NextPage } from "next";
import { ChangeEvent, useState } from "react";
import {
    Avatar,
    Box,
    Button,
    Center,
    Flex,
    Heading,
    HStack,
    Image,
    Text,
    VStack,
} from "@chakra-ui/react";
import { trpc } from "@src/utils/trpc";
import { useRouter } from "next/router";
import ListingsDisplay from "@src/components/ListingsDisplay";
// @ts-ignore
import ReactStars from "react-rating-stars-component";
import { IoWalletOutline } from "react-icons/io5";
import TopupModal from "@src/components/TopupModal";
import RatingModal from "@src/components/RatingModal";
import { useSession } from "next-auth/react";

const Profile: NextPage = () => {
    const router = useRouter();
    const session = useSession();
    const { profileId } = router.query as { profileId: string };
    const [isVisibleTopupModal, setIsVisibleTopupModal] = useState(false);
    const [isVisibleRatingModal, setIsVisibleRatingModal] = useState(false);

    const profileQuery = trpc.useQuery(
        ["profiles.getProfileById", { id: profileId }],
        { enabled: !!profileId }
    );
    const profile = profileQuery.data;
    const rating = {
        count: profile?.ratings?.length || 0,
        average: profile?.ratings
            ? profile?.ratings.reduce((accumulator, rating) => {
                  return accumulator + rating.stars;
              }, 1) / profile?.ratings?.length
            : 0,
    };

    const isRated = profile?.ratings?.find(
        (x) => x.raterId == session.data?.user?.id
    );

    if (profile) {
        return (
            <>
                <TopupModal
                    isVisible={isVisibleTopupModal}
                    onClose={() => {
                        setIsVisibleTopupModal(false);
                    }}
                    onSave={() => {
                        setIsVisibleTopupModal(false);
                        profileQuery.refetch();
                    }}
                />
                <RatingModal
                    receiverId={profile.id!}
                    isVisible={isVisibleRatingModal}
                    onClose={() => {
                        setIsVisibleRatingModal(false);
                    }}
                    onSave={() => {
                        setIsVisibleRatingModal(false);
                        profileQuery.refetch();
                    }}
                />
                <Flex direction={"column"}>
                    <Flex
                        direction={"column"}
                        w={["100%", "100%", "55%"]}
                        p="20px"
                        alignSelf={"center"}
                        mb="20px"
                        alignItems={"center"}
                        bg="white"
                        _dark={{ bg: "gray.700" }}
                        borderRadius="15px"
                    >
                        <Avatar src={profile.image!} size="2xl" />
                        <VStack mt="10px">
                            <Heading>
                                {profile.name + (profile.isOwn ? " (You)" : "")}
                            </Heading>
                            <HStack alignItems={"center"} mt="20px">
                                <Box pb="5px">
                                    <ReactStars
                                        key={rating.average}
                                        count={5}
                                        size={24}
                                        value={rating.average}
                                        edit={false}
                                        activeColor="#ffd700"
                                    />
                                </Box>
                                <Text pb="5px">{` (${rating.count})`}</Text>

                                <Button
                                    size={"xs"}
                                    colorScheme={"yellow"}
                                    onClick={() => {
                                        setIsVisibleRatingModal(true);
                                    }}
                                    disabled={!!isRated || profile.isOwn}
                                >
                                    {isRated ? "Rated" : "Rate"}
                                </Button>
                            </HStack>
                            <HStack mt="20px">
                                <IoWalletOutline color="teal" size={24} />
                                {profile.isOwn && (
                                    <Text>{profile.wallet + " RM"}</Text>
                                )}
                                <Button
                                    size={"xs"}
                                    colorScheme={"teal"}
                                    onClick={() => {
                                        setIsVisibleTopupModal(true);
                                    }}
                                >
                                    Top-up
                                </Button>
                            </HStack>
                        </VStack>
                    </Flex>
                    <ListingsDisplay userId={profile.id} />
                </Flex>
            </>
        );
    }
    return <></>;
};

export default Profile;
