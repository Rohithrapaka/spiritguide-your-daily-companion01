export const animeQuotes = [
  {
    text: "The world isn't perfect. But it's there for us, doing the best it can... that's what makes it so damn beautiful.",
    source: "Roy Mustang, Fullmetal Alchemist"
  },
  {
    text: "If you don't take risks, you can't create a future.",
    source: "Monkey D. Luffy, One Piece"
  },
  {
    text: "Fear is not evil. It tells you what your weakness is. And once you know your weakness, you can become stronger.",
    source: "Gildarts Clive, Fairy Tail"
  },
  {
    text: "The moment you think of giving up, think of the reason why you held on so long.",
    source: "Natsu Dragneel, Fairy Tail"
  },
  {
    text: "Being alone is more painful than getting hurt.",
    source: "Monkey D. Luffy, One Piece"
  },
  {
    text: "Whatever you lose, you'll find it again. But what you throw away you'll never get back.",
    source: "Kenshin Himura, Rurouni Kenshin"
  },
  {
    text: "It's not the face that makes someone a monster; it's the choices they make with their lives.",
    source: "Naruto Uzumaki, Naruto"
  },
  {
    text: "A lesson without pain is meaningless. That's because no one can gain without sacrificing something.",
    source: "Edward Elric, Fullmetal Alchemist"
  },
  {
    text: "People's lives don't end when they die. It ends when they lose faith.",
    source: "Itachi Uchiha, Naruto"
  },
  {
    text: "Even if we forget the faces of our friends, we will never forget the bonds that were carved into our souls.",
    source: "Otonashi, Angel Beats"
  }
];

export const bibleVerses = [
  {
    text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.",
    source: "Jeremiah 29:11"
  },
  {
    text: "Cast all your anxiety on him because he cares for you.",
    source: "1 Peter 5:7"
  },
  {
    text: "The Lord is my shepherd; I shall not want. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul.",
    source: "Psalm 23:1-3"
  },
  {
    text: "Come to me, all you who are weary and burdened, and I will give you rest.",
    source: "Matthew 11:28"
  },
  {
    text: "I can do all things through Christ who strengthens me.",
    source: "Philippians 4:13"
  },
  {
    text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
    source: "Joshua 1:9"
  },
  {
    text: "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.",
    source: "John 14:27"
  },
  {
    text: "The Lord is close to the brokenhearted and saves those who are crushed in spirit.",
    source: "Psalm 34:18"
  },
  {
    text: "Trust in the Lord with all your heart and lean not on your own understanding.",
    source: "Proverbs 3:5"
  },
  {
    text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles.",
    source: "Isaiah 40:31"
  }
];

export const getRandomQuote = () => {
  const allQuotes = [...animeQuotes, ...bibleVerses];
  return allQuotes[Math.floor(Math.random() * allQuotes.length)];
};
