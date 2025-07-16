// src/cache/messageCache.ts
import { proto } from "@whiskeysockets/baileys";

/**
 * Mapa em memória que guarda cada mensagem recebida,
 * indexada pelo ID da mensagem (key.id)
 */
export const messageCache = new Map<string, proto.IWebMessageInfo>();

/* Helpers opcionais — deixam o código de outros módulos mais limpo */
export const cacheSet = (msg: proto.IWebMessageInfo) => {
  if (msg.key?.id) messageCache.set(msg.key.id, msg);
};

export const cacheGet = (id: string | undefined) =>
  id ? messageCache.get(id) : undefined;
