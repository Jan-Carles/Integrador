"use strict";

module.exports = (sequelize, DataTypes) => {
    const Despesa = sequelize.define(
        "Despesa",
        {
            id_despesa: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                field: 'id_despesa'
            },
            data_despesa: {
                type: DataTypes.DATEONLY, 
                allowNull: false
            },
            tipo_despesa: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            descricao: {
                type: DataTypes.STRING(255)
            },
            valor: {
                type: DataTypes.NUMERIC(10, 2),
                allowNull: false,
                validate: {
                    min: 0.01 // Garante que o valor é positivo
                }
            },
        },
        {
            sequelize,
            tableName: "despesa",
            schema: "public",
            freezeTableName: true,
            timestamps: false,
        },
    );

    Despesa.associate = function (models) {
    };

    return Despesa;
};