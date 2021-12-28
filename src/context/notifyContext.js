import {createContext, useContext, useState,useEffect} from 'react';

const NotifyContext = createContext({});

const NotifyContextProvider = ({children}) => {
    const [notify, setNotify] = useState({open: false, type: undefined, msg: "" });
    const set_notify = (newData) => {
        setNotify(newData);
    };

    useEffect(() => {
      // props.check_current_user();
      const checkConnection = () => {
        window.addEventListener("online", () => {
          // Set hasNetwork to online when they change to online.
          set_notify({ type: "success", msg: "Your internet connect was restored", open: true, });
        });
        window.addEventListener("offline", () => {
          // Set hasNetwork to offline when they change to offline.
          set_notify({ btnText: "Refresh", onClick: () => window.location.reload(), btn: true, type: "error", msg: `You are currently offline.`, open: true, });
  
        });
      }
      checkConnection();
    }, [])  // eslint-disable-line react-hooks/exhaustive-deps
    return (
        <NotifyContext.Provider value={{notify,set_notify}}>
            {children}
        </NotifyContext.Provider>
    );
};

export const useNotifyContext = () => useContext(NotifyContext);

export default NotifyContextProvider;