import React from "react";
import { Player, Item } from "../data/DataTypes";
import { mockItems } from "../data/MockData";

interface Props {
  player: Player;
  onItemPurchase: (playerId: number, itemId: number) => void;
}

const ItemSelection: React.FC<Props> = ({ player, onItemPurchase }) => (
  <div>
    <h3>Shop Items</h3>
    <ul>
      {mockItems.map((item) => (
        <li key={item.id}>
          {item.name} - {item.price} coins
          <button
            disabled={player.money < item.price}
            onClick={() => onItemPurchase(player.id, item.id)}
          >
            Buy
          </button>
        </li>
      ))}
    </ul>
  </div>
);

export default ItemSelection;