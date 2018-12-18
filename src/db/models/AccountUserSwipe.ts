import Sequelize, { DataTypeUUID } from 'sequelize';
import { AccountUserModel } from './AccountUser';

export interface AccountUserSwipeAttributes {
    swipedUser: DataTypeUUID;
    hasDislikedUser: boolean;
}

export type AccountUserSwipeInstance = Sequelize.Instance<AccountUserSwipeAttributes> & AccountUserSwipeAttributes;
export type AccountUserSwipeModel = Sequelize.Model<AccountUserSwipeInstance, AccountUserSwipeAttributes>;

export function initAccountUserSwipe(sequelize: Sequelize.Sequelize): AccountUserSwipeModel {
    const attributes: SequelizeAttributes<AccountUserSwipeAttributes> = {
        swipedUser: {
            type: Sequelize.UUID,
            allowNull: false
        },
        hasDislikedUser: {
            type: Sequelize.BOOLEAN
        }
    };

    const options: Sequelize.DefineOptions<AccountUserSwipeInstance> = {
        paranoid: true
    };

    const AccountUserSwipe = sequelize.define<AccountUserSwipeInstance, AccountUserSwipeAttributes>('account_user_swipes', attributes, options);

    return AccountUserSwipe;
}