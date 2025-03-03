import { createRoot } from "react-dom/client";
// import { App } from "./App";

const container = document.getElementById("app");
const root = createRoot(container)
import { useState } from "react";

import '../web-component/iot-widget-wc'

function App() {


    const [asset, setAsset] = useState("VA7u2rx0MPfzb6h");
    const [period, setPeriod] = useState("30d");



    return (
        <div className="App">
            <ul>
                <li>
                    <button onClick={() => setAsset("VA7u2rx0MPfzb6h")}>Site A: Kitchen Sink</button>
                </li>
                <li>
                    <button onClick={() => setAsset("pw9fDHQT7GgbL4F")}>Site B: Mess Room Sink</button>
                </li>
            </ul>
            <br/>
            <ul>
                <li>
                    <button onClick={() => setPeriod("30d")}>30d</button>
                </li>
                <li>
                    <button onClick={() => setPeriod("7d")}>7d</button>
                </li>
            </ul>
            <br/>
            <iot-widget style={{width: '500px', border: '1px solid #a4c7ff'}} asset={asset} period={period}></iot-widget>
        </div>
    );
}

root.render(<App/>);




