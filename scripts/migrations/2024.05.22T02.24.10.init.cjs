/** @type {import('@pgkit/migrator').Migration} */
exports.up = async ({ context: { connection, sql } }) => {
  // create message table
  await connection.query(sql`
    create table message (
      id serial primary key,
      text text not null
    )
  `)
}

/** @type {import('@pgkit/migrator').Migration} */
exports.down = async ({ context: { connection, sql } }) => {
  await connection.query(sql`
    drop table message
  `)
}
