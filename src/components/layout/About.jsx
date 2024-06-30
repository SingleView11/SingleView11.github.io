import React from 'react';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { RandomCard1, RandomCard2, DemoCard, DemoCard2 } from '../uiItems/TrainCards';
import { RandomCardListNum, TrainCardList } from '../uiItems/TrainCardList';
import { SmileFilled, SmileOutlined, PlayCircleFilled, FrownOutlined, } from '@ant-design/icons';
import { Typography } from 'antd';
import Title from 'antd/es/skeleton/Title';
import { TitleCen } from '../uiItems/titleFunc';
const { Paragraph, Text } = Typography;

const { Header, Footer, Sider, Content } = Layout;
const headerStyle = {
    textAlign: 'center',
    color: '#fff',
    height: 64,
    paddingInline: 48,
    lineHeight: '64px',
    backgroundColor: '#4096ff',
};
const contentStyle = {
    textAlign: 'center',
    minHeight: 120,
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#0958d9',
};
const siderStyle = {
    textAlign: 'center',
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#1677ff',
};
const footerStyle = {
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#4096ff',
};
const layoutStyle = {
    borderRadius: 8,
    overflow: 'hidden',
    width: 'calc(50% - 8px)',
    maxWidth: 'calc(50% - 8px)',
};

const items = new Array(15).fill(null).map((_, index) => ({
    key: index + 1,
    label: `nav ${index + 1}`,
}));
const AboutComponent = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <Layout>

            <Content
                style={{
                    padding: '0 48px',
                }}
            >
                <div
                    style={{
                        background: colorBgContainer,
                        minHeight: 280,
                        padding: 24,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <h1>Author Contact</h1>
                    <p>If you are having any problem using the website, or seeking cooperation either commercially or not, you can contact the following mail address.
                    </p>
                    <p><Paragraph copyable> diras9510@gmail.com</Paragraph></p>

                    <h1>News</h1>
                    <h2>6/14</h2>
                    <p>
                        The website is updating its backend system and database. Consequently login, signup function is temporarily shut down <FrownOutlined />
                    </p>

                    <h2>5/10</h2>
                    <p>
                        Upcoming AI agent, with customized analysis and improvemet suggestion!
                    </p>

                    <h2>4/20</h2>
                    <p>
                        Signup with gmail to keep track of your training data!
                    </p>

                    <h2>4/5</h2>
                    <p>
                        Play with chord progressions to feel the vibe <PlayCircleFilled />! New functionality on.
                    </p>

                    <h2>3/15</h2>
                    <p>
                        PitchPerfecter v1.0 is up! <SmileOutlined />
                    </p>




                </div>
            </Content>
        </Layout >
    );
};


export default AboutComponent;
