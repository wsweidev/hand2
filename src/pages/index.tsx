import {
    Flex,
    Container,
    Heading,
    Stack,
    Text,
    Button,
} from "@chakra-ui/react";
import { LandingIllustration } from "@src/components/Illustrations/LandingIllustration";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function CallToActionWithIllustration() {
    const session = useSession();
    const router = useRouter();
    return (
        <Container maxW={"5xl"}>
            <Stack
                textAlign={"center"}
                align={"center"}
                spacing={{ base: 8, md: 10 }}
            >
                <Heading
                    fontWeight={600}
                    fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
                    lineHeight={"110%"}
                >
                    Second-Hand Selling{" "}
                    <Text as={"span"} color={"teal.300"}>
                        made easy
                    </Text>
                </Heading>
                <Text color={"gray.500"} maxW={"3xl"}>
                    List, bid, and purchase second hand items with ease
                </Text>
                <Stack spacing={6} direction={"row"}>
                    <Button
                        rounded={"full"}
                        px={6}
                        colorScheme={"teal"}
                        bg={"teal.300"}
                        _hover={{ bg: "teal.700" }}
                        onClick={() => {
                            if (session.status === "authenticated") {
                                router.push("/Home");
                            } else if (session.status === "unauthenticated") {
                                signIn("google");
                            }
                        }}
                    >
                        {session.status === "authenticated" ? "Home" : "Login"}
                    </Button>
                    <Button rounded={"full"} px={6}>
                        Learn more
                    </Button>
                </Stack>
                <Flex w={"full"}>
                    <LandingIllustration
                        height={{ sm: "24rem", lg: "28rem" }}
                        mt={{ base: 12, sm: 16 }}
                    />
                </Flex>
            </Stack>
        </Container>
    );
}
