import { PrismaClient } from '../src/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create test users
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'john@example.com',
        name: 'John Doe',
        username: 'johndoe',
        bio: 'Software developer and tech enthusiast',
        isVerified: true,
        followerCount: 1250,
        followingCount: 180,
        postCount: 45,
      }
    }),
    prisma.user.create({
      data: {
        email: 'jane@example.com',
        name: 'Jane Smith',
        username: 'janesmith',
        bio: 'Designer & creative thinker',
        isVerified: false,
        followerCount: 890,
        followingCount: 120,
        postCount: 32,
      }
    }),
    prisma.user.create({
      data: {
        email: 'alex@example.com',
        name: 'Alex Johnson',
        username: 'alexj',
        bio: 'Photographer capturing life moments',
        isVerified: true,
        followerCount: 2100,
        followingCount: 95,
        postCount: 78,
      }
    }),
    prisma.user.create({
      data: {
        email: 'sarah@example.com',
        name: 'Sarah Wilson',
        username: 'sarahw',
        bio: 'Travel blogger and adventure seeker',
        isVerified: false,
        followerCount: 567,
        followingCount: 203,
        postCount: 23,
      }
    })
  ])

  console.log('✅ Created users')

  // Create hashtags
  const hashtags = await Promise.all([
    prisma.hashtag.create({
      data: { name: 'technology', postCount: 45 }
    }),
    prisma.hashtag.create({
      data: { name: 'design', postCount: 32 }
    }),
    prisma.hashtag.create({
      data: { name: 'photography', postCount: 78 }
    }),
    prisma.hashtag.create({
      data: { name: 'travel', postCount: 23 }
    }),
    prisma.hashtag.create({
      data: { name: 'coding', postCount: 56 }
    })
  ])

  console.log('✅ Created hashtags')

  // Create posts
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        content: 'Just shipped a new feature! Excited to see how users react to it. #technology #coding',
        authorId: users[0].id,
        likesCount: 24,
        commentsCount: 5,
        sharesCount: 3,
        bookmarksCount: 8,
      }
    }),
    prisma.post.create({
      data: {
        content: 'Beautiful sunset from my balcony today. Nature never fails to amaze me! 🌅',
        authorId: users[1].id,
        likesCount: 67,
        commentsCount: 12,
        sharesCount: 8,
        bookmarksCount: 15,
      }
    }),
    prisma.post.create({
      data: {
        content: 'New photography project in the works. Can\'t wait to share the results! #photography',
        authorId: users[2].id,
        likesCount: 89,
        commentsCount: 18,
        sharesCount: 12,
        bookmarksCount: 23,
      }
    }),
    prisma.post.create({
      data: {
        content: 'Exploring the mountains this weekend. The views are absolutely breathtaking! #travel',
        authorId: users[3].id,
        likesCount: 43,
        commentsCount: 9,
        sharesCount: 6,
        bookmarksCount: 11,
      }
    }),
    prisma.post.create({
      data: {
        content: 'Working on a new design system. Consistency is key in great user experiences. #design',
        authorId: users[1].id,
        likesCount: 35,
        commentsCount: 7,
        sharesCount: 4,
        bookmarksCount: 9,
      }
    })
  ])

  console.log('✅ Created posts')

  // Create some follows
  await Promise.all([
    prisma.follow.create({
      data: { followerId: users[0].id, followingId: users[1].id }
    }),
    prisma.follow.create({
      data: { followerId: users[0].id, followingId: users[2].id }
    }),
    prisma.follow.create({
      data: { followerId: users[1].id, followingId: users[0].id }
    }),
    prisma.follow.create({
      data: { followerId: users[1].id, followingId: users[3].id }
    }),
    prisma.follow.create({
      data: { followerId: users[2].id, followingId: users[0].id }
    }),
    prisma.follow.create({
      data: { followerId: users[3].id, followingId: users[2].id }
    })
  ])

  console.log('✅ Created follows')

  // Create some likes
  await Promise.all([
    prisma.like.create({
      data: { userId: users[0].id, postId: posts[1].id }
    }),
    prisma.like.create({
      data: { userId: users[0].id, postId: posts[2].id }
    }),
    prisma.like.create({
      data: { userId: users[1].id, postId: posts[0].id }
    }),
    prisma.like.create({
      data: { userId: users[2].id, postId: posts[0].id }
    }),
    prisma.like.create({
      data: { userId: users[3].id, postId: posts[2].id }
    })
  ])

  console.log('✅ Created likes')

  // Create some bookmarks
  await Promise.all([
    prisma.bookmark.create({
      data: { userId: users[0].id, postId: posts[2].id }
    }),
    prisma.bookmark.create({
      data: { userId: users[1].id, postId: posts[0].id }
    }),
    prisma.bookmark.create({
      data: { userId: users[2].id, postId: posts[1].id }
    })
  ])

  console.log('✅ Created bookmarks')

  // Create some comments
  await Promise.all([
    prisma.comment.create({
      data: {
        content: 'Great work! Looking forward to trying it out.',
        postId: posts[0].id,
        authorId: users[1].id,
        likesCount: 3,
      }
    }),
    prisma.comment.create({
      data: {
        content: 'Absolutely stunning! What camera did you use?',
        postId: posts[1].id,
        authorId: users[2].id,
        likesCount: 5,
      }
    }),
    prisma.comment.create({
      data: {
        content: 'Your photography skills are amazing!',
        postId: posts[2].id,
        authorId: users[0].id,
        likesCount: 2,
      }
    })
  ])

  console.log('✅ Created comments')

  // Create user settings for each user
  await Promise.all(
    users.map(user => 
      prisma.userSettings.create({
        data: {
          userId: user.id,
          theme: 'system',
          fontSize: 'medium',
          emailNotifications: true,
          pushNotifications: true,
          newFollowers: true,
          postLikes: true,
          postComments: true,
          mentions: true,
          profileVisibility: 'public',
          allowDirectMessages: true,
          showOnlineStatus: true,
          allowTagging: true,
        }
      })
    )
  )

  console.log('✅ Created user settings')

  console.log('🎉 Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 