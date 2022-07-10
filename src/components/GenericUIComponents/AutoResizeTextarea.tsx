import { Textarea, TextareaProps } from "@chakra-ui/react";
import ResizeTextarea from "react-textarea-autosize";
import React from "react";

// eslint-disable-next-line react/display-name
export const AutoResizeTextarea = React.forwardRef((props: TextareaProps) => {
    return (
        <Textarea
            minH="unset"
            overflow="hidden"
            w="100%"
            resize="none"
            minRows={1}
            as={ResizeTextarea}
            {...props}
        />
    );
});
