"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";

import type { CartLine, WishlistLine } from "@/types";
import { useLocalArray, writeLocalArray } from "@/hooks/use-local-storage";

const CART_KEY = "dds.cart.v1";
const WISHLIST_KEY = "dds.wishlist.v1";

type PanelName = "cart" | "wishlist" | "search" | "auth" | "menu" | null;

interface StoreContextValue {
  cart: CartLine[];
  wishlist: WishlistLine[];
  hydrated: boolean;
  panel: PanelName;
  openPanel: (panel: Exclude<PanelName, null>) => void;
  closePanel: () => void;
  addToCart: (line: CartLine, options?: { silent?: boolean; open?: boolean }) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;
  toggleWishlist: (line: WishlistLine) => void;
  isWishlisted: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;
  cartCount: number;
  cartSubtotal: number;
  cartSavings: number;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function lineKey(line: Pick<CartLine, "productId" | "size" | "color">) {
  return [line.productId, line.size ?? "-", line.color ?? "-"].join("::");
}

/**
 * Cart and wishlist live in localStorage so a guest's bag survives a refresh
 * and stays in sync across tabs. Reads go through `useLocalArray`, which is an
 * external-store subscription rather than a mount effect.
 */
export function StoreProvider({ children }: { children: ReactNode }) {
  const { value: cart, hydrated } = useLocalArray<CartLine>(CART_KEY);
  const { value: wishlist } = useLocalArray<WishlistLine>(WISHLIST_KEY);
  const [panel, setPanel] = useState<PanelName>(null);

  const setCart = useCallback(
    (updater: (current: CartLine[]) => CartLine[]) => {
      writeLocalArray(CART_KEY, updater(cart));
    },
    [cart]
  );

  const setWishlist = useCallback(
    (updater: (current: WishlistLine[]) => WishlistLine[]) => {
      writeLocalArray(WISHLIST_KEY, updater(wishlist));
    },
    [wishlist]
  );

  const openPanel = useCallback((next: Exclude<PanelName, null>) => setPanel(next), []);
  const closePanel = useCallback(() => setPanel(null), []);

  const addToCart = useCallback<StoreContextValue["addToCart"]>(
    (line, options) => {
      const key = lineKey(line);
      const existing = cart.find((item) => lineKey(item) === key);
      let blocked = false;

      if (existing) {
        const nextQty = Math.min(existing.quantity + line.quantity, line.maxQuantity);
        blocked = nextQty === existing.quantity;
        setCart((current) =>
          current.map((item) =>
            lineKey(item) === key
              ? { ...item, quantity: nextQty, maxQuantity: line.maxQuantity }
              : item
          )
        );
      } else {
        setCart((current) => [
          ...current,
          { ...line, quantity: Math.min(line.quantity, line.maxQuantity) },
        ]);
      }

      if (!options?.silent) {
        if (blocked) {
          toast.warning("No more stock available", {
            description: `Only ${line.maxQuantity} left for this size and colour.`,
          });
        } else {
          toast.success("Added to bag", { description: line.name });
        }
      }
      if (options?.open !== false && !blocked) setPanel("cart");
    },
    [cart, setCart]
  );

  const updateQuantity = useCallback(
    (key: string, quantity: number) => {
      setCart((current) =>
        current
          .map((item) =>
            lineKey(item) === key
              ? { ...item, quantity: Math.max(0, Math.min(quantity, item.maxQuantity)) }
              : item
          )
          .filter((item) => item.quantity > 0)
      );
    },
    [setCart]
  );

  const removeFromCart = useCallback(
    (key: string) => setCart((current) => current.filter((item) => lineKey(item) !== key)),
    [setCart]
  );

  const clearCart = useCallback(() => writeLocalArray(CART_KEY, []), []);

  const toggleWishlist = useCallback(
    (line: WishlistLine) => {
      const exists = wishlist.some((item) => item.productId === line.productId);
      setWishlist((current) =>
        exists
          ? current.filter((item) => item.productId !== line.productId)
          : [...current, line]
      );
      if (exists) toast("Removed from wishlist", { description: line.name });
      else toast.success("Saved to wishlist", { description: line.name });
    },
    [wishlist, setWishlist]
  );

  const removeFromWishlist = useCallback(
    (productId: string) =>
      setWishlist((current) => current.filter((item) => item.productId !== productId)),
    [setWishlist]
  );

  const value = useMemo<StoreContextValue>(() => {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartSubtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const cartSavings = cart.reduce(
      (sum, item) =>
        sum +
        (item.compareAtPrice && item.compareAtPrice > item.unitPrice
          ? (item.compareAtPrice - item.unitPrice) * item.quantity
          : 0),
      0
    );

    return {
      cart,
      wishlist,
      hydrated,
      panel,
      openPanel,
      closePanel,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      toggleWishlist,
      removeFromWishlist,
      isWishlisted: (productId: string) => wishlist.some((item) => item.productId === productId),
      cartCount,
      cartSubtotal,
      cartSavings,
    };
  }, [
    cart,
    wishlist,
    hydrated,
    panel,
    openPanel,
    closePanel,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    toggleWishlist,
    removeFromWishlist,
  ]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used inside <StoreProvider>");
  return context;
}
