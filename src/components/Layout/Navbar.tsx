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
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const Navbar = () => {
    const session = useSession();
    const router = useRouter();
    const { colorMode, toggleColorMode } = useColorMode();
    return (
        <>
            <Box
                backgroundColor={useColorModeValue("gray.100", "gray.700")}
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

                            {session.status === "unauthenticated" ? (
                                <Button
                                    backgroundColor={"transparent"}
                                    onClick={() => {
                                        signIn("google");
                                    }}
                                >
                                    Login
                                </Button>
                            ) : (
                                <Menu>
                                    <MenuButton
                                        as={Button}
                                        rounded={"full"}
                                        variant={"link"}
                                        cursor={"pointer"}
                                        minW={0}
                                    >
                                        <Avatar
                                            size={"sm"}
                                            src={
                                                "https://avatars.dicebear.com/api/male/username.svg"
                                            }
                                        />
                                    </MenuButton>
                                    <MenuList alignItems={"center"}>
                                        <br />
                                        <Center>
                                            <Avatar
                                                size={"2xl"}
                                                src={
                                                    "https://avatars.dicebear.com/api/male/username.svg"
                                                }
                                            />
                                        </Center>
                                        <br />
                                        <Center>
                                            <p>
                                                {session.data?.user?.name ??
                                                    "Guest"}
                                            </p>
                                        </Center>
                                        <br />
                                        <MenuDivider />
                                        <MenuItem
                                            onClick={() => {
                                                router.push("/MyWallet");
                                            }}
                                        >
                                            Wallet
                                        </MenuItem>
                                        {session.status === "loading" && (
                                            <MenuItem onClick={() => {}}>
                                                Authenticating...
                                            </MenuItem>
                                        )}

                                        {session.status === "authenticated" && (
                                            <>
                                                <MenuItem
                                                    onClick={() => {
                                                        router.push(
                                                            "/MyListings"
                                                        );
                                                    }}
                                                >
                                                    My listings
                                                </MenuItem>
                                                <MenuItem
                                                    onClick={() => {
                                                        signOut({
                                                            callbackUrl: "/",
                                                        });
                                                    }}
                                                >
                                                    Logout
                                                </MenuItem>
                                            </>
                                        )}
                                    </MenuList>
                                </Menu>
                            )}
                        </Stack>
                    </Flex>
                </Flex>
            </Box>
        </>
    );
};

export default Navbar;
