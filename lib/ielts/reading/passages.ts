import type { ReadingTest } from "./types";

const q = (
  id: string,
  question: string,
  options: [string, string, string, string],
  explanations: [string, string, string, string],
  correctIndex: number
) => ({
  id,
  question,
  options: options.map((text, i) => ({ text, explanation: explanations[i] })) as [
    { text: string; explanation: string },
    { text: string; explanation: string },
    { text: string; explanation: string },
    { text: string; explanation: string },
  ],
  correctIndex,
});

export const OFFICIAL_READING_TEST: ReadingTest = {
  id: "official-reading-v1",
  title: "IELTS Academic Reading — 5 Passages",
  source: "official",
  passages: [
    {
      id: "p1",
      title: "The Invention of Paper",
      subtitle: "Passage 1",
      content: `Before paper became widespread, civilisations relied on clay tablets, papyrus, parchment, and bamboo strips to record information. Each material had serious drawbacks: clay was heavy, papyrus rotted in damp climates, parchment required animal skins, and bamboo was awkward to store.

The breakthrough came in China around 105 CE, traditionally credited to Cai Lun, an official of the Han court. He developed a pulp made from tree bark, hemp, fishing nets, and rags. The fibres were soaked, beaten, screened, pressed, and dried into thin, flexible sheets. Unlike papyrus, the new material could be produced locally from inexpensive waste products.

Paper spread slowly along trade routes. It reached the Islamic world by the eighth century, where mills in Baghdad refined production techniques. European papermaking lagged behind until the twelfth century, partly because parchment remained prestigious for legal and religious documents. The printing revolution of the fifteenth century finally made paper indispensable: movable type required a cheap, uniform surface that could be mass-produced.

Historians note that paper did more than replace older writing surfaces. It encouraged bureaucracy, standardised education, and allowed ideas to circulate across social classes. Yet early paper was fragile compared with modern acid-free varieties, which is why many medieval manuscripts survive on parchment rather than paper.`,
      vocabulary: [
        { word: "parchment", definition: "writing material made from animal skin" },
        { word: "pulp", definition: "softened fibres used to make paper" },
        { word: "prestigious", definition: "respected and admired; high-status" },
        { word: "indispensable", definition: "absolutely necessary; cannot be done without" },
        { word: "manuscripts", definition: "documents written by hand before printing" },
        { word: "bureaucracy", definition: "system of government offices and official rules" },
        { word: "circulate", definition: "move around and spread among people" },
        { word: "fragile", definition: "easily broken or damaged" },
      ],
      questions: [
        q(
          "p1-q1",
          "What problem with papyrus is mentioned in the passage?",
          [
            "It could not be produced locally",
            "It deteriorated in wet conditions",
            "It was too expensive for ordinary people",
            "It was unsuitable for printing",
          ],
          [
            "The passage says papyrus was heavy, not that it could not be produced locally.",
            "The text states that papyrus 'rotted in damp climates'.",
            "Cost is not given as a drawback of papyrus in this passage.",
            "Printing is discussed later; papyrus drawbacks are listed at the start.",
          ],
          1
        ),
        q(
          "p1-q2",
          "According to the passage, Cai Lun's paper was made from",
          [
            "animal skins and plant leaves only",
            "tree bark, hemp, nets, and rags",
            "bamboo and clay mixtures",
            "imported Middle Eastern fibres",
          ],
          [
            "Animal skins describe parchment, not Cai Lun's method.",
            "The passage lists 'tree bark, hemp, fishing nets, and rags'.",
            "Bamboo and clay are mentioned as earlier materials, not ingredients in his pulp.",
            "Middle Eastern refinement came later; the fibres were local waste products.",
          ],
          1
        ),
        q(
          "p1-q3",
          "Why did Europeans continue using parchment for some documents?",
          [
            "Paper mills had not yet been invented in Europe",
            "Parchment was considered more suitable for important texts",
            "Paper from China was banned by church authorities",
            "Parchment was cheaper to manufacture",
          ],
          [
            "European papermaking existed from the twelfth century; the issue was prestige.",
            "The passage says parchment 'remained prestigious for legal and religious documents'.",
            "No ban is mentioned in the text.",
            "The passage implies paper became the cheap option, not parchment.",
          ],
          1
        ),
        q(
          "p1-q4",
          "What broader effect of paper does the author emphasise?",
          [
            "It replaced all parchment within one century",
            "It helped spread information across society",
            "It made medieval manuscripts more durable",
            "It reduced the need for international trade",
          ],
          [
            "Replacement was gradual; parchment manuscripts still survive.",
            "The author says paper 'allowed ideas to circulate across social classes'.",
            "Early paper was fragile; durability is contrasted with parchment survival.",
            "Trade routes spread paper; trade itself is not said to decline.",
          ],
          1
        ),
      ],
    },
    {
      id: "p2",
      title: "Sleep and Memory Consolidation",
      subtitle: "Passage 2",
      content: `Neuroscientists have long suspected that sleep is not merely rest but an active stage of learning. During slow-wave sleep, the brain replays patterns of activity experienced while awake, strengthening connections between neurons. This process, known as consolidation, helps transform fragile short-term memories into more stable long-term storage.

Experiments with vocabulary learning illustrate the effect clearly. Participants who studied word lists in the evening and slept before testing recalled significantly more items than those who studied in the morning and remained awake during the day. The difference persists even when total time since learning is held constant, suggesting that sleep itself—not just the passage of time—matters.

Not all sleep stages contribute equally. Rapid eye movement (REM) sleep appears especially important for procedural skills such as playing a musical passage or solving a motor task. Declarative memories—facts and events—benefit more from deep non-REM sleep. Disrupting either stage with brief awakenings reduces performance, which may explain why fragmented sleep leaves people feeling mentally dull despite adequate hours in bed.

Practical implications are debated. Some educators propose scheduling difficult material before bedtime, while others warn that fatigue from late-night study can impair initial encoding. What seems clear is that cramming without subsequent sleep produces weaker retention than distributed practice combined with normal rest.`,
      vocabulary: [
        { word: "consolidation", definition: "process of making memories stronger and more stable" },
        { word: "procedural", definition: "relating to skills and how to do something" },
        { word: "declarative", definition: "relating to facts and information you can state" },
        { word: "fragmented", definition: "broken into short, interrupted pieces" },
        { word: "encoding", definition: "first stage of learning when information is recorded" },
        { word: "retention", definition: "ability to keep and remember information over time" },
        { word: "impair", definition: "weaken or damage something" },
        { word: "distributed", definition: "spread out over time rather than in one block" },
      ],
      questions: [
        q(
          "p2-q1",
          "Consolidation during sleep involves",
          [
            "reducing the number of active neurons",
            "repeating and strengthening neural patterns",
            "converting long-term memories into short-term ones",
            "blocking procedural learning entirely",
          ],
          [
            "The brain strengthens connections; it does not reduce neurons.",
            "The passage describes the brain 'replays patterns' and strengthens connections.",
            "The direction is short-term to long-term, not the reverse.",
            "REM sleep supports procedural skills; it is not blocked.",
          ],
          1
        ),
        q(
          "p2-q2",
          "The vocabulary experiments suggest that",
          [
            "morning study is always more effective",
            "sleep has a unique benefit beyond elapsed time",
            "participants forgot words after one night",
            "total study time was different between groups",
          ],
          [
            "Evening study plus sleep outperformed morning study; morning is not always better.",
            "Results held when 'total time since learning is held constant'.",
            "Participants recalled more after sleep, not less.",
            "The passage says total time was held constant.",
          ],
          1
        ),
        q(
          "p2-q3",
          "According to the passage, REM sleep is particularly linked to",
          [
            "remembering historical dates",
            "learning physical or skill-based tasks",
            "deep non-REM brain waves",
            "recovering from sleep fragmentation",
          ],
          [
            "Facts and events relate to declarative memory and non-REM sleep.",
            "REM is 'especially important for procedural skills' like motor tasks.",
            "REM and non-REM are different stages, not one linked to the other.",
            "Fragmented sleep reduces performance; REM is not described as recovery.",
          ],
          1
        ),
        q(
          "p2-q4",
          "What comparison does the author make about cramming?",
          [
            "Cramming is superior if done before REM sleep",
            "Cramming without sleep leads to weaker retention",
            "Cramming and distributed practice are equally effective",
            "Cramming improves initial encoding but not recall",
          ],
          [
            "No superiority of cramming before REM is stated.",
            "The passage says cramming without sleep produces weaker retention.",
            "Distributed practice with rest is presented as better.",
            "Late-night study may impair encoding; cramming is not praised.",
          ],
          1
        ),
      ],
    },
    {
      id: "p3",
      title: "Vertical Farming in Cities",
      subtitle: "Passage 3",
      content: `As urban populations grow, supplying fresh produce without expanding farmland has become a pressing challenge. Vertical farms address this by growing crops indoors on stacked layers, often under LED lighting and precise climate control. Advocates argue that locating production inside or near cities reduces transport emissions and water use.

Hydroponic and aeroponic systems circulate nutrient-rich water or mist directly to plant roots, using up to ninety percent less water than field agriculture. Because environments are enclosed, pesticides are rarely needed, and growing seasons are independent of outdoor weather. Yields per square metre can exceed traditional farms when light and nutrients are optimised.

Critics point to energy costs. Artificial lighting and ventilation can make vertical farms carbon-intensive unless powered by renewables. High setup expenses also limit crops to those with rapid growth and high market value, such as leafy greens and herbs. Staple grains remain economically impractical in most vertical facilities.

Urban planners view the technology as complementary rather than revolutionary. Vertical farms may secure local salad supplies but are unlikely to replace broad-acre farming in the near future. Their greatest promise may lie in food security for dense districts with limited arable land nearby.`,
      vocabulary: [
        { word: "hydroponic", definition: "growing plants in water with nutrients, without soil" },
        { word: "aeroponic", definition: "growing plants with roots in air and nutrient mist" },
        { word: "enclosed", definition: "surrounded and shut in from the outside" },
        { word: "carbon-intensive", definition: "using a lot of energy and producing much CO₂" },
        { word: "complementary", definition: "adding to something else rather than replacing it" },
        { word: "arable", definition: "suitable for growing crops" },
        { word: "staple", definition: "basic food that people eat regularly" },
        { word: "renewables", definition: "energy from sources that naturally replenish" },
      ],
      questions: [
        q(
          "p3-q1",
          "One environmental advantage claimed for vertical farms is",
          [
            "eliminating the need for any electricity",
            "lower water consumption compared with fields",
            "complete independence from urban infrastructure",
            "automatic conversion of grains into vegetables",
          ],
          [
            "LED lighting requires electricity; it is not eliminated.",
            "Systems may use 'up to ninety percent less water than field agriculture'.",
            "Farms are in cities and rely on controlled environments.",
            "Grains are said to be impractical, not converted.",
          ],
          1
        ),
        q(
          "p3-q2",
          "Why are pesticides seldom required in vertical farms?",
          [
            "Crops are genetically modified to resist all insects",
            "Growing takes place in enclosed, controlled spaces",
            "LED lights destroy harmful bacteria automatically",
            "Urban air pollution repels pests naturally",
          ],
          [
            "Genetic modification is not mentioned.",
            "Enclosed environments reduce pest exposure.",
            "LEDs provide light; they are not described as antibacterial.",
            "Urban pollution is not cited as pest control.",
          ],
          1
        ),
        q(
          "p3-q3",
          "A major economic limitation discussed is that",
          [
            "only government subsidies make vertical farms profitable",
            "high costs restrict which crops can be grown",
            "consumers refuse to buy indoor produce",
            "transport savings exceed energy bills in all cases",
          ],
          [
            "Subsidies are not discussed.",
            "High setup costs limit crops to fast-growing, high-value plants.",
            "Consumer refusal is not mentioned.",
            "Energy costs can make farms carbon-intensive; transport savings do not always win.",
          ],
          1
        ),
        q(
          "p3-q4",
          "The author's overall view of vertical farming is that it",
          [
            "will soon replace all traditional agriculture",
            "mainly threatens rural employment",
            "can supplement urban food supply but not replace field farms",
            "has failed to produce measurable yields",
          ],
          [
            "The text says it is 'unlikely to replace broad-acre farming'.",
            "Rural employment is not discussed.",
            "Planners see it as 'complementary' for dense districts.",
            "Yields can exceed traditional farms per square metre when optimised.",
          ],
          2
        ),
      ],
    },
    {
      id: "p4",
      title: "Measuring Time Through History",
      subtitle: "Passage 4",
      content: `For most of human history, timekeeping followed natural cycles: the sun, moon, and seasons organised agricultural and religious life. Sundials worked adequately near the equator but became unreliable at higher latitudes and useless at night. Water clocks and candle clocks filled gaps yet varied with temperature and humidity.

Mechanical clocks appeared in European monasteries during the medieval period, driven by weights and regulated by escapements. Towns soon installed public clocks that coordinated markets and workshops. However, each city kept local solar time until railways demanded synchronisation. In Britain, standard time was adopted in the 1840s to prevent collisions on expanding rail networks.

The next revolution came with quartz crystals and atomic oscillations. Quartz watches, popular from the 1970s, offered affordable precision for daily life. Atomic clocks, measuring vibrations of caesium atoms, now define the international second and underpin global positioning systems. Modern smartphones inherit this accuracy while displaying time adjusted to local zones automatically.

Historians observe that measuring time precisely did not simply reflect technological curiosity; it reshaped labour, travel, and international communication. Debates continue over daylight saving and whether always-connected devices have made people more punctual or merely more anxious about minutes lost.`,
      vocabulary: [
        { word: "escapements", definition: "mechanisms that regulate the movement of a clock" },
        { word: "synchronisation", definition: "making clocks or schedules match the same time" },
        { word: "oscillations", definition: "regular back-and-forth vibrations" },
        { word: "caesium", definition: "a chemical element used in atomic clocks" },
        { word: "punctual", definition: "arriving or happening at the expected time" },
        { word: "latitude", definition: "distance north or south of the equator" },
        { word: "mechanical", definition: "operated by physical parts and movement" },
        { word: "curiosity", definition: "desire to know or learn about something" },
      ],
      questions: [
        q(
          "p4-q1",
          "Sundials were limited because they",
          [
            "were forbidden by religious authorities",
            "depended on sunlight and latitude",
            "required atomic calibration",
            "could not be built near monasteries",
          ],
          [
            "Religious forbidding is not mentioned.",
            "They were 'unreliable at higher latitudes and useless at night'.",
            "Atomic calibration came much later.",
            "Monasteries later used mechanical clocks; no ban on sundials is stated.",
          ],
          1
        ),
        q(
          "p4-q2",
          "Standard time in Britain was introduced primarily to",
          [
            "replace sundials in private homes",
            "coordinate railway schedules safely",
            "compete with quartz watch manufacturers",
            "simplify international atomic agreements",
          ],
          [
            "Sundials were already inadequate; railways drove standardisation.",
            "Standard time was adopted 'to prevent collisions on expanding rail networks'.",
            "Quartz watches came in the 1970s, long after the 1840s.",
            "Atomic agreements are a twentieth-century topic.",
          ],
          1
        ),
        q(
          "p4-q3",
          "Atomic clocks are significant today because they",
          [
            "define the standard unit of the second",
            "are worn on the wrist by most workers",
            "eliminate the need for time zones",
            "were invented in medieval monasteries",
          ],
          [
            "They 'define the international second' and support GPS.",
            "Quartz, not atomic, watches became affordable for daily life.",
            "Smartphones still display local zones.",
            "Medieval devices were mechanical weight-driven clocks.",
          ],
          0
        ),
        q(
          "p4-q4",
          "What ongoing discussion does the passage mention?",
          [
            "Whether precise timekeeping changed human behaviour",
            "Whether sundials should return in cities",
            "Whether railways should abandon standard time",
            "Whether candles are more accurate than quartz",
          ],
          [
            "Debates continue over daylight saving and anxiety about minutes lost.",
            "Sundial revival is not discussed.",
            "Railways led to standard time; abandoning it is not suggested.",
            "Candles varied with humidity; quartz is more precise.",
          ],
          0
        ),
      ],
    },
    {
      id: "p5",
      title: "Plastic Pollution in the Oceans",
      subtitle: "Passage 5",
      content: `Each year millions of tonnes of plastic enter marine environments, originating from poorly managed waste, fishing gear, and microfibres released during laundry. Unlike organic debris, most conventional plastics resist biological breakdown, persisting for decades while fragmenting into smaller particles.

Microplastics—pieces smaller than five millimetres—have been found from Arctic ice to deep-sea trenches. They adsorb toxic chemicals and can be ingested by plankton, fish, and seabirds, raising concerns about food webs and human seafood consumption. Laboratory studies show inflammation and reduced feeding in several species, though long-term ecosystem effects remain uncertain.

Cleanup proposals range from coastal volunteer campaigns to engineered floating barriers in ocean gyres. Experts caution that collection at sea is costly and technically difficult compared with preventing waste on land. Policies emphasising reduction, reuse, and extended producer responsibility have gained support, alongside bans on single-use items in numerous countries.

Innovation in biodegradable polymers and improved recycling infrastructure offers partial hope. Yet replacing cheap virgin plastic in packaging requires economic incentives and consumer behaviour change. Scientists stress that without systemic reduction at the source, ocean cleanup alone cannot solve the scale of the problem.`,
      vocabulary: [
        { word: "microplastics", definition: "tiny plastic pieces smaller than five millimetres" },
        { word: "ingested", definition: "swallowed or taken into the body" },
        { word: "adsorb", definition: "collect and hold substances on a surface" },
        { word: "biodegradable", definition: "able to break down naturally without harm" },
        { word: "virgin", definition: "new and unused, not recycled" },
        { word: "gyres", definition: "large circular patterns of ocean currents" },
        { word: "infrastructure", definition: "basic systems and facilities a society needs" },
        { word: "systemic", definition: "affecting the whole system, not just one part" },
      ],
      questions: [
        q(
          "p5-q1",
          "According to the passage, conventional plastics in the ocean",
          [
            "decompose within months like organic matter",
            "break into smaller pieces over long periods",
            "are produced mainly by deep-sea species",
            "absorb no external chemicals",
          ],
          [
            "Plastics 'resist biological breakdown' unlike organic debris.",
            "They persist while 'fragmenting into smaller particles'.",
            "Plastic originates from waste and fishing gear, not sea life.",
            "Microplastics 'adsorb toxic chemicals'.",
          ],
          1
        ),
        q(
          "p5-q2",
          "Why are microplastics a concern for humans?",
          [
            "They block smartphone GPS signals at sea",
            "They may enter food chains leading to seafood",
            "They increase Arctic ice formation",
            "They eliminate plankton populations entirely",
          ],
          [
            "GPS is unrelated to this passage.",
            "Ingestion moves through food webs, raising concerns about seafood consumption.",
            "Microplastics are found in ice; they do not create it.",
            "Effects on feeding are noted; total elimination is not claimed.",
          ],
          1
        ),
        q(
          "p5-q3",
          "Experts believe the most effective strategy should focus on",
          [
            "ocean collection before land-based action",
            "preventing plastic waste before it reaches the sea",
            "replacing all fish with laboratory protein",
            "banning laundry worldwide",
          ],
          [
            "Sea collection is costly; prevention on land is prioritised.",
            "Policies emphasise reduction at source; cleanup alone is insufficient.",
            "Fish replacement is not mentioned.",
            "Microfibres from laundry are one source; a global laundry ban is not proposed.",
          ],
          1
        ),
        q(
          "p5-q4",
          "What obstacle to biodegradable alternatives is mentioned?",
          [
            "They dissolve too quickly in packaging use",
            "Economic factors and habits sustain cheap virgin plastic",
            "International law forbids all new polymers",
            "Recycling infrastructure is already fully adequate",
          ],
          [
            "Quick dissolution is not cited as the problem.",
            "Replacing virgin plastic 'requires economic incentives and consumer behaviour change'.",
            "No international ban on polymers is described.",
            "Infrastructure needs improvement; it is not described as fully adequate.",
          ],
          1
        ),
      ],
    },
  ],
};

export function getOfficialQuestionCount() {
  return OFFICIAL_READING_TEST.passages.reduce((n, p) => n + p.questions.length, 0);
}
