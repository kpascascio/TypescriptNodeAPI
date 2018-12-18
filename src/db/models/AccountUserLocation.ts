import Sequelize, { DataTypeFloat } from 'sequelize';
import { AccountUserModel } from './AccountUser';
export interface AccountUserLocationAttributes {
    latitude: DataTypeFloat;
    longitude: DataTypeFloat;
}

export type AccountUserLocationInstance = Sequelize.Instance<AccountUserLocationAttributes> & AccountUserLocationAttributes;
export type AccountUserLocationModel = Sequelize.Model<AccountUserLocationInstance, AccountUserLocationAttributes>;

export function initAccountUserLocation(sequelize: Sequelize.Sequelize): AccountUserLocationModel {
    const attributes: SequelizeAttributes<AccountUserLocationAttributes> = {
        latitude: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 39.7684,
            validate: { min: -90, max: 90 }
        },
        longitude: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 86.1581,
            validate: { min: -180, max: 180 }
        }
    };

    const options: Sequelize.DefineOptions<AccountUserLocationInstance> = {
        paranoid: false,
        validate: {
            bothCoordsOrNone() {
                if ((this.latitude === null) !== (this.longitude === null)) {
                    throw new Error('Require either both latitude and longitude or neither');
                }
            }
        }
    };

    const AccountUserLocation = sequelize.define<AccountUserLocationInstance, AccountUserLocationAttributes>('account_user_location', attributes, options);

    AccountUserLocation.associate = ({ AccountUser }: { AccountUser: AccountUserModel }) => {
        AccountUserLocation.belongsTo(AccountUser);
    };

    return AccountUserLocation;
}