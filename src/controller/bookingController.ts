import { controllerService } from "../utils/connectors";
import { Request, Response } from "express";
interface reqBody{
    productId:string,
    userId:string,
    quantity:number,
    address:string,
    cart:JSON,
    status:string,

    
}

let { find, updateOne, findOne, create } = controllerService
export const bookingService = {
    addToCart: async (req: Request<{},{},reqBody>, res: Response): Promise<void> => {
        try {
            const { productId,userId } = req.body;
            const quantity = parseInt(req.body.quantity as unknown as string, 10);
            if (isNaN(quantity)) {
                res.status(400).json({ message: "Invalid quantity provided." });
                return;
            }
            if (!userId) {
                res.status(401).json({ message: "User not authenticated." });
            }

            if (!productId || !quantity) {
                res.status(400).json({ message: "Product ID and quantity are required." });
            }

            const [productResponse, userResponse] = await Promise.all([
                findOne("Product", { productId }),
                findOne("User", { userId }),
            ]);

            const product = productResponse?.data;
            const user = userResponse?.data;

            if (!user) {
                res.status(404).json({ message: "User not found." });
            }
            if (!product) {
                res.status(404).json({ message: "Product not found." });
            }
            if (product.stock < quantity) {
                res.status(400).json({ message: "Not enough stock for the product." });
            }

            let cartResponse = await findOne("Cart", { userId });
            let cart = cartResponse?.data;
            if (!cart) {
                const newCartResponse = await create("Cart", { userId, items: [] });
                cart = newCartResponse?.data;
            }

            const existingItem = cart.items.find((item: any) => item.productId === productId);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ productId, quantity: quantity, price: product.price });
            }

            product.stock -= quantity;
            await updateOne("Product", { productId }, { stock: product.stock });

            const updateResponse = await updateOne("Cart", { userId }, { items: cart.items });
            if (!updateResponse) {
                res.status(500).json({ message: "Failed to update cart." });
            }

            const cartData = await findOne("Cart", { userId });
            const cartItems = {
                cartId: cartData?.data.cartId,
                userId: cartData?.data.userId,
                items: cartData?.data.items,
            };

            res.status(200).json({ message: "Product added to cart successfully.", cartItems });
        } catch (error: any) {
            console.error("Error in addToCart:", error.message || error);
            res.status(500).json({ message: "An error occurred while adding to cart." });
        }

    },
    findAll: async (req: Request, res: Response) => {
        try {
            const productResponse = await find("Product")
            res.status(200).send(productResponse.data)
        } catch (error: any) {
            console.error(error)
            res.status(error.productResponse?.status || 500).send({ error: error.message })

        }
    },
        placeOrder: async (req: Request<{}, {}, reqBody>, res: Response): Promise<void> => {
            try {
                const { address,userId } = req.body;
    
                if (!userId) {
                    res.status(400).json({ message: "User ID is required." });
                    return;
                }
    
                const userResponse = await findOne("User", { userId });
                const user = userResponse?.data;
                if (!user) {
                    res.status(404).json({ message: "User not found." });
                    return;
                }
    
                const cartResponse = await findOne("Cart", { userId });
                const cart = cartResponse?.data;
                if (!cart || cart.items.length === 0) {
                    res.status(400).json({ message: "Cart is empty. Add items to your cart before placing an order." });
                    return;
                }
    
                let totalAmount = 0;
                for (const item of cart.items) {
                    const productResponse = await findOne("Product", { productId: item.productId });
                    const product = productResponse?.data;
    
                    if (!product) {
                        res.status(404).json({ message: `Product not found: ${item.productId}` });
                        return;
                    }
    
                    totalAmount += item.quantity * product.price;
                }
    
                const orderResponse = await create("order", {
                    userId,
                    items: cart.items,
                    totalAmount,
                    status: "Placed",
                    address,
                });
                console.log(orderResponse);
                
    
                const order = orderResponse?.data;
                if (!orderResponse) {
                    res.status(500).json({ message: "Failed to create the order." });
                    return;
                }
    
                // Clear the cart after successful order creation
                await updateOne("Cart", { userId }, { items: [] });
    
                res.status(200).json({ message: "Order placed successfully.", order });
            } catch (error: any) {
                console.error("Error in placeOrder:", error.message || error);
                res.status(500).json({ message: "An error occurred while placing the order." });
            }
        },
    };
    






