"use strict";

module.exports = (sequelize, DataTypes) => {
    const Venda = sequelize.define(
        "Venda",
        {
            id_venda: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                field: 'id_venda'
            },
            data_venda: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            valor_total: {
                type: DataTypes.NUMERIC(10, 2),
                allowNull: false,
                defaultValue: 0
            },
        },
        {
            sequelize,
            tableName: "venda",
            schema: "public",
            freezeTableName: true,
            timestamps: false,
        },
    );

    Venda.associate = function (models) {
        // Uma Venda pode ter muitos Itens de Venda (1:N)
        Venda.hasMany(models.ItemVenda, {
             foreignKey: "id_venda",
             sourceKey: "id_venda",
             as: 'itens'
        });
    };

    return Venda;
};