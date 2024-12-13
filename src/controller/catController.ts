import { controllerService } from "../utils/connectors";
import { Request, Response } from "express";

let { aggregate } = controllerService

interface reqBody{
    categoryId:string,
    category:string
}

export const catService = {
    showAllCat: async (req: Request<{},{},reqBody>, res: Response): Promise<void> => {
        try {
            const { categoryId } = req.body
            const agg = [
                {
                    $match: { categoryId: categoryId }
                },
                {
                    $lookup: {
                        from: "categories",
                        localField: "categoryId",
                        foreignField: "parentId",
                        as: "subcategories"
                    }
                },
                {
                    $match: {
                        subcategories: { $ne: [] }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        categoryId: 1,
                        categoryName: "$name",
                        subcategories: {
                            $map: {
                                input: "$subcategories",
                                as: "subcategory",
                                in: {
                                    subcategoryName: "$$subcategory.name"
                                }
                            }
                        }
                    }
                }
            ]
            const categories = await aggregate("Category", agg)
            if (!categories || categories.length === 0) {
                res.status(404).json({ message: "No categories found." });
            }
            res.status(200).json({categories})
        } catch (error: any) {
            console.error(error)
            res.status(500).json({message:"Error finding categories"})
        }
    },
    showAllProduct:async(req:Request<{},{},reqBody>,res:Response):Promise<void>=>{
        try {
            const {category}=req.body
            const agg=[
                {
                    $match: { category: category }
                },
                {
                    $lookup: {
                        from: "categories",
                        localField: "category",
                        foreignField: "categoryId",
                        as: "category"
                    }
                },
                {
                    $unwind: {
                        path: "$category",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        _id: 0,
                        productId: 1,
                        productName: "$name",
                        image_url: 1,
                        price: 1,
                        categoryName: "$category.name",
                        categoryId: "$category.categoryId",
                    }
                }
    
            ]
            const response =await aggregate("Product",agg)
            res.status(200).json({response})
        } catch (error:any) {
            console.error(error)
            res.status(500).json({message:"Error finding products"})
            
        }
    }
}