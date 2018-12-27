import Sequelize, { DataTypeUUID } from 'sequelize';
import { AccountUserSwipeModel } from './AccountUserSwipe';
import { AccountUserLocationModel, AccountUserLocationInstance, AccountUserLocationAttributes, initAccountUserLocation } from './AccountUserLocation';
import { AnyLengthString } from 'aws-sdk/clients/comprehend';
import db from '.';

export interface AccountUserAttributes {
    uid?: DataTypeUUID;
    password: string;
    profilePicture?: string;
    accountVerified?: boolean;
    phoneNumber: string;
    birthday?: Date;
    gender?: string;
    matchGender?: string;
    firstName?: string;
    lastName?: string;
    userCity?: string;
    token?: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;

    error?: any;
}

// export type AccountUserInstance = Sequelize.Instance<AccountUserAttributes> & AccountUserAttributes;
export interface AccountUserInstance extends Sequelize.Instance<AccountUserAttributes>, AccountUserAttributes {
    getLocations: Sequelize.BelongsToGetAssociationMixin<AccountUserLocationInstance>;
    setLocation: Sequelize.BelongsToSetAssociationMixin<AccountUserLocationInstance, AccountUserLocationInstance['id']>;
    createLocation: Sequelize.BelongsToCreateAssociationMixin<AccountUserLocationAttributes, AccountUserLocationInstance>;
}
export type AccountUserModel = Sequelize.Model<AccountUserInstance, AccountUserAttributes>;

export function initAccountUser(sequelize: Sequelize.Sequelize): AccountUserModel {
    const attributes: SequelizeAttributes<AccountUserAttributes> = {
        uid: {
            type: Sequelize.UUID,
            unique: true,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        profilePicture: {
            type: Sequelize.ARRAY(Sequelize.STRING),
            validate: {
                max: 4
            }
        },
        accountVerified: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        phoneNumber: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true

        },
        birthday: {
            type: Sequelize.DATEONLY,
            validate: {
                isDate: true
            }
        },
        gender: {
            type: Sequelize.ENUM('MALE', 'FEMALE', 'N/A')
        },
        matchGender: {
            type: Sequelize.ENUM('MALE', 'FEMALE', 'N/A')
        },
        firstName: {
            type: Sequelize.STRING,
            validate: {
                min: 2,
                max: 30
            }
        },
        lastName: {
            type: Sequelize.STRING,
            validate: {
                min: 2,
                max: 35
            }
        },
        userCity: {
            type: Sequelize.STRING,
            validate: {
                min: 2,
                max: 35
            }
        },
        description: {
            type: Sequelize.STRING(500),
            validate: {
                min: 2
            }
        }
    };
    const options: Sequelize.DefineOptions<AccountUserInstance> = {
        paranoid: true,
        indexes: [
            {
                unique: true,
                fields: ['uid', 'phoneNumber']
            }
        ],
        hooks: {
            afterCreate: (accountUser, options) => {
                db.AccountUserLocation.create({ userUid: accountUser.uid });
            }
        }
    };

    const AccountUser = sequelize.define<AccountUserInstance, AccountUserAttributes>('account_user', attributes, options);

    // reflect the associations also in the attributes interface
    AccountUser.associate = ({ AccountUserSwipe }: { AccountUserSwipe: AccountUserSwipeModel }) => {
        AccountUser.hasMany(AccountUserSwipe, { as: 'swipes' });
    };

    return AccountUser;
}