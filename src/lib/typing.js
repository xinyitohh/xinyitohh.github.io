// Pure helpers for the typing challenge (kept out of the component so they can be tested).

const WORDS = (
  "the be to of and a in that have it for not on with he as you do at this but his by from they we say her she or an will my one all would there their what so up out if about who get which go me when make can like time no just him know take people into year your good some could them see other than then now look only come its over think also back after use two how our work first well way even new want because any these give day most us keep every great where again place right still should never through between world under before different small found those both life tell part last long own thing while seem hand high old much help turn start might show city play move live always point house group number follow large often write story light plan open learn change stay build mind real water word call air home read school father mother family friend night morning evening river mountain forest ocean island garden window door table chair paper pencil book letter music dance song voice silence dream idea thought memory reason answer question problem simple complex easy hard quick slow bright dark quiet loud gentle strong weak early late today tomorrow yesterday summer winter spring autumn weather season clouds rain storm wind sunset sunrise shadow mirror bridge road street village country travel journey adventure explore discover create design project system network program computer keyboard screen signal energy motion balance rhythm pattern shape colour circle square line corner center edge surface sound silent smile laugh cry whisper shout listen watch notice imagine wonder believe remember forget decide choose try fail teach practice improve focus finish begin continue return arrive leave enter carry bring throw catch hold release close push pull climb jump walk run swim fly drive ride sleep wake eat drink cook bake taste smell touch feel heal rest breathe grow plant harvest gather share trade borrow lend spend save earn count measure compare match combine divide separate connect collect arrange organize prepare protect support allow require provide include consider suggest expect appear become remain happen lead guide direct order record report review update version future moment instant second minute hour week month decade century ancient modern honest clever careful curious patient generous humble brave calm eager fair proud rare common special perfect natural social public private local global digital physical mental emotional practical creative logical visual verbal coffee tea bread butter cheese apple orange lemon banana pepper salt sugar honey cream soup salad pizza rice noodle chicken fish market kitchen station airport hotel museum library theatre studio office factory tower castle temple stone metal glass wood cotton silver golden purple yellow green black white"
).split(" ");

// A long stream of random words, never the same word twice in a row.
export const makeWords = (n = 400) => {
  const out = [];
  let prev = "";
  while (out.length < n) {
    const w = WORDS[Math.floor(Math.random() * WORDS.length)];
    if (w !== prev) {
      out.push(w);
      prev = w;
    }
  }
  return out;
};

// Score a run the way Monkeytype does: only correct characters count towards WPM
// (5 characters = 1 word), plus one for the space after each fully correct word.
//   words:   the target words
//   typed:   the words the user committed with space
//   current: the partly typed word at the moment time ran out
export const score = (words, typed, current, seconds) => {
  const all = current ? [...typed, current] : typed;
  let typedChars = 0;
  let correctChars = 0;
  all.forEach((t, i) => {
    const target = words[i] ?? "";
    for (let k = 0; k < t.length; k++) {
      typedChars++;
      if (t[k] === target[k]) correctChars++;
    }
  });
  const correctWords = typed.filter((t, i) => t === words[i]).length;
  const minutes = Math.max(seconds, 1) / 60;
  return {
    wpm: (correctChars + correctWords) / 5 / minutes,
    // raw speed counts every character typed, right or wrong, plus a space after each word
    raw: (typedChars + typed.length) / 5 / minutes,
    acc: typedChars ? (correctChars / typedChars) * 100 : 0,
  };
};

// Best wpm from a Monkeytype personal-best entry list, or null.
export const bestOf = (entries) =>
  entries?.length ? Math.max(...entries.map((e) => e.wpm)) : null;
