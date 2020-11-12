const { Transaction } = require('sequelize');
const ParallelPromises = require('parallel-promises');
const { sequelize, TestTable } = require('./models');

async function init() {
    await TestTable.destroy({
        where: {
            class: ['1', '2'],
        },
    });

    await TestTable.bulkCreate([{
        class: '1',
        amount: 10,
    }, {
        class: '1',
        amount: 20,
    }, {
        class: '2',
        amount: 100,
    }, {
        class: '2',
        amount: 200,
    }]);
}

async function testA() {
    // Executing (8547d84c-560f-4cd0-a729-a307ecdacc00): START TRANSACTION;
    // Executing (8547d84c-560f-4cd0-a729-a307ecdacc00): SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    // Executing (5f1e8b8e-4f99-48d5-a952-93d0389e5d5a): SELECT sum("amount") AS "sum" FROM "TestTables" AS "TestTable" WHERE "TestTable"."class" = '1';
    // Executing (8547d84c-560f-4cd0-a729-a307ecdacc00): SELECT sum("amount") AS "sum" FROM "TestTables" AS "TestTable" WHERE "TestTable"."class" = '2';
    // Executing (8547d84c-560f-4cd0-a729-a307ecdacc00): SELECT sum("amount") AS "sum" FROM "TestTables" AS "TestTable" WHERE "TestTable"."class" = '2';
    // Executing (8547d84c-560f-4cd0-a729-a307ecdacc00): SELECT sum("amount") AS "sum" FROM "TestTables" AS "TestTable" WHERE "TestTable"."class" = '2';
    // Executing (8547d84c-560f-4cd0-a729-a307ecdacc00): SELECT sum("amount") AS "sum" FROM "TestTables" AS "TestTable" WHERE "TestTable"."class" = '2';
    // Executing (8547d84c-560f-4cd0-a729-a307ecdacc00): SELECT sum("amount") AS "sum" FROM "TestTables" AS "TestTable" WHERE "TestTable"."class" = '2';
    // Executing (8547d84c-560f-4cd0-a729-a307ecdacc00): SELECT sum("amount") AS "sum" FROM "TestTables" AS "TestTable" WHERE "TestTable"."class" = '2';
    // Executing (5f1e8b8e-4f99-48d5-a952-93d0389e5d5a): INSERT INTO "TestTables" ("id","class","amount","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5) RETURNING "id","class","amount","createdAt","updatedAt";

    await init();

    const t1tx = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    });
    const t2tx = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    });

    const listOfPromises = [
        {
            name: 't1Sum',
            function: TestTable.sum,
            thisArg: TestTable,
            args: ['amount', {
                where: {
                    class: '1',
                },
                transaction: t1tx,
            }],
        },
        {
            name: 't1Add',
            function: TestTable.create,
            thisArg: TestTable,
            args: [{
                class: '2',
                amount: 30,
            }, {
                transaction: t1tx,
            }],
        },
        {
            name: 't2Sum',
            function: TestTable.sum,
            thisArg: TestTable,
            args: ['amount', {
                where: {
                    class: '2',
                },
                transaction: t2tx,
            }],
        },
        {
            name: 't2Sum2',
            function: TestTable.sum,
            thisArg: TestTable,
            args: ['amount', {
                where: {
                    class: '2',
                },
                transaction: t2tx,
            }],
        },
        {
            name: 't2Sum3',
            function: TestTable.sum,
            thisArg: TestTable,
            args: ['amount', {
                where: {
                    class: '2',
                },
                transaction: t2tx,
            }],
        },
        {
            name: 't2Sum4',
            function: TestTable.sum,
            thisArg: TestTable,
            args: ['amount', {
                where: {
                    class: '2',
                },
                transaction: t2tx,
            }],
        },
        {
            name: 't2Sum5',
            function: TestTable.sum,
            thisArg: TestTable,
            args: ['amount', {
                where: {
                    class: '2',
                },
                transaction: t2tx,
            }],
        },
        {
            name: 't2Sum6',
            function: TestTable.sum,
            thisArg: TestTable,
            args: ['amount', {
                where: {
                    class: '2',
                },
                transaction: t2tx,
            }],
        },
    ];

    const p = await ParallelPromises.customPromiseAll(listOfPromises, 10);
    console.log('p', p);
}

