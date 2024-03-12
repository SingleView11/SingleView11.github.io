import React from 'react';
import { Card, Col, Row } from 'antd';
import { CardTemp } from './TrainCards';



const TrainCardList = (cardInfos) => {
    return (
        <Row    >
            {
                cardInfos.map(cardInfo => {
                    return (
                        <Col >
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
    // console.log(cardInfos)
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
    console.log(cardInfos)
    return TrainCardList(cardInfos)
}

export { TrainCardList, RandomCardListNum };