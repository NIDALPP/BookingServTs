import express, { Application, Request, Response,NextFunction } from 'express'
import morgan from 'morgan';
import * as dotenv from "dotenv";
import http from 'http'
import bookingRouter from './router/bookingRouter';

dotenv.config()


const app: Application = express();
app.use(morgan('dev'))
app.use(express.json())
const router=express.Router()
bookingRouter(router)

app.use('/booking',router)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500).send({
        error: {
            status: err.status || 500,
            message: err.message,
        },
    });
});
const port: any = process.env.PORT
console.log('hello world')
const server=http.createServer(app)

server.listen(port, () => {

    console.log(`connected successfully http://localhost:3002/ ,on the port ${port}`)
})