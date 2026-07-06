export interface IeltsWord {
  word: string
  pos: string // part of speech
  definition: string
  example: string
  synonyms: string[]
  topic: string
}

/** Curated IELTS academic vocabulary — high-frequency words for Writing & Speaking Band 7+. */
export const IELTS_WORDS: IeltsWord[] = [
  { word: "mitigate", pos: "verb", definition: "to make something less harmful, serious, or severe", example: "Governments must act to mitigate the effects of climate change.", synonyms: ["alleviate", "reduce", "lessen"], topic: "Environment" },
  { word: "detrimental", pos: "adjective", definition: "tending to cause harm or damage", example: "Excessive screen time can be detrimental to children's development.", synonyms: ["harmful", "damaging", "adverse"], topic: "Health" },
  { word: "proliferate", pos: "verb", definition: "to increase rapidly in number", example: "Online learning platforms have proliferated over the past decade.", synonyms: ["multiply", "spread", "flourish"], topic: "Technology" },
  { word: "ubiquitous", pos: "adjective", definition: "present, appearing, or found everywhere", example: "Smartphones have become ubiquitous in modern society.", synonyms: ["omnipresent", "pervasive", "widespread"], topic: "Technology" },
  { word: "exacerbate", pos: "verb", definition: "to make a problem or situation worse", example: "Rapid urbanisation can exacerbate traffic congestion.", synonyms: ["worsen", "aggravate", "intensify"], topic: "Society" },
  { word: "prevalent", pos: "adjective", definition: "widespread or common in a particular area or time", example: "Obesity is increasingly prevalent among young people.", synonyms: ["widespread", "common", "rife"], topic: "Health" },
  { word: "advocate", pos: "verb", definition: "to publicly recommend or support", example: "Many experts advocate investing in renewable energy.", synonyms: ["support", "champion", "endorse"], topic: "Society" },
  { word: "feasible", pos: "adjective", definition: "possible to do easily or conveniently", example: "It is not always feasible to recycle every type of plastic.", synonyms: ["viable", "practicable", "achievable"], topic: "Environment" },
  { word: "diminish", pos: "verb", definition: "to make or become less", example: "The value of a currency can diminish during a crisis.", synonyms: ["decrease", "reduce", "decline"], topic: "Economy" },
  { word: "lucrative", pos: "adjective", definition: "producing a great deal of profit", example: "Software engineering remains a lucrative career path.", synonyms: ["profitable", "rewarding", "well-paid"], topic: "Work" },
  { word: "sedentary", pos: "adjective", definition: "involving little physical activity", example: "A sedentary lifestyle increases the risk of heart disease.", synonyms: ["inactive", "desk-bound", "still"], topic: "Health" },
  { word: "curriculum", pos: "noun", definition: "the subjects that make up a course of study", example: "Coding should be part of the national school curriculum.", synonyms: ["syllabus", "programme", "course"], topic: "Education" },
  { word: "innovative", pos: "adjective", definition: "featuring new methods or ideas", example: "Startups often bring innovative solutions to old problems.", synonyms: ["original", "inventive", "groundbreaking"], topic: "Technology" },
  { word: "sustainable", pos: "adjective", definition: "able to be maintained without harming the environment", example: "Cities are investing in sustainable public transport.", synonyms: ["viable", "eco-friendly", "enduring"], topic: "Environment" },
  { word: "disparity", pos: "noun", definition: "a great difference between things", example: "There is a wide disparity in income between regions.", synonyms: ["inequality", "gap", "imbalance"], topic: "Society" },
  { word: "comprehensive", pos: "adjective", definition: "complete and including everything necessary", example: "The report offers a comprehensive overview of the issue.", synonyms: ["thorough", "extensive", "full"], topic: "Academic" },
  { word: "deteriorate", pos: "verb", definition: "to become progressively worse", example: "Air quality tends to deteriorate in industrial areas.", synonyms: ["decline", "worsen", "degrade"], topic: "Environment" },
  { word: "incentive", pos: "noun", definition: "a thing that motivates or encourages action", example: "Tax breaks act as an incentive for green investment.", synonyms: ["motivation", "encouragement", "stimulus"], topic: "Economy" },
  { word: "phenomenon", pos: "noun", definition: "a fact or situation that is observed to exist", example: "Remote work is a growing phenomenon worldwide.", synonyms: ["occurrence", "trend", "event"], topic: "Society" },
  { word: "alleviate", pos: "verb", definition: "to make suffering or a problem less severe", example: "Better infrastructure can alleviate urban poverty.", synonyms: ["ease", "relieve", "reduce"], topic: "Society" },
  { word: "inevitable", pos: "adjective", definition: "certain to happen; unavoidable", example: "Some job losses are an inevitable result of automation.", synonyms: ["unavoidable", "certain", "assured"], topic: "Work" },
  { word: "scrutinise", pos: "verb", definition: "to examine closely and thoroughly", example: "Voters should scrutinise the claims made by politicians.", synonyms: ["examine", "inspect", "analyse"], topic: "Academic" },
  { word: "conducive", pos: "adjective", definition: "making a certain situation or outcome likely", example: "A quiet environment is conducive to studying.", synonyms: ["favourable", "helpful", "beneficial"], topic: "Education" },
  { word: "notion", pos: "noun", definition: "a belief or idea", example: "The notion that money brings happiness is often questioned.", synonyms: ["idea", "concept", "belief"], topic: "Academic" },
  { word: "compelling", pos: "adjective", definition: "evoking strong interest or conviction", example: "There is compelling evidence that exercise improves mood.", synonyms: ["convincing", "persuasive", "forceful"], topic: "Academic" },
  { word: "vulnerable", pos: "adjective", definition: "exposed to the possibility of harm", example: "Elderly people are especially vulnerable to extreme heat.", synonyms: ["at risk", "exposed", "susceptible"], topic: "Health" },
  { word: "streamline", pos: "verb", definition: "to make a process more efficient", example: "Automation can streamline repetitive office tasks.", synonyms: ["simplify", "optimise", "rationalise"], topic: "Work" },
  { word: "paramount", pos: "adjective", definition: "more important than anything else", example: "Data privacy is of paramount importance online.", synonyms: ["supreme", "chief", "foremost"], topic: "Technology" },
  { word: "cultivate", pos: "verb", definition: "to develop or improve a skill or quality", example: "Schools should cultivate critical-thinking skills.", synonyms: ["develop", "foster", "nurture"], topic: "Education" },
  { word: "adverse", pos: "adjective", definition: "preventing success; harmful", example: "The policy had an adverse effect on small businesses.", synonyms: ["unfavourable", "negative", "harmful"], topic: "Economy" },
  { word: "collaborate", pos: "verb", definition: "to work jointly on an activity", example: "Researchers from different fields often collaborate.", synonyms: ["cooperate", "team up", "partner"], topic: "Work" },
  { word: "substantial", pos: "adjective", definition: "of considerable importance, size, or worth", example: "A substantial proportion of energy is still from fossil fuels.", synonyms: ["significant", "considerable", "large"], topic: "Academic" },
  { word: "eradicate", pos: "verb", definition: "to destroy or get rid of completely", example: "It is difficult to eradicate poverty entirely.", synonyms: ["eliminate", "abolish", "wipe out"], topic: "Society" },
  { word: "profound", pos: "adjective", definition: "very great or intense; far-reaching", example: "Technology has had a profound impact on communication.", synonyms: ["deep", "far-reaching", "significant"], topic: "Technology" },
  { word: "deteriorating", pos: "adjective", definition: "becoming progressively worse", example: "Deteriorating infrastructure poses a safety risk.", synonyms: ["declining", "worsening", "failing"], topic: "Society" },
  { word: "autonomy", pos: "noun", definition: "the right or condition of self-government", example: "Employees value autonomy in how they complete tasks.", synonyms: ["independence", "freedom", "self-rule"], topic: "Work" },
  { word: "aesthetic", pos: "adjective", definition: "concerned with beauty or the appreciation of beauty", example: "Good design balances function with aesthetic appeal.", synonyms: ["artistic", "visual", "tasteful"], topic: "Academic" },
  { word: "reinforce", pos: "verb", definition: "to strengthen or support", example: "Repetition helps to reinforce new vocabulary.", synonyms: ["strengthen", "bolster", "support"], topic: "Education" },
  { word: "tangible", pos: "adjective", definition: "clear and definite; real", example: "The project delivered tangible benefits to the community.", synonyms: ["concrete", "real", "measurable"], topic: "Economy" },
  { word: "counterproductive", pos: "adjective", definition: "having the opposite of the desired effect", example: "Overly strict rules can be counterproductive.", synonyms: ["self-defeating", "ineffective", "damaging"], topic: "Society" },
]

export const IELTS_TOPICS = ["All", ...Array.from(new Set(IELTS_WORDS.map((w) => w.topic))).sort()]
