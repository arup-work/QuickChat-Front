import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/AuthSlice';


const store = configureStore({
    reducer: {
        auth: authReducer
    }
})

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


/**
 * ReturnType<typeof store.getState> tells TypeScript to take the return type of 
 * store.getState (which is the current state) and set that as the type for RootState.
 * 
 * typeof store.dispatch
 * This infers the type of dispatch directly from the Redux store configuration, which means it 
 * will automatically know about all the actions your slices can dispatch, including 
 * asynchronous actions like Thunks if they’re added to the store.
 */