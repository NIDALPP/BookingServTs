import { Router } from 'express';
import  {bookingService}  from '../controller/bookingController';
const {findAll,addToCart,placeOrder}=bookingService
import { catService } from '../controller/catController';
const {showAllCat,showAllProduct}=catService

export default(router:Router): void =>{
    router.post('/findProducts',findAll)
    router.post('/addToCart',addToCart)
    router.post('/placeOrder',placeOrder)
    router.post('/ShowCategories',showAllCat)
    router.post('/ShowProducts',showAllProduct)
}