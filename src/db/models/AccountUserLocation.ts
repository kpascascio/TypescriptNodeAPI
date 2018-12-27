import Sequelize, { DataTypeFloat } from 'sequelize';
import { AccountUserModel, AccountUserInstance } from './AccountUser';
import { getCityState } from '../../lib/helpers';

export interface AccountUserLocationAttributes {
    id?: number;
    latitude?: DataTypeFloat;
    longitude?: DataTypeFloat;
    city?: string;
    state?: string;
    userUid?: Sequelize.DataTypeUUID;
}

export interface AccountUserLocationInstance extends Sequelize.Instance<AccountUserLocationAttributes>, AccountUserLocationAttributes {
    getUser: Sequelize.BelongsToGetAssociationMixin<AccountUserInstance>;
    setUser: Sequelize.BelongsToSetAssociationMixin<AccountUserInstance, AccountUserInstance['uid']>;
    createUser: Sequelize.BelongsToCreateAssociationMixin<AccountUserLocationAttributes, AccountUserInstance>;
}

export type AccountUserLocationModel = Sequelize.Model<AccountUserLocationInstance, AccountUserLocationAttributes>;

export function initAccountUserLocation(sequelize: Sequelize.Sequelize): AccountUserLocationModel {
    const attributes: SequelizeAttributes<AccountUserLocationAttributes> = {
        latitude: {
            type: Sequelize.FLOAT,
            allowNull: true,
            defaultValue: 39.7684,
            validate: { min: -90, max: 90 }
        },
        longitude: {
            type: Sequelize.FLOAT,
            allowNull: true,
            defaultValue: -86.1581,
            validate: { min: -180, max: 180 }
        },
        city: {
            type: Sequelize.STRING
        },
        state: {
            type: Sequelize.STRING,
            validate: {
                max: 3
            }
        },
        userUid: {
            type: Sequelize.UUID,
            allowNull: false
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
        },
        hooks: {
            beforeCreate: async (location, options) => {
                console.log(location);
                const { city, state } = await getCityState(location.latitude.toString(), location.longitude.toString());
                location.set('city', city);
                location.set('state', state);
            }
        }
    };

    const AccountUserLocation = sequelize.define<AccountUserLocationInstance, AccountUserLocationAttributes>('account_user_location', attributes, options);

    AccountUserLocation.associate = ({ AccountUser }: { AccountUser: AccountUserModel }) => {
        AccountUserLocation.belongsTo(AccountUser, { as: 'user' });
    };
    return AccountUserLocation;
}