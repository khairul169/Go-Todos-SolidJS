import {
  HopeProvider,
  HopeThemeConfig,
  NotificationsProvider,
} from "@hope-ui/solid";
import Todos from "./Todos";

const theme: HopeThemeConfig = {
  initialColorMode: "dark",
};

const App = () => {
  return (
    <HopeProvider config={theme}>
      <NotificationsProvider>
        <Todos />
      </NotificationsProvider>
    </HopeProvider>
  );
};

export default App;
