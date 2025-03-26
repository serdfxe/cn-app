import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../../client/auth';

const RouteGuard = ({ children }) => {
    function hasJWT() {
        let flag = false;

        getToken() ? flag=true : flag=false

        return flag
    }

    return hasJWT() ? children : <Navigate to='/auth/signin' />
};

export default RouteGuard;
