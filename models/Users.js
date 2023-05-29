'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Users extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // 1. Users 모델에서
            this.hasMany(models.Chats, {
                // 2. Chats 모델에게 1:N 관계 설정을 합니다.
                sourceKey: 'userId', // 3. Users 모델의 userId 컬럼을
                foreignKey: 'UserId', // 4. Chats 모델의 UserId 컬럼과 연결합니다.
            });
        }
    }
    Users.init(
        {
            userId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            email: {
                allowNull: false,
                type: DataTypes.STRING,
                unique: true,
            },
            nickname: {
                allowNull: false,
                type: DataTypes.STRING,
                unique: true,
            },
            password: {
                allowNull: false, // NOT NULL
                type: DataTypes.STRING,
            },
            credit: {
                allowNull: false, // NOT NULL
                type: DataTypes.INTEGER,
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: 'Users',
        }
    );
    return Users;
};
