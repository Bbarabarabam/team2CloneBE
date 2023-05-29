'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Chats extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(models.Users, {
                // 2. Users 모델에게 N:1 관계 설정을 합니다.
                targetKey: 'userId', // 3. Users 모델의 userId 컬럼을
                foreignKey: 'UserId', // 4. Chats 모델의 UserId 컬럼과 연결합니다.
            });

            this.hasMany(models.Conversations, {
                // 2. Conversations 모델에게 1:N 관계 설정을 합니다.
                sourceKey: 'chatId', // 3. Chats 모델의 chatId 컬럼을
                foreignKey: 'ChatId', // 4. Conversations 모델의 ChatId 컬럼과 연결합니다.
            });
        }
    }
    Chats.init(
        {
            chatId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            UserId: {
                allowNull: false,
                type: DataTypes.INTEGER,
                references: {
                    model: 'Users', // Users 모델을 참조합니다.
                    key: 'userId', // Users 모델의 userId를 참조합니다.
                },
                onDelete: 'CASCADE', // 만약 Users 모델의 userId가 삭제되면, Posts 모델의 데이터가 삭제됩니다.
            },
            chatName: {
                allowNull: false, // NOT NULL
                type: DataTypes.STRING,
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
            modelName: 'Chats',
        }
    );
    return Chats;
};
