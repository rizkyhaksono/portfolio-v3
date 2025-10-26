export type Language = "en" | "id";

const englishWords = [
  "the", "of", "and", "a", "to", "in", "is", "you", "that", "it", "he", "was", "for", "on", "are", "as", "with", "his", "they", "i", "at", "be", "this", "have", "from", "or", "one", "had", "by", "word", "but", "not", "what", "all", "were", "we", "when", "your", "can", "said", "there", "each", "which", "she", "do", "how", "their", "if", "will", "up", "other", "about", "out", "many", "then", "them", "these", "so", "some", "her", "would", "make", "like", "into", "him", "time", "has", "two", "more", "very", "after", "words", "long", "than", "first", "been", "call", "who", "oil", "sit", "now", "find", "down", "day", "did", "get", "come", "made", "may", "part", "over", "new", "sound", "take", "only", "little", "work", "know", "place", "year", "live", "me", "back", "give", "most", "good", "man", "think", "say", "great", "where", "help", "through", "much", "before", "line", "right", "too", "mean", "old", "any", "same", "tell", "boy", "follow", "came", "want", "show", "also", "around", "farm", "three", "small", "set", "put", "end", "why", "again", "turn", "here", "off", "went", "own", "under", "read", "last", "need", "land", "different", "home", "us", "move", "try", "kind", "hand", "picture", "again", "change", "play", "spell", "air", "away", "animal", "house", "point", "page", "letter", "mother", "answer", "found", "study", "still", "learn", "should", "America", "world"
];

const indonesianWords = [
  "yang", "dan", "di", "itu", "dengan", "ini", "untuk", "dari", "ke", "dalam", "pada", "adalah", "ada", "akan", "atau", "satu", "dapat", "juga", "tidak", "sudah", "saya", "mereka", "kita", "dia", "kami", "anda", "bisa", "hanya", "yaitu", "karena", "oleh", "seperti", "jadi", "kalau", "setelah", "tetapi", "maka", "antara", "bila", "serta", "bahwa", "sampai", "sekitar", "hingga", "sedangkan", "namun", "masih", "selama", "walaupun", "ketika", "dimana", "bagaimana", "mengapa", "siapa", "apakah", "berapa", "kapan", "dimana", "bagaimana", "mengapa", "siapa", "apakah", "berapa", "kapan", "baru", "lain", "sama", "besar", "kecil", "baik", "buruk", "tinggi", "rendah", "panjang", "pendek", "lama", "sebentar", "cepat", "lambat", "mudah", "sulit", "senang", "sedih", "marah", "takut", "berani", "pintar", "bodoh", "cantik", "jelek", "muda", "tua", "kaya", "miskin", "sehat", "sakit", "hidup", "mati", "kerja", "bermain", "belajar", "mengajar", "membaca", "menulis", "mendengar", "melihat", "berbicara", "berjalan", "berlari", "tidur", "bangun", "makan", "minum", "masak", "cuci", "bersih", "kotor", "terang", "gelap", "panas", "dingin", "hujan", "pagi", "siang", "sore", "malam", "hari", "minggu", "bulan", "tahun", "rumah", "sekolah", "kantor", "pasar", "toko", "jalan", "mobil", "motor", "pesawat", "kapal", "kereta", "bus", "sepeda", "jembatan", "gunung", "laut", "sungai", "danau", "hutan", "kebun", "sawah", "kota", "desa", "negara", "dunia"
];

export function getRandomWords(language: Language, count: number): string[] {
  const words = language === "en" ? englishWords : indonesianWords;
  const result: string[] = [];

  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * words.length);
    result.push(words[randomIndex]);
  }

  return result;
}