import store from "./store";
import AppNavigation from "./navigation/appNavigation";
import { Provider } from "react-redux";
import "./App.css";

function App() {
  
  return (
    <>
      <Provider store={store}>
        <AppNavigation />
      </Provider>
    </>
  );
}

export default App;
