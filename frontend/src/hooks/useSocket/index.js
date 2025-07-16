import React, { useMemo, useEffect } from "react";
import openSocket from "socket.io-client";
import { getBackendUrl } from "../../config";

const useProvideSocket = () => {
  const socket = useMemo(() => {
    const token = localStorage.getItem("token");
    const socket = openSocket(getBackendUrl() + "1", {
      query: {
        token: JSON.parse(token),
      },
      transports: ["websocket"],
    });
    return socket;
  }, []);

  useEffect(() => {
    socket.on("ready", () => {
      //console.log("connected");
    });

    socket.on("tokenExpired", async (message) => {
      //console.log(message); // Exibe a mensagem "Token expirado. Por favor, renove seu token."
      
      // Lógica para renovar o token
      try {
        const response = await fetch(getBackendUrl() + "/refresh-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: JSON.parse(localStorage.getItem("token")),
          }),
        });

        if (!response.ok) {
          throw new Error("Erro ao renovar o token");
        }

        const data = await response.json();
        const newToken = data.token;
        localStorage.setItem("token", JSON.stringify(newToken));

        // Reconectar o socket com o novo token
        socket.io.opts.query.token = newToken;
        socket.connect();
      } catch (error) {
        console.error("Falha ao renovar o token:", error);
        // Redirecionar para a página de login ou outra lógica de tratamento de erro
      }
    });

    return () => {
      socket.off("ready");
      socket.off("tokenExpired");
    };
  }, [socket]);

  return socket;
};

export default useProvideSocket;
