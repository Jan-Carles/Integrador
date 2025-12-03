"use strict";

module.exports = (sequelize, DataTypes) => {
    const Produto = sequelize.define(
        "Produto",
        {
            id_produto: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                field: 'id_produto'
            },
            nome_produto: {
                type: DataTypes.STRING,
                allowNull: false
            },
            preco_unitario: {
                type: DataTypes.NUMERIC(10, 2),
                allowNull: false
            },
        },
        {
            sequelize,
            tableName: "produto",
            schema: "public",
            freezeTableName: true,
            timestamps: false,
        },
    );

    return Produto;
};