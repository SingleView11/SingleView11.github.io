import { useState } from "react"
import { CHORD_PROG_INIT_PARAS, CHORD_SINGLE_INIT_PARAS, generateDataForChordPara, modes, noteSounds } from "../../utils/musicTerms"
import { SelectGroup } from "../uiItems/selectOptions"
import { Button, Flex, Row, Typography, theme } from "antd"
import { Card, List } from 'antd';
import { v4 } from "uuid";
import { TitleCen } from "../uiItems/titleFunc";
import { CloseOutlined, InfoOutlined, CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import { Content } from "antd/es/layout/layout";
import { stopSamplerAll } from "../playSound/playFunction";

const { Text, Title } = Typography;


const ChordProgressionUIList = ({ data, deleteFunc, infoFunc, moveLeft, moveRight }) => (
  <List
    grid={{
      xs: Flex,
      sm: Flex,
      md: Flex,
      lg: Flex,
      xl: Flex,
      xxl: Flex,
    }}
    dataSource={data}
    locale={{ emptyText: 'Empty' }}
    renderItem={(item) => (
      <List.Item style={{ margin: 5, }}>
        <Card bodyStyle={{ padding: 0, textAlign: "center" }} title={<Text style={{ fontSize: 16 }}>{generateDataForChordPara(item)}</Text>} >
          <Button shape="circle" style={{ margin: 5 }} icon={<InfoOutlined />} size="small" type="info" name={item.key} onClick={infoFunc}></Button>
          <Button shape="circle" style={{ margin: 5 }} icon={<CaretLeftOutlined />} size="small" type="primary" name={item.key} onClick={moveLeft}></Button>
          <Button shape="circle" style={{ margin: 5 }} icon={<CaretRightOutlined />} size="small" type="primary" name={item.key} onClick={moveRight}></Button>
          <Button shape="circle" style={{ margin: 5 }} icon={<CloseOutlined />} size="small" type="warning" name={item.key} onClick={deleteFunc}></Button>
        </Card>
      </List.Item>
    )}
  />
)

const info2ChordData = (para) => {
  const info = { ...para }
  const key = v4();
  return { info: info, key: key }
}

export const PlayChordProg = () => {
  const [para, setPara] = useState(CHORD_PROG_INIT_PARAS)
  const [chordPara, setChordPara] = useState(CHORD_SINGLE_INIT_PARAS)
  const [chordList, setChordList] = useState([])
  const addListChord = () => {
    const newListData = [...chordList, info2ChordData({ ...chordPara })]
    setChordList(newListData)
  }
  const deleteListChord = (e) => {
    const newListData = []
    chordList.forEach((chord) => {
      if (chord.key != e.currentTarget.name) {
        newListData.push(chord)
      }
    })
    setChordList(newListData)
  }
  const swapArr = (arr, i1, i2) => {
    let tmp = arr[i1]
    arr[i1] = arr[i2]
    arr[i2] = tmp
  }
  const moveLeft = (e) => {
    let chordKey = e.currentTarget.name
    const newListData = [...chordList]
    for (let [index, value] of newListData.entries()) {
      if (value.key == chordKey) {
        if (index != 0) {
          swapArr(newListData, index, index - 1)
        }
        break
      }
    }
    setChordList(newListData)
  }
  const moveRight = (e) => {
    let chordKey = e.currentTarget.name
    const newListData = [...chordList]
    for (let [index, value] of newListData.entries()) {
      if (value.key == chordKey) {
        if (index != newListData.length - 1) {
          swapArr(newListData, index, index + 1)
        }
        break
      }
    }
    setChordList(newListData)
  }
  const clearChordList = () => {
    setChordList([])
  }
  const showChordInfo = (e) => {
    console.log(e.currentTarget)
  }
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <>
      <Content
        style={{
          margin: 0,
          marginTop: 20,
          padding: 24,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <TitleCen level={3} text={"Global Chord Config"}></TitleCen>
        <SelectGroup para={para} setPara={setPara}  ></SelectGroup>

        <TitleCen level={3} text={"Add Single Chord"}></TitleCen>
        <SelectGroup para={chordPara} setPara={setChordPara} buttonInfos={
          [{ name: "Add", type: "success", clickFunc: addListChord },
          { name: "Clear All", type: "dark", clickFunc: clearChordList },
          ]}  ></SelectGroup>
        {/* <SelectGroup para={para} setPara={setPara}  ></SelectGroup> */}
      </Content>


      <Content
        style={{
          margin: 0,
          marginTop: 20,
          padding: 0,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <TitleCen level={3} text={"Chord List"}></TitleCen>
        <ChordProgressionUIList data={chordList} configParas={para}
          deleteFunc={deleteListChord} infoFunc={showChordInfo}
          moveLeft={moveLeft} moveRight={moveRight}
        ></ChordProgressionUIList>
      </Content>

      <Content
        style={{
          margin: 0,
          marginTop: 20,
          padding: 24,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <Row justify="center" style={{ margin: 0 }}>
          <Button type='success' style={{ margin: 5 }} onClick={() => { }}   >Play</Button>
          <Button type='primary' style={{ margin: 5 }} onClick={() => { }}   >Loop</Button>
          <Button type='lightdark' style={{ margin: 5 }} onClick={() => { stopSamplerAll() }}   >Pause</Button>
        </Row>
      </Content>

    </>


  )
}