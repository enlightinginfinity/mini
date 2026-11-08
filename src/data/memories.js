/**
 * FRIENDSHIP QUEST - MEMORIES & PERSONALIZATION DATA
 * 
 * You can easily customize this file with your friend's name, personal photos,
 * funny jokes, heartfelt memories, and birthday messages!
 * 
 * How to replace photos:
 * 1. Place your photos in 'public/assets/photos/' (e.g. photo1.jpg, photo2.jpg, etc.)
 * 2. Update the 'photo' property in the memory items below.
 * 3. Update the birthday message and letter at the bottom.
 */

export const BIRTHDAY_CONFIG = {
  // Birthday person's name
  recipientName: "Rashaad",
  
  // Nicknames or terms of endearment
  nickname: "Partner in Crime",
  
  // Age or milestone (optional, e.g. "25th" or "Special Day")
  birthdayMilestone: "Special Birthday",
  
  // Sender's name / group
  senderName: "Your Best Friend",
  
  // Custom character face image URL (placed in public/assets/face.png)
  customFaceUrl: "./assets/face.png",
  
  // Final birthday title and heartfelt letter
  finalCelebration: {
    title: "HAPPY BIRTHDAY, RASHAAD! 🎂🎉",
    tagline: "Some adventures end, but the memories we create together last forever.",
    letterParagraphs: [
      "Dearest Rashaad,",
      "Happy, happy Birthday! Going through all these memories made me realize just how much brighter, crazier, and more wonderful life is with you in it.",
      "From the random spontaneous laughs to being there through thick and thin, having you as a friend is one of the greatest adventures ever.",
      "May this year bring you endless happiness, exciting new quests, big dreams come true, and plenty of cake! Here's to making a million more unforgettable memories together.",
      "With all my love and best wishes,",
      "— Your Best Friend ❤️"
    ],
    closingMessage: "Press Replay to play again, or browse all your memories in the Memory Album!"
  }
};

/**
 * 25 MEMORY TOKENS ACROSS 5 LEVELS (5 TOKENS PER LEVEL)
 * Types:
 *  - 'coin': Funny incidents, silly jokes, goofy moments
 *  - 'heart': Emotional milestones, deep friendship, caring moments
 *  - 'star': Special milestones, epic trips, rare photographs
 */
