import React from 'react';
import { Col, Row, Select, Space, Typography } from 'antd';
import { TitleCen } from './titleFunc';
import { upFirst } from '../configs/levelTypes';
import Button from 'antd-button-color';

const { Text, Title } = Typography;


export const SelectOptions = (data, key, setData, originalWholeData, width=100, setFuncCustom = false) => {
    return (
        <>
        <Text style={{margin: 5, fontSize: 16}} >{`  ${upFirst(key)}  `}</Text>
        <Select
            key={key}
            defaultValue={data.cur}
            style={{
                width: width,
                margin: 5,
            }}
            onChange={(value) => { 
                if(setFuncCustom) {
                    setData({value: value, key: key})
                    return;
                }
                const ansData = {...originalWholeData}
                ansData[key] = {
                    ...data,
                    cur: value
                }
                setData(
                    ansData
                ) }}
            options={data.options.map((t) => {
                return {
                    label: t,
                    value: t,
                }
            })}
        />
        </>
    )
}

export const SelectGroup = ({para, setPara, buttonInfos, minimalWidth = 120, setFuncCustom=false}) => {
    const datas = {
        ...para
    }
    return (
        <>
        <Row justify={'center'}>
        {Object.entries(datas).map(([key, data])=>{
            return (
                <Col style={{minWidth: minimalWidth}} key={key + "in chord choice"}>
                {SelectOptions(data, key, setPara, para, minimalWidth, setFuncCustom)}
                </Col>
            ) 

        })}
        {buttonInfos &&
        buttonInfos.map(buttonInfo => {
            return <Col key={buttonInfo.name + "button"} style={{ margin: 5}}>
           {buttonInfo && <Button type={buttonInfo.type} onClick={buttonInfo.clickFunc}>{buttonInfo.name}</Button>}
        </Col>}
        )}
        
        
        </Row>
        </>
    )
}