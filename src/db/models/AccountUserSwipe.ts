import Sequelize, { DataTypeUUID } from 'sequelize';
import { AccountUserAttributes } from './AccountUser';

export interface AccountUserSwipeAttributes {
    swipedUser: DataTypeUUID;
    hasDislikedUser: boolean;
    hasLikedUser: boolean;

    accountUserUid?: AccountUserAttributes;
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
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        hasLikedUser: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        }
    };

    const options: Sequelize.DefineOptions<AccountUserSwipeInstance> = {
        paranoid: true
    };

    const AccountUserSwipe = sequelize.define<AccountUserSwipeInstance, AccountUserSwipeAttributes>('account_user_swipes', attributes, options);
    return AccountUserSwipe;
}