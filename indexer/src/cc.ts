import type { Config } from "https://esm.sh/@apibara/indexer";
import type { Block, Starknet } from "https://esm.sh/@apibara/indexer/starknet";
import type { Mongo } from "https://esm.sh/@apibara/indexer/sink/mongo";
import type { Console } from "https://esm.sh/@apibara/indexer/sink/console";
import { hash } from "https://esm.sh/starknet";

import { MONGO_CONNECTION_STRING } from "./utils/constants.ts";

const GAME = "0x0148079ed14213e39516a4d366395b0feef93f6f31af364a1022bb2da454d7fa";
const START = 880650;

function eventKey(name: string) {
  const h = BigInt(hash.getSelectorFromName(name));
  return `0x${h.toString(16).padStart(64, "0")}`;
}

export const MINT = eventKey("cc_starknet::Dungeons::Minted");


const filter = {
  header: { weak: true },
  events: [
    { fromAddress: GAME, keys: [MINT] },
  ],
};

export const config: Config<Starknet, Mongo | Console> = {
  streamUrl: "https://goerli.starknet.a5a.ch",
  network: "starknet",
  filter,
  startingBlock: START,
  finality: "DATA_STATUS_PENDING",
  sinkType: "mongo",
  sinkOptions: {
    connectionString: MONGO_CONNECTION_STRING,
    database: "mongo_goerli",
    collectionName: "beasts",
    // @ts-ignore - indexer package not updated
    entityMode: true,
  },
};

export default function transform({ header, events }: Block) {
  const { timestamp } = header!;

  return events.flatMap(({ event }) => {
    switch (event.keys[0]) {
      default: {
        console.warn("Unknown event", event.keys[0]);
        return [];
      }
    }
  });
}