// By this test, we can make sure read uncomitted is possible in same dbTx
async function testB() {
    await init();

    // Executing (de77a05e-91f6-4b3a-95c4-e5da551b907f): START TRANSACTION;
    // Executing (de77a05e-91f6-4b3a-95c4-e5da551b907f): SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    // Executing (de77a05e-91f6-4b3a-95c4-e5da551b907f): SELECT sum("amount") AS "sum" FROM "TestTables" AS "TestTable" WHERE "TestTable"."class" = '1';
    // Executing (de77a05e-91f6-4b3a-95c4-e5da551b907f): SELECT sum("amount") AS "sum" FROM "TestTables" AS "TestTable" WHERE "TestTable"."class" = '2';
    // Executing (de77a05e-91f6-4b3a-95c4-e5da551b907f): SELECT sum("amount") AS "sum" FROM "TestTables" AS "TestTable" WHERE "TestTable"."class" = '2';
    // Executing (de77a05e-91f6-4b3a-95c4-e5da551b907f): SELECT sum("amount") AS "sum" FROM "TestTables" AS "TestTable" WHERE "TestTable"."class" = '2';
    // Executing (de77a05e-91f6-4b3a-95c4-e5da551b907f): SELECT sum("amount") AS "sum" FROM "TestTables" AS "TestTable" WHERE "TestTable"."class" = '2';
    // Executing (de77a05e-91f6-4b3a-95c4-e5da551b907f): SELECT sum("amount") AS "sum" FROM "TestTables" AS "TestTable" WHERE "TestTable"."class" = '2';
    // Executing (de77a05e-91f6-4b3a-95c4-e5da551b907f): SELECT sum("amount") AS "sum" FROM "TestTables" AS "TestTable" WHERE "TestTable"."class" = '2';
    // Executing (de77a05e-91f6-4b3a-95c4-e5da551b907f): SELECT sum("amount") AS "sum" FROM "TestTables" AS "TestTable" WHERE "TestTable"."class" = '2';
    // Executing (de77a05e-91f6-4b3a-95c4-e5da551b907f): SELECT sum("amount") AS "sum" FROM "TestTables" AS "TestTable" WHERE "TestTable"."class" = '2';
    // Executing (de77a05e-91f6-4b3a-95c4-e5da551b907f): INSERT INTO "TestTables" ("id","class","amount","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5) RETURNING "id","class","amount","createdAt","updatedAt";
    // Executing (de77a05e-91f6-4b3a-95c4-e5da551b907f): SELECT sum("amount") AS "sum" FROM "TestTables" AS "TestTable" WHERE "TestTable"."class" = '2';
    // Executing (de77a05e-91f6-4b3a-95c4-e5da551b907f): SELECT sum("amount") AS "sum" FROM "TestTables" AS "TestTable" WHERE "TestTable"."class" = '2';
    // Executing (de77a05e-91f6-4b3a-95c4-e5da551b907f): SELECT sum("amount") AS "sum" FROM "TestTables" AS "TestTable" WHERE "TestTable"."class" = '2';
    // Executing (de77a05e-91f6-4b3a-95c4-e5da551b907f): SELECT sum("amount") AS "sum" FROM "TestTables" AS "TestTable" WHERE "TestTable"."class" = '2';
    // Executing (de77a05e-91f6-4b3a-95c4-e5da551b907f): SELECT sum("amount") AS "sum" FROM "TestTables" AS "TestTable" WHERE "TestTable"."class" = '2';
    // Executing (de77a05e-91f6-4b3a-95c4-e5da551b907f): SELECT sum("amount") AS "sum" FROM "TestTables" AS "TestTable" WHERE "TestTable"."class" = '2';
    // Executing (de77a05e-91f6-4b3a-95c4-e5da551b907f): SELECT sum("amount") AS "sum" FROM "TestTables" AS "TestTable" WHERE "TestTable"."class" = '2';
    // Executing (de77a05e-91f6-4b3a-95c4-e5da551b907f): SELECT sum("amount") AS "sum" FROM "TestTables" AS "TestTable" WHERE "TestTable"."class" = '2';
    // Executing (de77a05e-91f6-4b3a-95c4-e5da551b907f): SELECT sum("amount") AS "sum" FROM "TestTables" AS "TestTable" WHERE "TestTable"."class" = '2';
    // Executing (de77a05e-91f6-4b3a-95c4-e5da551b907f): SELECT sum("amount") AS "sum" FROM "TestTables" AS "TestTable" WHERE "TestTable"."class" = '2';

    const t1tx = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    });

    const listOfPromises = [
        {
            name: 't1Sum',
            function: TestTable.sum,
            thisArg: TestTable,
            args: ['amount', {
                where: {
                    class: '1',
                },
                transaction: t1tx,
            }],
        },
        {
            name: 't1Add',
            function: TestTable.create,
            thisArg: TestTable,
            args: [{
                class: '2',
                amount: 30,
            }, {
                transaction: t1tx,
            }],
        },
        {
            name: 't2Sum',
            function: TestTable.sum,
            thisArg: TestTable,
            args: ['amount', {
                where: {
                    class: '2',
                },
                transaction: t1tx,
            }],
        },
        {
            name: 't2Sum2',
            function: TestTable.sum,
            thisArg: TestTable,
            args: ['amount', {
                where: {
                    class: '2',
                },
                transaction: t1tx,
            }],
        },
        {
            name: 't2Sum3',
            function: TestTable.sum,
            thisArg: TestTable,
            args: ['amount', {
                where: {
                    class: '2',
                },
                transaction: t1tx,
            }],
        },
        {
            name: 't2Sum4',
            function: TestTable.sum,
            thisArg: TestTable,
            args: ['amount', {
                where: {
                    class: '2',
                },
                transaction: t1tx,
            }],
        },
        {
            name: 't2Sum5',
            function: TestTable.sum,
            thisArg: TestTable,
            args: ['amount', {
                where: {
                    class: '2',
                },
                transaction: t1tx,
            }],
        },
        {
            name: 't2Sum6',
            function: TestTable.sum,
            thisArg: TestTable,
            args: ['amount', {
                where: {
                    class: '2',
                },
                transaction: t1tx,
            }],
        },
        {
            name: 't2Sum7',
            function: TestTable.sum,
            thisArg: TestTable,
            args: ['amount', {
                where: {
                    class: '2',
                },
                transaction: t1tx,
            }],
        },
        {
            name: 't2Sum8',
            function: TestTable.sum,
            thisArg: TestTable,
            args: ['amount', {
                where: {
                    class: '2',
                },
                transaction: t1tx,
            }],
        },
        {
            name: 't2Sum9',
            function: TestTable.sum,
            thisArg: TestTable,
            args: ['amount', {
                where: {
                    class: '2',
                },
                transaction: t1tx,
            }],
        },
        {
            name: 't2Sum10',
            function: TestTable.sum,
            thisArg: TestTable,
            args: ['amount', {
                where: {
                    class: '2',
                },
                transaction: t1tx,
            }],
        },
        {
            name: 't2Sum11',
            function: TestTable.sum,
            thisArg: TestTable,
            args: ['amount', {
                where: {
                    class: '2',
                },
                transaction: t1tx,
            }],
        },
        {
            name: 't2Sum12',
            function: TestTable.sum,
            thisArg: TestTable,
            args: ['amount', {
                where: {
                    class: '2',
                },
                transaction: t1tx,
            }],
        },
        {
            name: 't2Sum13',
            function: TestTable.sum,
            thisArg: TestTable,
            args: ['amount', {
                where: {
                    class: '2',
                },
                transaction: t1tx,
            }],
        },
        {
            name: 't2Sum14',
            function: TestTable.sum,
            thisArg: TestTable,
            args: ['amount', {
                where: {
                    class: '2',
                },
                transaction: t1tx,
            }],
        },
        {
            name: 't2Sum15',
            function: TestTable.sum,
            thisArg: TestTable,
            args: ['amount', {
                where: {
                    class: '2',
                },
                transaction: t1tx,
            }],
        },
        {
            name: 't2Sum16',
            function: TestTable.sum,
            thisArg: TestTable,
            args: ['amount', {
                where: {
                    class: '2',
                },
                transaction: t1tx,
            }],
        },
        {
            name: 't2Sum17',
            function: TestTable.sum,
            thisArg: TestTable,
            args: ['amount', {
                where: {
                    class: '2',
                },
                transaction: t1tx,
            }],
        },
        {
            name: 't2Sum18',
            function: TestTable.sum,
            thisArg: TestTable,
            args: ['amount', {
                where: {
                    class: '2',
                },
                transaction: t1tx,
            }],
        },
    ];

    const p = await ParallelPromises.customPromiseAll(listOfPromises, 10);
    console.log('p', p);
}

