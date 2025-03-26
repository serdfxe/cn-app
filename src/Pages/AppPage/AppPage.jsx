import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';

import Block from '../../components/Block/Block';
import Page from '../Page/Page';
import { getUser } from '../../client/auth/user';
import AccountPage from '../AccountPage/AccountPage';
import InboxPage from '../InboxPage/InboxPage';
import SettingsPage from '../SettingsPage/SettingsPage';
import { getWorkspace } from '../../client/notes/workspace';
import WorkSpace from '../WorkSpace/WorkSpace';

const BBlock = () => {
    const navigate = useNavigate();
    const { pageId } = useParams();
    const location = useLocation();
    const [key, setKey] = useState(pageId);

    useEffect(() => {
        setKey(pageId);
    }, [location.pathname]);

    return (
        <Block key={key} id={pageId} onError={() => navigate('/app')} />
    );
}

const AppPage = () => {
    const [userData, setUserData] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        getUser()
            .then((data) => {
                setUserData(data);
            })
            .catch((e) => {
                navigate('/auth/signin');
            });
    }, []);

    if (!userData) {
        return (<></>);
    }

    return (
        <Page>
            <Routes>
                <Route path='/page/:pageId' element={<BBlock />} />
                <Route path='/account' element={<AccountPage />} />
                <Route path='/inbox' element={<InboxPage />} />
                <Route path='/settings' element={<SettingsPage />} />

                <Route path='*' element={<Navigate to="/app" />}/>
                <Route path='' element={<WorkSpace />}/>
            </Routes>
        </Page>
    );
};

export default AppPage;