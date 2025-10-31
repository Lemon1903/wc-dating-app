import "dotenv/config";

import { createUser } from "@/services/userService";

// Sample user data for seeding
const sampleUsers = [
  {
    email: "alice.johnson@example.com",
    name: "Alice Johnson",
    bio: "Love hiking and photography. Looking for someone to explore the world with!",
    birthday: "1995-03-15T00:00:00.000Z",
    password: "password123",
    gender: "female" as const,
    profilePhotos: [
      "https://randomuser.me/api/portraits/women/1.jpg",
      "https://randomuser.me/api/portraits/women/2.jpg",
    ],
  },
  {
    email: "bob.smith@example.com",
    name: "Bob Smith",
    bio: "Software engineer who loves cooking and trying new restaurants.",
    birthday: "1992-07-22T00:00:00.000Z",
    password: "password123",
    gender: "male" as const,
    profilePhotos: [
      "https://randomuser.me/api/portraits/men/3.jpg",
      "https://randomuser.me/api/portraits/men/4.jpg",
      "https://randomuser.me/api/portraits/men/5.jpg",
    ],
  },
  {
    email: "carol.davis@example.com",
    name: "Carol Davis",
    bio: "Artist and musician. I paint landscapes and play guitar in my free time.",
    birthday: "1990-11-08T00:00:00.000Z",
    password: "password123",
    gender: "female" as const,
    profilePhotos: [
      "https://randomuser.me/api/portraits/women/6.jpg",
      "https://randomuser.me/api/portraits/women/7.jpg",
    ],
  },
  {
    email: "david.wilson@example.com",
    name: "David Wilson",
    bio: "Fitness enthusiast and personal trainer. Love helping others stay healthy.",
    birthday: "1988-05-30T00:00:00.000Z",
    password: "password123",
    gender: "male" as const,
    profilePhotos: [
      "https://randomuser.me/api/portraits/men/8.jpg",
      "https://randomuser.me/api/portraits/men/9.jpg",
      "https://randomuser.me/api/portraits/men/10.jpg",
    ],
  },
  {
    email: "emma.brown@example.com",
    name: "Emma Brown",
    bio: "Book lover and writer. Currently working on my first novel.",
    birthday: "1993-09-12T00:00:00.000Z",
    password: "password123",
    gender: "female" as const,
    profilePhotos: [
      "https://randomuser.me/api/portraits/women/11.jpg",
      "https://randomuser.me/api/portraits/women/12.jpg",
    ],
  },
  {
    email: "frank.miller@example.com",
    name: "Frank Miller",
    bio: "Travel blogger and photographer. Visited 25 countries so far!",
    birthday: "1987-01-25T00:00:00.000Z",
    password: "password123",
    gender: "male" as const,
    profilePhotos: [
      "https://randomuser.me/api/portraits/men/13.jpg",
      "https://randomuser.me/api/portraits/men/14.jpg",
      "https://randomuser.me/api/portraits/men/15.jpg",
    ],
  },
  {
    email: "grace.lee@example.com",
    name: "Grace Lee",
    bio: "Veterinarian who loves animals and outdoor activities.",
    birthday: "1991-12-03T00:00:00.000Z",
    password: "password123",
    gender: "female" as const,
    profilePhotos: [
      "https://randomuser.me/api/portraits/women/16.jpg",
      "https://randomuser.me/api/portraits/women/17.jpg",
    ],
  },
  {
    email: "henry.taylor@example.com",
    name: "Henry Taylor",
    bio: "Chef and food critic. Always experimenting with new recipes.",
    birthday: "1989-06-18T00:00:00.000Z",
    password: "password123",
    gender: "male" as const,
    profilePhotos: [
      "https://randomuser.me/api/portraits/men/18.jpg",
      "https://randomuser.me/api/portraits/men/19.jpg",
      "https://randomuser.me/api/portraits/men/20.jpg",
    ],
  },
  {
    email: "isabella.garcia@example.com",
    name: "Isabella Garcia",
    bio: "Dancer and yoga instructor. Passionate about wellness and mindfulness.",
    birthday: "1994-08-27T00:00:00.000Z",
    password: "password123",
    gender: "female" as const,
    profilePhotos: [
      "https://randomuser.me/api/portraits/women/21.jpg",
      "https://randomuser.me/api/portraits/women/22.jpg",
    ],
  },
  {
    email: "jack.anderson@example.com",
    name: "Jack Anderson",
    bio: "Entrepreneur and tech startup founder. Love innovation and problem-solving.",
    birthday: "1986-04-14T00:00:00.000Z",
    password: "password123",
    gender: "male" as const,
    profilePhotos: [
      "https://randomuser.me/api/portraits/men/23.jpg",
      "https://randomuser.me/api/portraits/men/24.jpg",
      "https://randomuser.me/api/portraits/men/25.jpg",
    ],
  },
  {
    email: "kate.martinez@example.com",
    name: "Kate Martinez",
    bio: "Environmental scientist working on climate change solutions.",
    birthday: "1992-10-09T00:00:00.000Z",
    password: "password123",
    gender: "female" as const,
    profilePhotos: [
      "https://randomuser.me/api/portraits/women/26.jpg",
      "https://randomuser.me/api/portraits/women/27.jpg",
    ],
  },
  {
    email: "liam.thomas@example.com",
    name: "Liam Thomas",
    bio: "Musician and composer. Play piano and write original songs.",
    birthday: "1990-02-28T00:00:00.000Z",
    password: "password123",
    gender: "male" as const,
    profilePhotos: [
      "https://randomuser.me/api/portraits/men/28.jpg",
      "https://randomuser.me/api/portraits/men/29.jpg",
      "https://randomuser.me/api/portraits/men/30.jpg",
    ],
  },
  {
    email: "mia.rodriguez@example.com",
    name: "Mia Rodriguez",
    bio: "Fashion designer with a passion for sustainable clothing.",
    birthday: "1993-07-05T00:00:00.000Z",
    password: "password123",
    gender: "female" as const,
    profilePhotos: [
      "https://randomuser.me/api/portraits/women/31.jpg",
      "https://randomuser.me/api/portraits/women/32.jpg",
    ],
  },
  {
    email: "noah.white@example.com",
    name: "Noah White",
    bio: "Architect who designs eco-friendly homes and buildings.",
    birthday: "1988-11-20T00:00:00.000Z",
    password: "password123",
    gender: "male" as const,
    profilePhotos: [
      "https://randomuser.me/api/portraits/men/33.jpg",
      "https://randomuser.me/api/portraits/men/34.jpg",
      "https://randomuser.me/api/portraits/men/35.jpg",
    ],
  },
  {
    email: "olivia.clark@example.com",
    name: "Olivia Clark",
    bio: "Journalist covering social issues and human rights stories.",
    birthday: "1991-03-22T00:00:00.000Z",
    password: "password123",
    gender: "female" as const,
    profilePhotos: [
      "https://randomuser.me/api/portraits/women/36.jpg",
      "https://randomuser.me/api/portraits/women/37.jpg",
    ],
  },
];

async function seedUsers() {
  console.log("Seeding users...");

  for (const userData of sampleUsers) {
    try {
      const user = await createUser({
        email: userData.email,
        name: userData.name,
        bio: userData.bio,
        gender: userData.gender,
        birthday: userData.birthday,
        password: userData.password,
        profilePhotos: userData.profilePhotos,
      });

      console.log(`Created user: ${user.name}`);
    } catch (error) {
      console.error(`Error creating user ${userData.name}:`, error);
    }
  }

  console.log("Seeding completed!");
  process.exit(0);
}

seedUsers().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
