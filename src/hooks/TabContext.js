// TabContext.js
import React, {createContext, useState, useContext} from 'react';

const TabContext = createContext();

export const TabProvider = ({children}) => {
  const [activeTab, setActiveTab] = useState('Dashboard');

  return (
    <TabContext.Provider value={{activeTab, setActiveTab}}>
      {children}
    </TabContext.Provider>
  );
};

export const useTab = () => {
  return useContext(TabContext);
};
