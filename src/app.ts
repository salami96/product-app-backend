import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { router } from './routes';
import path from 'path';


export class App {
    private express: express.Application;
    secret: string;
    mongoUrl: string;
    port: number | string;

    constructor() {
        if (!process.env.PORT) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const env = require('../enviroment');
            this.secret = env.secret;
            this.port = env.port;
            this.mongoUrl = env.mongoUrl;
        } else {
            this.secret = process.env.SECRET;
            this.mongoUrl = process.env.MONGOURL;
            this.port = process.env.PORT;
        }


        this.express = express();
        this.express.use(cors());
        this.express.use(express.urlencoded({ extended: true }));
        this.express.use(express.json());
        this.listen();
        this.middlewares();
        this.database();
    }

    public getApp(): express.Application {
        return this.express;
    }

    private middlewares(): void {
        this.express.use(this.forceSSL);
    }

    private listen(): void {
        this.express.use('/api', async (req, res, next) => {
            try {
                if (!req.headers.authorization) {
                    res.statusCode = 403;
                    return res.send('Authorization key is required');
                } else {
                    if (req.headers.authorization === this.secret) {
                        next();
                    } else {
                        res.statusCode = 403;
                        return res.send('Authorization key is not valid');
                    }
                }
            } catch (error) {
                next(error.message);
            }
        });
        this.express.use('/api', router);
        // this.express.get('/', function(req, res){
            // res.sendFile(path.resolve(__dirname, '..') + '/public/app/home.html');
        // });
        this.express.use(express.static(path.resolve(__dirname, '..') + '/public/app'));
        this.express.get('/gerente', function(req, res){
            res.sendFile(path.resolve(__dirname, '..') + '/public/app/');
        });
        this.express.get('**', function(req, res){
            res.redirect('/');
        });
        this.express.listen(this.port, () => {
            console.log('Server running in port: ' + this.port);
        })
    }

    private database(): void {
        mongoose.connect(
            this.mongoUrl,
            {
                useUnifiedTopology: true,
                useNewUrlParser: true,
                useFindAndModify: false
            }
        );
    }

    forceSSL = function() {
        return function (req: express.Request, res: express.Response, next: express.NextFunction): void {
            if (req.headers['x-forwarded-proto'] !== 'https') {
                return res.redirect(
                    ['https://', req.get('Host'), req.url].join('')
                );
            }
            next();
        }
    }
}
