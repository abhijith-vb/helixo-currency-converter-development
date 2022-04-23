import React,{useEffect,useState} from 'react';
import { Layout } from 'antd';
import AppRoute from '../../common/route/AppRoute';
const { Content, Footer } = Layout;

function MainLayout() {
    const [currentYear, setcurrentYear] = useState('')
    useEffect(() => {
        const date = new Date().getFullYear();
        setcurrentYear(date)
        
    }, [])
    return (
        <Layout className="layout polarisTheme">
            <Content>
                <AppRoute />
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                Copyright ©{currentYear} Helixo Co
                    </Footer>
        </Layout>
    )
}

export default MainLayout;
