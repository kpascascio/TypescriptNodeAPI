import Sequelize, { DataTypeUUID } from 'sequelize';

interface AccountUserAttributes {
    uid: DataTypeUUID;
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
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}

type AccountUserInstance = Sequelize.Instance<AccountUserAttributes> & AccountUserAttributes;
type AccountUserModel = Sequelize.Model<AccountUserInstance, AccountUserAttributes>;

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
        phoneNumber: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true

        }
    };
    const options: Sequelize.DefineOptions<AccountUserInstance> = {
        paranoid: true
    };

    const AccountUser = sequelize.define<AccountUserInstance, AccountUserAttributes>('account_user', attributes, options);

    return AccountUser;
}