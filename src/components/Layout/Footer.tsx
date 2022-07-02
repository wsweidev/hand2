import {
    Box,
    Container,
    Link,
    SimpleGrid,
    Stack,
    Text,
    Flex,
    Tag,
    chakra,
    useColorModeValue,
    Image,
    VisuallyHidden,
    Center,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const ListHeader = ({ children }: { children: ReactNode }) => {
    return (
        <Text fontWeight={"500"} fontSize={"lg"} mb={2}>
            {children}
        </Text>
    );
};
const SocialButton = ({
    children,
    label,
    href,
}: {
    children: ReactNode;
    label: string;
    href: string;
}) => {
    return (
        <chakra.button
            bg={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
            rounded={"full"}
            w={8}
            h={8}
            cursor={"pointer"}
            as={"a"}
            href={href}
            display={"inline-flex"}
            alignItems={"center"}
            justifyContent={"center"}
            transition={"background 0.3s ease"}
            _hover={{
                bg: useColorModeValue("blackAlpha.200", "whiteAlpha.200"),
            }}
        >
            <VisuallyHidden>{label}</VisuallyHidden>
            {children}
        </chakra.button>
    );
};

export default function LargeWithLogoCentered() {
    return (
        <Box
            bg={useColorModeValue("gray.100", "gray.700")}
            color={useColorModeValue("gray.700", "gray.200")}
        >
            <Container as={Stack} maxW={"6xl"} py={10}>
                <SimpleGrid columns={3} spacing={8}>
                    <Stack align={"flex-start"}>
                        <ListHeader>Company</ListHeader>
                        <Link href={"#"}>About Us</Link>
                        <Link href={"#"}>Press</Link>
                        <Link href={"#"}>Careers</Link>
                        <Link href={"#"}>Contact Us</Link>
                        <Link href={"#"}>Partners</Link>
                    </Stack>
                    <Stack align={"center"}>
                        <ListHeader>Legal</ListHeader>
                        <Link href={"#"}>Cookies Policy</Link>
                        <Link href={"#"}>Privacy Policy</Link>
                        <Link href={"#"}>Terms of Service</Link>
                        <Link href={"#"}>Law Enforcement</Link>
                        <Link href={"#"}>Status</Link>
                    </Stack>
                    <Stack align={"flex-end"}>
                        <ListHeader>Follow Us</ListHeader>
                        <Link href={"#"}>Facebook</Link>
                        <Link href={"#"}>Twitter</Link>
                        <Link href={"#"}>Dribbble</Link>
                        <Link href={"#"}>Instagram</Link>
                        <Link href={"#"}>LinkedIn</Link>
                    </Stack>
                </SimpleGrid>
            </Container>
            <Box paddingBottom={10}>
                <Flex
                    align={"center"}
                    _before={{
                        content: '""',
                        borderBottom: "1px solid",
                        borderColor: useColorModeValue("gray.200", "gray.900"),
                        flexGrow: 1,
                        mr: 8,
                    }}
                    _after={{
                        content: '""',
                        borderBottom: "1px solid",
                        borderColor: useColorModeValue("gray.200", "gray.900"),
                        flexGrow: 1,
                        ml: 8,
                    }}
                >
                    <Image
                        src="/row-logo.png"
                        alt="Logo"
                        maxH={10}
                        minW={100}
                        objectFit={"contain"}
                        resize={"both"}
                    />
                </Flex>
                <Stack
                    direction={"column"}
                    justifyContent="center"
                    alignItems={"center"}
                    spacing={5}
                >
                    <Text pt={6} fontSize={"sm"} textAlign={"center"}>
                        © 2022 Hand2. All rights reserved
                    </Text>
                    <Stack direction={"row"} spacing={6}>
                        <SocialButton label={"Twitter"} href={"#"}>
                            <FaTwitter />
                        </SocialButton>
                        <SocialButton label={"YouTube"} href={"#"}>
                            <FaYoutube />
                        </SocialButton>
                        <SocialButton label={"Instagram"} href={"#"}>
                            <FaInstagram />
                        </SocialButton>
                    </Stack>
                </Stack>
            </Box>
        </Box>
    );
}
