/*
import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const BasicWebSocketComponent = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const client = useRef(null);

  useEffect(() => {
    const connect = () => {
      client.current = new Client({
        webSocketFactory: () => new SockJS("http://localhost:8080/stomp"),
        debug: function (str) {
          console.log(str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          console.log("Connected");
          if (client.current) {
            client.current.subscribe("/topic/saveResult", (msg) => {
              setResponse(msg.body);
            });
          }
        },
        onStompError: (frame) => {
          console.error(frame);
        },
      });

      client.current.activate();
    };

    const disconnect = () => {
      if (client.current) {
        client.current.deactivate();
      }
    };

    connect();

    return () => {
      disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (client.current && client.current.connected) {
      client.current.publish({
        destination: "/app/project/1/universe/1",
        body: JSON.stringify({ content: message }),
      });
    } else {
      console.error("STOMP client is not initialized.");
    }
  };

  return (
    <div>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
      {response && <div>Response: {response}</div>}
    </div>
  );
};

export default BasicWebSocketComponent;*/

import { useState, useEffect, useRef, useCallback } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import UniverseComponent from "./UniverseComponent.jsx";

const BasicWebSocketComponent = () => {
  const [response, setResponse] = useState("");
  const [universes, setUniverses] = useState([{}]);
  const client = useRef(null);

  useEffect(() => {
    const connect = () => {
      client.current = new Client({
        webSocketFactory: () => new SockJS("http://localhost:8080/stomp"),
        debug: function (str) {
          console.log(str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          console.log("Connected");
          if (client.current) {
            client.current.subscribe("/universe/saveResult", (message) => {
              console.log("Message Received:", message.body);
              setResponse(message.body);
            });
          }
        },
        onStompError: (frame) => {
          console.error(frame);
        },
      });

      client.current.activate();
    };

    const disconnect = () => {
      if (client.current) {
        client.current.deactivate();
      }
    };

    connect();

    return () => {
      disconnect();
    };
  }, []);

  const handleUpdate = useCallback((index, data) => {
    setUniverses((prevUniverses) => {
      const newUniverses = [...prevUniverses];
      newUniverses[index] = data;
      return newUniverses;
    });
  }, []);

  const sendMessage = useCallback(() => {
    if (client.current && client.current.connected) {
      const messageBody = JSON.stringify(universes);
      console.log("Sending message:", messageBody);

      client.current.publish({
        destination:
          "/app/project/Project_a274df0e-4a4d-465a-9ba2-f9d34029da8d/universe/Universe_967b1800-c283-4966-8b97-809ef2f5ec5b",
        body: messageBody,
        headers: { "content-type": "application/json" },
      });
    } else {
      console.error("STOMP client is not initialized.");
    }
  }, [universes]);

  const addUniverse = useCallback(() => {
    setUniverses((prev) => [...prev, {}]);
  }, []);

  return (
    <div>
      {universes.map((universe, index) => (
        <UniverseComponent
          key={index}
          index={index}
          initialData={universe}
          onUpdate={handleUpdate}
        />
      ))}
      <button onClick={addUniverse}>Add Universe</button>
      <button onClick={sendMessage}>Send All</button>
      {response && <div>Response: {response}</div>}
    </div>
  );
};

export default BasicWebSocketComponent;
