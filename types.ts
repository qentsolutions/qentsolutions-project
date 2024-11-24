import { Card, List } from "@prisma/client";

export type ListWithCards = List & { cards: Card[] };

export type CardWithList = Card & { list: List };

export type Comment = {
  id: string;
  text: string;
  createdAt: string;
  user: {
    id: any;
    image: string;
    name: string;
  };
};
