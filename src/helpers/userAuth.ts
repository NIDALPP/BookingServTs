import dotenv from 'dotenv';
import  jwt  from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
dotenv.config()

interface JwtPayload{
    role:string
    userId:string
}
declare global {
    namespace Express {
        interface Request {
            payload?: JwtPayload;
            role: string;
            userId: string;
        }
    }
}
interface resBody {
    message: string,
    data?: any,
}




export const authUser = (req: Request, res: Response<resBody>, next: NextFunction): void => {
    try {
        const authHeader = req.headers['authorization']
        if (!authHeader) {
            res.status(401).json({ message: 'no authorization header' })
        }
        const bearerToken:any=authHeader?.split(' ')

        if(bearerToken.length !==2||bearerToken[0]!=='Bearer'){
            res.status(401).json({ message: 'invalid authorization header' })
        }
        const token = bearerToken[1]

        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET||'',(err:any,decoded:any)=>{
            if(err){
                const message = err.name==='JsonWebTokenError'?'Unauthorized':err.message
                res.status(401).json({ message })
            }
            const payload=decoded as JwtPayload
            const {role,userId}=payload

            req.payload=payload
            req.role=role
            req.userId=userId

            if (role!=='user'){
                res.status(403).json({ message: 'Forbidden' })
                }
                next()

        })



    } catch (error:any) {
        res.status(500).json({ message: error.message })

    }
}