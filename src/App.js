import './App.css';
import './global.css';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import SignUpPage from './Pages/SignUpPage/SignUpPage';
import SignInPage from './Pages/SignInPage/SignInPage';
import AppPage from './Pages/AppPage/AppPage';
import RouteGuard from './components/RouteGuard/RouteGuard';
import { useEffect, useState } from 'react';
import { verifyToken } from './client/auth/auth';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { initializeTheme } from './store/themeSlice';
import { ConfigProvider, Flex } from 'antd';
import { CssTokenBridge } from './components/CssTokenBridge';


const App = () => {
  const algorithm = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeTheme());
  }, [dispatch]);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    const func = async () => {
      const token = localStorage.getItem("token");
    
      const verify = await verifyToken(token);

      if (!verify) {
        localStorage.removeItem("token");
      }

      setReady(true);
    }

    func();
  }, []);

  if (!ready) {
    return <div>Loading...</div>;
  }

  return (
    <ConfigProvider theme={ algorithm }>
      <Router>
        <Flex className="App" vertical>
        <CssTokenBridge />
          <Routes>
            <Route path='auth/signup' element={<SignUpPage />}/>
            <Route path='auth/signin' element={<SignInPage />}/>

            <Route path='app/*' element={
              <RouteGuard>
                <AppPage />
              </RouteGuard>
            } />
            
            <Route path='*' element={<Navigate to="/app" />}/>
            <Route path='' element={<Navigate to="/app" />}/>
          </Routes>
        </Flex>
      </Router>
    </ConfigProvider>
  );
}

export default App;
