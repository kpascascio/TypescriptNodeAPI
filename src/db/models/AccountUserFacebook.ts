import Sequelize from 'sequelize';
import { AccountUserModel } from './AccountUser';

interface FacebookProfileModel {
    id: string;
    username: string;
    displayName: string;
    name: {
        familyName: string;
        givenName: string;
        middleName: string;
    };
    gender: string;
    profileUrl: string;
    emails: Array<{ value: string }>;
    provider: string;
    raw: string;
    _json: {
        email: string;
        first_name: string;
        last_name: string;
        name: string;
        id: string;
    };
}

export interface AccountUserFacebookAttributes {
    accessToken: string;
    profile?: FacebookProfileModel;
    refreshToken?: string;
}

export type AccountUserFacebookInstance = Sequelize.Instance<AccountUserFacebookAttributes> & AccountUserFacebookAttributes;

export type AccountUserFacebookModel = Sequelize.Model<AccountUserFacebookInstance, AccountUserFacebookAttributes>;

export function initAccountUserFacebook(sequelize: Sequelize.Sequelize): AccountUserFacebookModel {
    const attributes: SequelizeAttributes<AccountUserFacebookAttributes> = {
        accessToken: {
            type: Sequelize.STRING
        }
    };

    const options: Sequelize.DefineOptions<AccountUserFacebookInstance> = {
        paranoid: true
    };

    const AccountUserFacebook = sequelize.define<AccountUserFacebookInstance, AccountUserFacebookAttributes>('account_user_facebook', attributes, options);

    AccountUserFacebook.associate = ({ AccountUser }: {AccountUser: AccountUserModel}) => {
        AccountUserFacebook.belongsTo(AccountUser, {as: 'facebookId'});
    };
    return AccountUserFacebook;
}
