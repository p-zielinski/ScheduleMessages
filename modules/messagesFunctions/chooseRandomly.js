const chooseRandomly = (tekst) => {
  const findAllSpecialCharacters = (e) => {
    let ar = [];
    for (let i = 0; i < e.length; i++) {
      if (e[i] === "{" || e[i] === "}") {
        ar.push([e[i], i]);
      }
    }
    return ar;
  };
  let e = findAllSpecialCharacters(tekst);

  let i = 0;
  while (i < e.length) {
    //randomly choosing options for final result
    if (e[i][0] === "}") {
      const sliced = tekst.slice(e[i - 1][1] + 1, e[i][1]); //part inside { ... }
      let options = sliced.split("|");
      let temp_ = options[Math.floor(Math.random() * options.length)]; //radnomly choose an option: 1 | 2 | 3...

      tekst =
        tekst.slice(0, e[i - 1][1]) +
        temp_ +
        tekst.slice(e[i][1] + 1, tekst.length); // new text

      e = findAllSpecialCharacters(tekst); //get new build.
      i = i - 2;
    }
    i++;
  }

  while (tekst.includes("  ")) {
    tekst = tekst.replace(/\ \ /g, " ");
  }
  while (tekst.includes("\n\n\n")) {
    tekst = tekst.replace(/\n\n\n/g, "\n\n");
  }

  return tekst;
};

module.exports = chooseRandomly;
