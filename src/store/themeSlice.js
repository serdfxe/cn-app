import { createSlice } from '@reduxjs/toolkit';
import { theme } from 'antd';

const initialState = {
    isDarkTheme: false,
    cssVar: true,
    algorithm: theme.defaultAlgorithm,
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
        state.isDarkTheme = !state.isDarkTheme;
        state.algorithm = state.isDarkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm;
        localStorage.setItem('antd-theme', state.isDarkTheme ? 'dark' : 'light');
        },
        initializeTheme: (state) => {
        const savedTheme = localStorage.getItem('antd-theme');
        if (savedTheme === 'dark') {
            state.isDarkTheme = true;
            state.algorithm = theme.darkAlgorithm;
        }
        },
    },
});

export const { toggleTheme, initializeTheme } = themeSlice.actions;
export default themeSlice.reducer;
