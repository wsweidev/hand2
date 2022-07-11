import {
    Box,
    Flex,
    Avatar,
    Link,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useDisclosure,
    useColorModeValue,
    Stack,
    useColorMode,
    Center,
    Image,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerCloseButton,
    Text,
    VStack,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon, CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import { signIn, signOut, useSession } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/router";
import { FaFacebook } from "react-icons/fa";
import {
    IoLogOutOutline,
    IoBagHandleOutline,
    IoChatboxEllipsesOutline,
    IoBrowsersOutline,
    IoGridOutline,
} from "react-icons/io5";
import { useContext } from "react";
import { DrawerContext } from "./DrawerContext";

const Navbar = () => {
    const session = useSession();
    const router = useRouter();
    const { isOpen, onClose, onOpen } = useContext(DrawerContext);
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <>
            <Drawer
                placement={"right"}
                onClose={onClose}
                isOpen={isOpen}
                preserveScrollBarGap
            >
                <DrawerOverlay />
                <DrawerContent mt={"60px"}>
                    <DrawerHeader borderBottomWidth="1px">
                        <VStack paddingY={"10px"}>
                            <Avatar
                                size={"2xl"}
                                src={
                                    session.data?.user?.image ||
                                    "https://avatars.dicebear.com/api/male/username.svg"
                                }
                            />
                            <Box>
                                <Text mt="10px">
                                    {session.data?.user?.name || "Guest"}
                                </Text>
                            </Box>
                        </VStack>
                    </DrawerHeader>
                    <DrawerBody mt={"20px"}>
                        {session.status === "authenticated" ? (
                            <UserButtons userId={session.data?.user?.id!} />
                        ) : (
                            <GuestButtons />
                        )}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
            <Box
                backgroundColor={useColorModeValue("white", "gray.700")}
                px={4}
                width={"full"}
                position="sticky"
                zIndex={3000}
                top={"0"}
                height={"60px"}
                alignItems="center"
            >
                <Flex
                    h={16}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                >
                    <Box minH={8}>
                        <Button
                            backgroundColor={"transparent"}
                            onClick={() => {
                                router.push(
                                    session.status === "authenticated"
                                        ? "/Home"
                                        : "/"
                                );
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
                        </Button>
                    </Box>

                    <Flex alignItems={"center"}>
                        <Stack direction={"row"} spacing={7}>
                            <Button
                                onClick={toggleColorMode}
                                backgroundColor={"transparent"}
                            >
                                {colorMode === "light" ? (
                                    <MoonIcon />
                                ) : (
                                    <SunIcon />
                                )}
                            </Button>
                            <Button
                                onClick={isOpen ? onClose : onOpen}
                                backgroundColor={"transparent"}
                            >
                                {isOpen ? <CloseIcon /> : <HamburgerIcon />}
                            </Button>
                        </Stack>
                    </Flex>
                </Flex>
            </Box>
        </>
    );
};

export default Navbar;

const GuestButtons = () => {
    const router = useRouter();
    return (
        <VStack>
            <Button
                iconSpacing="20px"
                justifyContent="flex-start"
                variant={"outline"}
                leftIcon={<FcGoogle size={"20px"} />}
                w={"100%"}
                onClick={() => {
                    signIn("google", { callbackUrl: "/Home" });
                }}
            >
                <Center>
                    <Text>Sign in with Google</Text>
                </Center>
            </Button>
            <Button
                iconSpacing="20px"
                justifyContent="flex-start"
                colorScheme={"facebook"}
                leftIcon={<FaFacebook size={"20px"} />}
                w={"100%"}
                onClick={() => {
                    // signIn("facebook", { callbackUrl: "/Home" });
                }}
            >
                Sign In With Facebook
            </Button>
        </VStack>
    );
};

const UserButtons = ({ userId }: { userId: string }) => {
    const router = useRouter();
    return (
        <VStack spacing={2}>
            <Button
                iconSpacing="20px"
                justifyContent="flex-start"
                leftIcon={<IoBrowsersOutline size={"20px"} />}
                w={"100%"}
                onClick={() => {
                    router.push("/Home");
                }}
            >
                <Center>
                    <Text>Home</Text>
                </Center>
            </Button>
            <Button
                iconSpacing="20px"
                leftIcon={<IoGridOutline size={"20px"} />}
                justifyContent="flex-start"
                w={"100%"}
                onClick={() => {
                    router.push(`/Profile/${userId}`);
                }}
            >
                <Center>
                    <Text>My Profile</Text>
                </Center>
            </Button>
            <Button
                iconSpacing="20px"
                justifyContent="flex-start"
                leftIcon={<IoChatboxEllipsesOutline size={"20px"} />}
                w={"100%"}
                onClick={() => {
                    router.push("/Chat");
                }}
            >
                <Center>
                    <Text>Chat</Text>
                </Center>
            </Button>

            <Box w={"100%"}>
                <Button
                    justifyContent="flex-start"
                    colorScheme={"red"}
                    iconSpacing="20px"
                    leftIcon={<IoLogOutOutline size={"20px"} />}
                    w={"100%"}
                    mt="30px"
                    onClick={() => {
                        signOut({
                            callbackUrl: "/",
                        });
                    }}
                >
                    <Center>
                        <Text>Logout</Text>
                    </Center>
                </Button>
            </Box>
        </VStack>
    );
};
