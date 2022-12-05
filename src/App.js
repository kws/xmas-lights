import { SliderPicker, CirclePicker } from 'react-color';
import './App.css';
import {useState, useEffect} from "react";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { v4 as uuidv4 } from 'uuid';
import { useCookies } from 'react-cookie';

function App() {
  const [cookie, setCookie] = useCookies(['sfmood']);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#FF0000");
  const [selectedColor, setSelectedColor] = useState(color);
  const { sendMessage, lastMessage, readyState } = useWebSocket("wss://mood.sfintra.net");

  useEffect(() => {
    if (!cookie.uuid) {
      setCookie('uuid', uuidv4())
    }
  }, [cookie, setCookie])

  useEffect(() => {
    console.log(color);
    sendMessage(JSON.stringify({uuid: cookie.uuid, rgb: selectedColor.rgb, name}));
  }, [selectedColor, name, cookie]);

  const setButtonColor = (r, g, b) => {
    setColor({rgb: {r, g, b, a:1}});
    setSelectedColor({rgb: {r, g, b, a:1}});
  }


  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return (
    <main className="App">

        {readyState === ReadyState.OPEN &&
          <>
            <div>
              <button style={{ backgroundColor: 'black', width: '50px', height: '25px'}} onClick={() => setButtonColor(0, 0, 0)}></button>
              <button style={{ backgroundColor: 'red', width: '50px', height: '25px'}} onClick={() => setButtonColor(255, 0 ,0)}></button>
              <button style={{ backgroundColor: 'green', width: '50px', height: '25px'}} onClick={() => setButtonColor(0, 255, 0)}></button>
              <button style={{ backgroundColor: 'blue', width: '50px', height: '25px'}} onClick={() => setButtonColor(0, 0, 255)}></button>
              <button style={{ backgroundColor: '#FF0', width: '50px', height: '25px'}} onClick={() => setButtonColor(255, 255 ,0)}></button>
              <button style={{ backgroundColor: '#0FF', width: '50px', height: '25px'}} onClick={() => setButtonColor(0, 255, 255)}></button>
              <button style={{ backgroundColor: '#F0F', width: '50px', height: '25px'}} onClick={() => setButtonColor(255, 0, 255)}></button>
            </div>
          </>


        }
        {readyState !== ReadyState.OPEN &&

          <p>{connectionStatus}</p>
        }


    </main>
  );
}

export default App;