// By this test, we can make sure read uncomitted is NOT possible in different dbTx
async function testC() {
    await init();

    const t1tx = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    });
    const t2tx = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    });

    const listOfPromises = [
        {
            name: 't1Sum',
            function: TestTable.sum,
            thisArg: TestTable,
            args: ['amount', {
                where: {
                    class: '1',
                },
                transaction: t1tx,
            }],
        },
        {
            name: 't1Add',
            function: TestTable.create,
            thisArg: TestTable,
            args: [{
                class: '2',
                amount: 30,
            }, {
                transaction: t1tx,
            }],
        },
        {
            name: 't2Sum',
            function: TestTable.sum,
            thisArg: TestTable,
            args: ['amount', {
                where: {
                    class: '2',
                },
                transaction: t2tx,
            }],
        },
        {
            name: 't2Sum2',
            function: TestTable.sum,
            thisArg: TestTable,
            args: ['amount', {
                where: {
                    class: '2',
                },
                transaction: t2tx,
            }],
        },
        {
            name: 't2Sum3',
            function: TestTable.sum,
            thisArg: TestTable,
            args: ['amount', {
                where: {
                    class: '2',
                },
                transaction: t2tx,
            }],
        },
        {
            name: 't2Sum4',
            function: TestTable.sum,
            thisArg: TestTable,
            args: ['amount', {
                where: {
                    class: '2',
                },
                transaction: t2tx,
            }],
        },
        {
            name: 't2Sum5',
            function: TestTable.sum,
            thisArg: TestTable,
            args: ['amount', {
                where: {
                    class: '2',
                },
                transaction: t2tx,
            }],
        },
        {
            name: 'commitDbTx1',
            function: t1tx.commit,
            thisArg: t1tx,
            args: [],
        },
        {
            name: 't2Sum6',
            function: TestTable.sum,
            thisArg: TestTable,
            args: ['amount', {
                where: {
                    class: '2',
                },
                transaction: t2tx,
            }],
        },
        {
            name: 't2Sum7',
            function: TestTable.sum,
            thisArg: TestTable,
            args: ['amount', {
                where: {
                    class: '2',
                },
                transaction: t2tx,
            }],
        },
        {
            name: 't2Sum8',
            function: TestTable.sum,
            thisArg: TestTable,
            args: ['amount', {
                where: {
                    class: '2',
                },
                transaction: t2tx,
            }],
        },
        {
            name: 't2Sum9',
            function: TestTable.sum,
            thisArg: TestTable,
            args: ['amount', {
                where: {
                    class: '2',
                },
                transaction: t2tx,
            }],
        },
        {
            name: 't2Sum10',
            function: TestTable.sum,
            thisArg: TestTable,
            args: ['amount', {
                where: {
                    class: '2',
                },
                transaction: t2tx,
            }],
        },
        {
            name: 't2Sum11',
            function: TestTable.sum,
            thisArg: TestTable,
            args: ['amount', {
                where: {
                    class: '2',
                },
                transaction: t2tx,
            }],
        },
        {
            name: 't2Sum12',
            function: TestTable.sum,
            thisArg: TestTable,
            args: ['amount', {
                where: {
                    class: '2',
                },
                transaction: t2tx,
            }],
        },
        {
            name: 't2Sum13',
            function: TestTable.sum,
            thisArg: TestTable,
            args: ['amount', {
                where: {
                    class: '2',
                },
                transaction: t2tx,
            }],
        },
        {
            name: 't2Sum14',
            function: TestTable.sum,
            thisArg: TestTable,
            args: ['amount', {
                where: {
                    class: '2',
                },
                transaction: t2tx,
            }],
        },
        {
            name: 't2Sum15',
            function: TestTable.sum,
            thisArg: TestTable,
            args: ['amount', {
                where: {
                    class: '2',
                },
                transaction: t2tx,
            }],
        },
        {
            name: 't2Sum16',
            function: TestTable.sum,
            thisArg: TestTable,
            args: ['amount', {
                where: {
                    class: '2',
                },
                transaction: t2tx,
            }],
        },
        {
            name: 't2Sum17',
            function: TestTable.sum,
            thisArg: TestTable,
            args: ['amount', {
                where: {
                    class: '2',
                },
                transaction: t2tx,
            }],
        },
        {
            name: 't2Sum18',
            function: TestTable.sum,
            thisArg: TestTable,
            args: ['amount', {
                where: {
                    class: '2',
                },
                transaction: t2tx,
            }],
        },
    ];

    const p = await ParallelPromises.customPromiseAll(listOfPromises, 10);
    console.log('p', p);
}

async function main() {
    return testC();
}

main();