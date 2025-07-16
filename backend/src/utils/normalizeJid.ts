import { jidDecode, isJidUser } from "@whiskeysockets/baileys";

/**
 * Converte JIDs do tipo ...@lid para ...@s.whatsapp.net
 */
export function normalizeJid(jid?: string): string {
  if (!jid) return "";
  // se já é user‑jid normal, devolve
  if (isJidUser(jid) && !jid.endsWith("@lid")) return jid;

  // tenta decodificar LID
  const decoded = jidDecode(jid);
  if (decoded?.server === "lid" && decoded.user) {
    return `${decoded.user}@s.whatsapp.net`;
  }
  return jid; // fallback
}
