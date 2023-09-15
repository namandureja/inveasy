import React, { useEffect } from "react";

import { App, URLOpenListenerEvent } from "@capacitor/app";
import { useNavigate } from "react-router-dom";

const AppUrlListener: React.FC<any> = () => {
  const navigate = useNavigate();

  useEffect(() => {
    App.addListener("appUrlOpen", (event: URLOpenListenerEvent) => {
      // Example url: https://beerswift.app/tabs/tab2
      // slug = /tabs/tab2
      console.log("App opened with URL: " + event.url);
      const slug = event.url.split(".app").pop();
      if (slug) {
        navigate(slug);
      }
    });
  }, []);

  return null;
};

export default AppUrlListener;
