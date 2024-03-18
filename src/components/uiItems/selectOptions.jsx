import React from 'react';
import { Select, Space } from 'antd';
export const SelectOptions = (data, key, setData, originalWholeData) => {
    return (
        <Select
            key={key}
            defaultValue={data.cur}
            style={{
                width: 120,
            }}
            onChange={(value) => { 
                console.log(value); 
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
    )
}

export const SelectGroup = ({para, setPara}) => {
    const datas = {
        ...para
    }
    return (
        <Space wrap>
        {Object.entries(datas).map(([key, data])=>{
            console.log(data, key)
            return SelectOptions(data, key, setPara, para)
        })}
        </Space>
    )
}