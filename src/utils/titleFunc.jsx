import { Typography } from "antd"
const { Text, Title } = Typography

export const TitleCen = ({text}) => {
    return (
        <span> <Title style={{
            textAlign: "center",
            margin: 10,
        }}>{text}</Title> </span>

    )
}