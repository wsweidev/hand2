import {
    AspectRatio,
    Box,
    Button,
    HStack,
    Image,
    Link,
    Skeleton,
    Stack,
    StackProps,
    Text,
    useBreakpointValue,
    useColorModeValue,
} from "@chakra-ui/react";
import * as React from "react";
import { Rating } from "./Rating";
import { FavoriteButton } from "./FavoriteButton";
import { PriceTag } from "./PriceTag";
import { Product } from "@prisma/client";

interface Props {
    product: Product;
    rootProps?: StackProps;
}

export const ProductCard = (props: Props) => {
    const { product, rootProps } = props;
    const { name, imageUrl, price, salePrice, rating, ratingCount } = product;
    return (
        <Stack
            spacing={useBreakpointValue({ base: "4", md: "5" })}
            {...rootProps}
        >
            <Box position="relative">
                <AspectRatio ratio={4 / 3}>
                    <Image
                        src={imageUrl}
                        alt={name}
                        draggable="false"
                        fallback={<Skeleton />}
                        borderRadius={useBreakpointValue({
                            base: "md",
                            md: "xl",
                        })}
                    />
                </AspectRatio>
                <FavoriteButton
                    position="absolute"
                    top="4"
                    right="4"
                    aria-label={`Add ${name} to your favourites`}
                />
            </Box>
            <Stack>
                <Stack spacing="1">
                    <Text
                        fontWeight="medium"
                        color={useColorModeValue("gray.700", "gray.400")}
                    >
                        {name}
                    </Text>
                    <PriceTag
                        price={price}
                        salePrice={salePrice ?? undefined}
                        currency="USD"
                    />
                </Stack>
                <HStack>
                    <Rating defaultValue={rating} size="sm" />
                    <Text
                        fontSize="sm"
                        color={useColorModeValue("gray.600", "gray.400")}
                    >
                        {ratingCount} Reviews
                    </Text>
                </HStack>
            </Stack>
            <Stack align="center">
                <Button colorScheme="blue">Add to cart</Button>
                <Link
                    textDecoration="underline"
                    fontWeight="medium"
                    color={useColorModeValue("gray.600", "gray.400")}
                >
                    Quick shop
                </Link>
            </Stack>
        </Stack>
    );
};
