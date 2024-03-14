import React from 'react';
import {  Col, Row } from 'antd';
import { CardTemp } from './TrainCards';



const TrainCardList = (cardInfos) => {
    return (
        <Row    >
            {
                cardInfos.map((cardInfo, index) => {
                    return (
                        <Col key={`cardInfo: ${index}`}>
                            <CardTemp {...(cardInfo)}></CardTemp>
                        </Col>
                    )
                })
                // <Col span={8}>
                //     <CardTemp {...(cardInfos[0])}></CardTemp>
                // </Col>
            }
        </Row>

    )
    // const cardLists = cardInfos.map(cardInfo => {
    //     return () => (
            
    //     )
    // });
    // console.log(cardLists)
    // return (
    //     <Row gutter={16}>
    //         {cardLists}
    //     </Row>
    // )
};

const RandomCardListNum = ({ num = 5 }) => {
    const cardInfos = Array(num).fill({
        imageUrl: "https://source.unsplash.com/random",
        title: "listtrial",
        description: "just trying"
    })
    return TrainCardList(cardInfos)
}

export { TrainCardList, RandomCardListNum };