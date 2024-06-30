import React from 'react';
import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';
const RepairComponent = () => (
    <Result
        status="500"
        title="500"
        subTitle="Sorry, the current page is under maintenance. "
        extra={
            <Link to="/">
                <Button type="primary"  >Back Home</Button>
            </Link>
        }
    />
);
export default RepairComponent;