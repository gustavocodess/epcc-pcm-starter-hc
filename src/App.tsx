import React, { useCallback, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { routes } from "src/routes";

import { AppHeader } from "src/modules/AppHeader/AppHeader";
import AppFooter from "src/components/AppFooter";
import { APIErrorProvider } from "src/components/APIErrorProvider";
import { APIErrorNotification } from "src/components/APIErrorNotification";
import { Provider } from "react-redux";
import store from "./store";
import { getCredentialStore } from "src/utils/httpClient/useAccessToken";
import { LoadingIndicator } from "src/components/LoadingIndicator/LoadingIndicator";
import { loadingType } from "src/components/LoadingIndicator/LoadingIndicatorType";
import CatchAllPage from "src/components/CatchAllPage/CatchAllPage";

import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import "./App.module.scss";
import { getToken, loadCurrencySetting } from "./modules/Auth/AuthServices";
import { config } from "./config";
import { PersistGate } from "redux-persist/lib/integration/react";
import persistStore from "redux-persist/es/persistStore";

import "./components/CustomProductBox/CustomProductBox.builder";
import "./components/CustomProductGrid/CustomProductGrid.builder";
import { Builder } from '@builder.io/react';
import '@builder.io/widgets';
import { safeLsSet } from "./utils/safeLS";

Builder.register('insertMenu', {
  name: 'Elasticpath PCM Components',
  items: [
    { name: 'Custom Product Box' },
    { name: 'Custom Product Grid' },
  ],
})

const persistor = persistStore(store);

const App: React.FC = () => {
  const [isBooted, setBooted] = useState(false);

  const getCurrency = useCallback(async () => {
    try {
      const response = await loadCurrencySetting();

      if (response && response.decimal_places) {
        safeLsSet("decimal_places", response.decimal_places);
      } else {
        safeLsSet("decimal_places", "0");
      }
    } catch (err) {
      safeLsSet("decimal_places", "0");
    }
  }, []);

  React.useEffect(() => {
    const init = async () => {
      try {
        await getCurrency();
        const { access_token, expires, client_id } = getCredentialStore();
        if (
          !access_token ||
          client_id !== config.clientId ||
          Math.floor(Date.now() / 1000) >= expires
        ) {
          await getToken();
        }
        setBooted(true);
      } catch (error) {
        //
      }
    };
    init();
  }, [getCurrency]);

  if (isBooted) {
    return (
      <Router>
        <APIErrorProvider>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <div className="app">
                <header className="app__header">
                  <AppHeader />
                  <APIErrorNotification />
                </header>
                <main className="app__main">
                  <Switch>
                    {routes.map((route) => (
                      <Route key={route.path} {...route} />
                    ))}
                    <Route component={CatchAllPage} />
                  </Switch>
                </main>
                <AppFooter />
                <aside className="app__compareoverlay"></aside>
              </div>
            </PersistGate>
          </Provider>
        </APIErrorProvider>
      </Router>
    );
  }
  return <LoadingIndicator type={loadingType.FULLPAGE} />;
};

export default App;
