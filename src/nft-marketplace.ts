import { BigInt, Address } from "@graphprotocol/graph-ts";
import {
  ItemBought as ItemBoughtEvent,
  ItemCanceled as ItemCanceledEvent,
  ItemListed as ItemListedEvent,
} from "../generated/NftMarketplace/NftMarketplace";
import {
  ItemListed,
  ActiveItem,
  ItemBought,
  ItemCanceled,
} from "../generated/schema";

export function handleItemBought(event: ItemBoughtEvent): void {
  let itemId = getIdFromEventParams(
    event.params.tokenId,
    event.params.nftAddress
  );
  let itemBought = ItemBought.load(itemId);
  let activeItem = ActiveItem.load(itemId);
  if (!itemBought) {
    itemBought = new ItemBought(itemId);
    itemBought.buyer = event.params.buyer;
    itemBought.nftAddress = event.params.nftAddress;
    itemBought.tokenId = event.params.tokenId;
    activeItem!.buyer = event.params.buyer;

    itemBought.save();
    activeItem!.save();
  }
}

export function handleItemCanceled(event: ItemCanceledEvent): void {
  let itemId = getIdFromEventParams(
    event.params.tokenId,
    event.params.nftAddress
  );
  let itemCanceled = ItemCanceled.load(itemId);
  let activeItem = ActiveItem.load(itemId);
  if (!itemCanceled) {
    itemCanceled = new ItemCanceled(itemId);
  }

  itemCanceled.seller = event.params.seller;
  itemCanceled.nftAddress = event.params.nftAddress;
  itemCanceled.tokenId = event.params.tokenId;
  activeItem!.buyer = Address.fromString(
    "0x000000000000000000000000000000000000dEaD"
  );
  itemCanceled.save();
  activeItem!.save();
}

export function handleItemListed(event: ItemListedEvent): void {
  let itemId = getIdFromEventParams(
    event.params.tokenId,
    event.params.nftAddress
  );
  let itemListed = ItemListed.load(itemId);
  let activeItem = ActiveItem.load(itemId);
  if (!itemListed) {
    itemListed = new ItemListed(itemId);
  }
  if (!activeItem) {
    activeItem = new ActiveItem(itemId);
  }
  itemListed.seller = event.params.seller;
  activeItem.seller = event.params.seller;
  itemListed.nftAddress = event.params.nftAddress;
  activeItem.nftAddress = event.params.nftAddress;
  itemListed.tokenId = event.params.tokenId;
  activeItem.tokenId = event.params.tokenId;
  itemListed.price = event.params.price;
  activeItem.price = event.params.price;

  activeItem.buyer = Address.fromString(
    "0x0000000000000000000000000000000000000000"
  );

  itemListed.save();
  activeItem.save();
}

function getIdFromEventParams(tokenId: BigInt, nftAddress: Address): string {
  return tokenId.toHexString() + nftAddress.toHexString();
}
