import { Layout, } from 'antd';
import VisitorStats from './VisitorStats';

const { Footer } = Layout;

const FooterComponent = () => {
    return (
        <Footer
            style={{
                textAlign: 'center',
            }}
        >
            <div>
                Pitch Perfecter ©{new Date().getFullYear()} Created by Dirnot
            </div>
            <VisitorStats />
        </Footer>
    )
}

export default FooterComponent