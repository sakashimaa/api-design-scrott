import { db } from './connection.ts'
import { users, habits, entries, tags, habitTags } from './schema.ts'

const seed = async () => {
  console.log('🌱 Starting database seed...')

  try {
    console.log('Clearing existing data...')
    await db.delete(entries)
    await db.delete(habitTags)
    await db.delete(habits)
    await db.delete(tags)
    await db.delete(users)

    console.log('creating demo users...')
    const [demoUser] = await db
      .insert(users)
      .values({
        email: 'demo@app.com',
        password: 'password123',
        firstName: 'demo',
        lastName: 'person',
        username: 'demo',
      })
      .returning()

    console.log('creating tags...')
    const [healthTag] = await db
      .insert(tags)
      .values({ name: 'health', color: '#f0f0f0' })
      .returning()

    console.log('creating habits...')
    const [exerciseHabit] = await db
      .insert(habits)
      .values({
        userId: demoUser.id,
        name: 'Exercise',
        description: 'Daily workout',
        frequency: 'daily',
        targetCount: 1,
      })
      .returning()

    await db.insert(habitTags).values({
      habitId: exerciseHabit.id,
      tagId: healthTag.id,
    })

    console.log('adding completion entries...')

    const today = new Date()
    today.setHours(12, 0, 0, 0)

    for (let i = 0; i < 7; ++i) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      await db.insert(entries).values({
        habitId: exerciseHabit.id,
        completionDate: date,
      })
    }

    console.log('✅ DB seeded successfully')
    console.log('user credentials:')
    console.log(`email: ${demoUser.email}`)
    console.log(`username: ${demoUser.username}`)
    console.log(`password: ${demoUser.password}`)
  } catch (err) {
    console.log('❌ seed failed', err)
    process.exit(1)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(() => process.exit(0))
    .catch((e) => process.exit(1))
}

export default seed
