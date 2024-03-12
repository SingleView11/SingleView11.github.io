import { Layout, } from 'antd';

const { Footer } = Layout;

const FooterComponent = () => {
    return (
        <Footer
            style={{
                textAlign: 'center',
            }}
        >
            Pitch Perfecter ©{new Date().getFullYear()} Created by Dirnot
        </Footer>
    )
}

export default FooterComponent