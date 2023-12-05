import { AccountType } from './../interface/account.interface';
import { Request, Response, NextFunction } from 'express';

class CheckAccount {

    public async isSuperAdmin(req: Request, res: Response, next: NextFunction) {
        const accountType: AccountType = res.locals.user.type;

        if (accountType === 'super_admin') {
            next();
        } else {
            return res.status(401).json({
                message: 'انت لست ادمن رئيسي',
            });
        }
    }


    public async isCustomer(req: Request, res: Response, next: NextFunction) {
        const accountType: AccountType = res.locals.user.type;

        if (accountType === 'customer') {
            next();
        } else {
            return res.status(401).json({
                message: 'انت لست زبون',
            });
        }
    }

    public async isAdmin(req: Request, res: Response, next: NextFunction) {
        const accountType: AccountType = res.locals.user.type;

        if (accountType === 'admin') {
            next();
        } else {
            return res.status(401).json({
                message: 'انت لست ادمن',
            });
        }
    }
}


export default new CheckAccount();