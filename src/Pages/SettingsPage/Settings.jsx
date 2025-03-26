import { Form, Switch, Card, Typography } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../../store/themeSlice';

const Settings = () => {
    const { isDarkTheme } = useSelector((state) => state.theme);
    const dispatch = useDispatch();

    return (
        <Card 
        title="Настройки" 
        bordered={false}
        style={{ maxWidth: 600, margin: '20px auto' }}
        >
        <Form layout="vertical">
            <Form.Item label="Тёмная тема">
            <Switch 
                checked={isDarkTheme}
                onChange={() => dispatch(toggleTheme())}
                checkedChildren="Вкл" 
                unCheckedChildren="Выкл" 
            />
            </Form.Item>
        </Form>
        <Typography.Text type="secondary">
            Изменение темы применяется ко всему приложению
        </Typography.Text>
        </Card>
    );
};

export default Settings;