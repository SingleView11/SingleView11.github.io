import React from 'react';
import { Flex, Progress } from 'antd';
const twoColors = {
    '0%': '#108ee9',
    '100%': '#87d068',
};
const conicColors = {
    '0%': '#87d068',
    '50%': '#ffe58f',
    '100%': '#ffccc7',
};

export const ProgressBarTrain = ({ progress }) => {
    return (
        <Progress percent={progress} strokeColor={twoColors} />
    )
}