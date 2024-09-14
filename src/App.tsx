import "./App.css";
import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css"; //icons
import "primeflex/primeflex.css"; // flex
import Paginator from "./components/Paginator";

function App() {
  return (
    <>
      <Paginator />
    </>
  );
}

export default App;
