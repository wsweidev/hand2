import {
    RangeSlider,
    RangeSliderFilledTrack,
    RangeSliderMark,
    RangeSliderThumb,
    RangeSliderTrack,
    Tooltip,
} from "@chakra-ui/react";
import { useState } from "react";

type PriceSliderProps = {
    setSliderValue: (numbersRange: number[]) => void;
    sliderValue: number[];
};

export const PriceSlider = ({
    sliderValue,
    setSliderValue,
}: PriceSliderProps) => {
    const [showTooltip, setShowTooltip] = useState(false);
    return (
        <RangeSlider
            defaultValue={[0, 10000]}
            min={0}
            max={10000}
            step={50}
            colorScheme="teal"
            onChange={(v) => setSliderValue(v)}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            {[
                0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000,
            ].map((number) => (
                <RangeSliderMark
                    key={number.toString()}
                    value={number}
                    mt="1"
                    ml="-2.5"
                    fontSize={["xx-small", "xs", "sm"]}
                >
                    {number}
                </RangeSliderMark>
            ))}
            <RangeSliderTrack>
                <RangeSliderFilledTrack />
            </RangeSliderTrack>
            <Tooltip
                hasArrow
                bg="teal.500"
                color="white"
                placement="top"
                isOpen={showTooltip}
                label={sliderValue[0]}
            >
                <RangeSliderThumb index={0} />
            </Tooltip>
            <Tooltip
                hasArrow
                bg="teal.500"
                color="white"
                placement="top"
                isOpen={showTooltip}
                label={sliderValue[1]}
            >
                <RangeSliderThumb index={1} />
            </Tooltip>
        </RangeSlider>
    );
};
