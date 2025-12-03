"use strict";

module.exports = (sequelize, DataTypes) => {
    const ItemVenda = sequelize.define(
        "ItemVenda",
        {
            id_item_venda: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                field: 'id_item_venda'
            },
            id_venda: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            id_produto: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            quantidade: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            subtotal: {
                type: DataTypes.NUMERIC(10, 2),
                allowNull: false
            },
        },
        {
            sequelize,
            tableName: "item_venda",
            schema: "public",
            freezeTableName: true,
            timestamps: false,
        },
    );

    ItemVenda.associate = function (models) {
        // Um ItemVenda pertence a uma Venda (N:1)
        ItemVenda.belongsTo(models.Venda, {
            foreignKey: "id_venda",
            targetKey: "id_venda",
            as: 'venda'
        });
        // Um ItemVenda se refere a um Produto (N:1)
        ItemVenda.belongsTo(models.Produto, {
            foreignKey: "id_produto",
            targetKey: "id_produto",
            as: 'produto'
        });
    };

    return ItemVenda;
};