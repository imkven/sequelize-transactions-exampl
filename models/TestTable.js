module.exports = (sequelize, DataTypes) => {
    const TestTable = sequelize.define('TestTable', {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      class: {
        type: DataTypes.STRING,
      },
      amount: {
        type: DataTypes.INTEGER,
      },
    });
  
    TestTable.associate = (models) => {};
  
    return TestTable;
  };
  