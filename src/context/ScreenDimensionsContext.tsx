import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ScreenDimensionsContextType {
  actualHeight: number | null;
  setActualHeight: (height: number) => void;
}

const ScreenDimensionsContext = createContext<
  ScreenDimensionsContextType | undefined
>(undefined);

interface ScreenDimensionsProviderProps {
  children: ReactNode;
}

export const ScreenDimensionsProvider: React.FC<
  ScreenDimensionsProviderProps
> = ({ children }) => {
  const [actualHeight, setActualHeight] = useState<number | null>(null);

  const value = {
    actualHeight,
    setActualHeight,
  };

  return (
    <ScreenDimensionsContext.Provider value={value}>
      {children}
    </ScreenDimensionsContext.Provider>
  );
};

export const useScreenDimensions = (): ScreenDimensionsContextType => {
  const context = useContext(ScreenDimensionsContext);
  if (context === undefined) {
    throw new Error(
      'useScreenDimensions must be used within a ScreenDimensionsProvider',
    );
  }
  return context;
};
