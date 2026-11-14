import { createContext, useContext } from 'react';

// true once the loading screen has finished and the landing intro may play.
export const IntroContext = createContext(true);

export const useIntroReady = () => useContext(IntroContext);