const { db } = require('./models')

const resetDb = async () => {
  try {
    await db.sync({ force: true })
    console.log('database synced!')
  } catch (e) {
    console.log(e)
  } finally {
    await process.exit()
  }
}

resetDb()