export const LEVEL_MEMORIES = {
  // LEVEL 1: CITY OF SPICES (Theme: Countryside & Where it all started)
  1: {
    levelTitle: "City of Spices",
    levelSubtitle: "Where our story began",
    theme: "countryside",
    summary: "From awkward hellos to inseparable best friends!",
    rewardPhoto: "./assets/photos/photo1.png",
    rewardTitle: "Ch1 - City of Spices",
    rewardText: "Remember the first day we met? Neither of us knew that an ordinary conversation would spark one of the greatest friendships of all time.",
    memories: [
      {
        id: "m_1_1",
        type: "coin",
        title: "The Awkward Hello",
        preview: "That first conversation we had...",
        story: "Remember how polite and formal we were when we first met? Look at us now — communicating purely in memes and weird sound effects!",
        photo: "./assets/photos/photo1_1.png"
      },
      {
        id: "m_1_2",
        type: "heart",
        title: "The Instant Connection",
        preview: "Talking for hours without checking the clock",
        story: "The moment we realized we shared the exact same sense of humor and love for late night snacks, we knew this friendship was forever.",
        photo: "./assets/photos/photo1_2.png"
      },
      {
        id: "m_1_3",
        type: "coin",
        title: "The First Inside Joke",
        preview: "Nobody else understood why we were laughing",
        story: "Someone made an innocent mistake and we couldn't stop giggling for 20 minutes straight. To this day, just mentioning that one word cracks us up.",
        photo: "./assets/photos/photo1_3.png"
      },
      {
        id: "m_1_4",
        type: "heart",
        title: "The First Favor",
        preview: "When you dropped everything to help me out",
        story: "You stepped up without even being asked. That was the day I knew I had found a true friend who would always have my back.",
        photo: "./assets/photos/photo1_4.png"
      },
      {
        id: "m_1_5",
        type: "star",
        title: "Official Best Friends",
        preview: "Unlocking Chapter 1 of our legendary journey!",
        story: "Here's the first official photo we ever took together! Young, full of hope, and totally unaware of the chaos we were about to unleash.",
        photo: "./assets/photos/photo1_5.png"
      }
    ]
  },

  // LEVEL 2: QUEEN OF THE ARABIAN SEA (Theme: Underground cave & Hilarious memories)
  2: {
    levelTitle: "Queen of the Arabian sea",
    levelSubtitle: "Laughs, blunders & epic fails",
    theme: "cave",
    summary: "The funniest and most ridiculous moments we survived together!",
    rewardPhoto: "./assets/photos/photo2.png",
    rewardTitle: "Ch2 - Queen of the Arabian sea",
    rewardText: "True friendship isn't about being well-behaved. It's about finding that one person who is equally willing to do completely silly things with you!",
    memories: [
      {
        id: "m_2_1",
        type: "coin",
        title: "The GPS Disaster",
        preview: "'Trust me, I know a shortcut!'",
        story: "We ended up in the middle of nowhere, taking an hour detour, arguing with the navigation voice, and laughing until our stomachs hurt.",
        photo: "./assets/photos/photo2_1.png"
      },
      {
        id: "m_2_2",
        type: "coin",
        title: "The Cooking Experiment",
        preview: "Smoke alarms may or may not have gone off...",
        story: "We tried making that gourmet recipe from social media and created an unrecognizable masterpiece. We ended up ordering pizza, obviously.",
        photo: "./assets/photos/photo2_2.png"
      },
      {
        id: "m_2_3",
        type: "heart",
        title: "3 AM Life Talks",
        preview: "Solving all the universe's mysteries",
        story: "Those random late-night conversations on the porch or floor where we shared our wildest dreams and deepest thoughts.",
        photo: "./assets/photos/photo2_3.png"
      },
      {
        id: "m_2_4",
        type: "coin",
        title: "Uncontrollable Giggles",
        preview: "The quietest room, the loudest laughter",
        story: "The time we were in a serious setting where we strictly had to stay quiet, which naturally made everything 1,000 times funnier.",
        photo: "./assets/photos/photo2_4.png"
      },
      {
        id: "m_2_5",
        type: "star",
        title: "The Most Candid Photo",
        preview: "Caught red-handed making goofy faces!",
        story: "This photo captures our authentic dynamic: zero filters, 100% ridiculousness, and pure unfiltered joy.",
        photo: "./assets/photos/photo2_5.png"
      }
    ]
  },

  // LEVEL 3: NAMMA BENGALURU (Theme: Sunset mountains & Deep appreciation)
  3: {
    levelTitle: "Namma Bengaluru",
    levelSubtitle: "Through every peak and valley",
    theme: "mountains",
    summary: "Standing by each other when life got tough and celebrating the triumphs.",
    rewardPhoto: "./assets/photos/photo3.png",
    rewardTitle: "Ch3 - Namma Bengaluru",
    rewardText: "Friendship isn't just about the sunny days. It's about knowing there's someone walking right beside you no matter what the mountain looks like.",
    memories: [
      {
        id: "m_3_1",
        type: "heart",
        title: "The Tough Days",
        preview: "A shoulder to lean on",
        story: "When everything felt overwhelming, you listened without judging. You reminded me of my strength when I had forgotten it.",
        photo: "./assets/photos/photo3_1.png"
      },
      {
        id: "m_3_2",
        type: "coin",
        title: "The Pep Talk",
        preview: "Hype person of the century!",
        story: "Before that big interview and scary challenge, your pep talk gave me 200% confidence. You are the ultimate cheerleader.",
        photo: "./assets/photos/photo3_2.png"
      },
      {
        id: "m_3_3",
        type: "heart",
        title: "Celebrating Milestones",
        preview: "Your victories are my victories",
        story: "Nothing beats the feeling of watching you achieve what you worked so hard for and high-fiving like crazy.",
        photo: "./assets/photos/photo3_3.png"
      },
      {
        id: "m_3_4",
        type: "coin",
        title: "The Road Trip Playlist",
        preview: "Singing off-key at maximum volume",
        story: "Windows down, sunset in the rearview mirror, screaming nostalgic 2000s pop anthems without caring who saw us at the stoplight.",
        photo: "./assets/photos/photo3_4.png"
      },
      {
        id: "m_3_5",
        type: "star",
        title: "Golden Hour Memory",
        preview: "Standing tall at the mountain summit",
        story: "Looking out at the view together, realizing how far we've both come. Proud of you today and every day.",
        photo: "./assets/photos/photo3_5.png"
      }
    ]
  },

  // LEVEL 4: QUEEN OF THE HILLS (Theme: Tropical beach & Epic trips)
  4: {
    levelTitle: "Queen of the hills",
    levelSubtitle: "Sun, sand & unforgettable escapes",
    theme: "beach",
    summary: "Exploring new horizons, holiday snapshots, and making waves!",
    rewardPhoto: "./assets/photos/photo4.png",
    rewardTitle: "Ch4 - Queen of the hills",
    rewardText: "Every trip with you turns into an unforgettable story. Even getting lost or caught in the rain became our favorite part of the adventure!",
    memories: [
      {
        id: "m_4_1",
        type: "coin",
        title: "The Beach Fiasco",
        preview: "Sand in places sand should never be!",
        story: "A giant wave hit us while trying to take the perfect aesthetic beach photo. The photo was ruined, but the laugh was priceless.",
        photo: "./assets/photos/photo4_1.png"
      },
      {
        id: "m_4_2",
        type: "heart",
        title: "Quiet Morning Coffee",
        preview: "Watching the waves before the world woke up",
        story: "Sitting on the deck with morning brew, breathing the sea breeze, realizing how peaceful life can feel in good company.",
        photo: "./assets/photos/photo4_2.png"
      },
      {
        id: "m_4_3",
        type: "coin",
        title: "Overpacking Champions",
        preview: "Did we really need 6 pairs of shoes for a 2-day trip?",
        story: "Struggling to zip the suitcase, sitting on it together, and still realizing we forgot the phone charger.",
        photo: "./assets/photos/photo4_3.png"
      },
      {
        id: "m_4_4",
        type: "heart",
        title: "Sunset Stroll",
        preview: "Talking about future dreams",
        story: "Walking along the shore, making plans for where we'll go next and promising that we'll still be doing this when we're 80.",
        photo: "./assets/photos/photo4_4.png"
      },
      {
        id: "m_4_5",
        type: "star",
        title: "The Postcard Picture",
        preview: "Our favorite vacation snapshot!",
        story: "Sun-kissed, smiling from ear to ear, with the ocean sparkling behind us. A moment frozen in time forever.",
        photo: "./assets/photos/photo4_5.png"
      }
    ]
  },

  // LEVEL 5: THE 5AM CLUB (Theme: Castle, balloons & celebration)
  5: {
    levelTitle: "The 5AM Club",
    levelSubtitle: "The Grand Birthday Celebration",
    theme: "castle",
    summary: "Reaching the royal treasure chest and celebrating YOU!",
    rewardPhoto: "./assets/photos/photo5.png",
    rewardTitle: "Ch5 - The 5AM Club",
    rewardText: "You made it to the final kingdom! The greatest treasure in the entire realm isn't gold or jewels — it's the gift of having you in our lives.",
    memories: [
      {
        id: "m_5_1",
        type: "heart",
        title: "Your Kindness",
        preview: "How you make everyone feel special",
        story: "Your warmth, generosity, and genuine care light up every room you enter. Never lose that magical spark.",
        photo: "./assets/photos/photo5_1.png"
      },
      {
        id: "m_5_2",
        type: "coin",
        title: "Party Animal",
        preview: "Unmatched dance floor moves!",
        story: "Whether it's terrible dancing in the kitchen or celebrating with all your heart, your energy is infectious.",
        photo: "./assets/photos/photo5_2.png"
      },
      {
        id: "m_5_3",
        type: "heart",
        title: "A Heart of Gold",
        preview: "The most thoughtful soul",
        story: "You always remember the little things that matter to the people you love. Today, we celebrate all that you give.",
        photo: "./assets/photos/photo5_3.png"
      },
      {
        id: "m_5_4",
        type: "star",
        title: "Another Year Wiser",
        preview: "Glowing brighter than ever",
        story: "Every year you grow into an even more remarkable person. We couldn't be prouder to stand beside you.",
        photo: "./assets/photos/photo5_4.png"
      },
      {
        id: "m_5_5",
        type: "star",
        title: "The Birthday Crown",
        preview: "Reigning monarch of the day!",
        story: "Put on your invisible crown, make a huge wish, blow out the candles, and let the celebration begin!",
        photo: "./assets/photos/photo5_5.png"
      }
    ]
  }
};

